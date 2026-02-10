import { prisma } from '../prisma'
import { evaluateCreditRisk, generateAmortizationSchedule, PaymentPlanItem } from '@/features/loans/logic/creditScoring'

export const resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany({
        include: {
          creditRequests: true,
        },
      })
    },
    
    user: async (_: any, { id }: { id: string }) => {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          creditRequests: true,
        },
      })
    },
    
    creditRequests: async () => {
      return await prisma.creditRequest.findMany({
        include: {
          user: true,
          paymentInstallments: true,
        },
      })
    },
    
    creditRequest: async (_: any, { id }: { id: string }) => {
      return await prisma.creditRequest.findUnique({
        where: { id },
        include: {
          user: true,
          paymentInstallments: true,
        },
      })
    },
    
    userCreditRequests: async (_: any, { userId }: { userId: string }) => {
      return await prisma.creditRequest.findMany({
        where: { userId },
        include: {
          user: true,
          paymentInstallments: true,
        },
      })
    },
    
    paymentInstallments: async (_: any, { creditRequestId }: { creditRequestId: string }) => {
      return await prisma.paymentInstallment.findMany({
        where: { creditRequestId },
        include: {
          creditRequest: true,
        },
      })
    },

    userByEmail: async (_: any, { email }: { email: string }) => {
      return await prisma.user.findUnique({
        where: { email },
        include: {
          creditRequests: {
            include: {
              paymentInstallments: {
                orderBy: { installmentNumber: 'asc' }
              }
            }
          },
        },
      })
    },
  },

  Mutation: {
    createUser: async (_: any, { input }: { input: { email: string; name: string; phone?: string } }) => {
      return await prisma.user.create({
        data: input,
      })
    },
    
    createCreditRequest: async (
      _: any,
      { input }: { input: { userId: string; amount: number; interestRate: number; termMonths: number } }
    ) => {
      return await prisma.creditRequest.create({
        data: input,
        include: {
          user: true,
          paymentInstallments: true,
        },
      })
    },
    
    updateCreditRequestStatus: async (
      _: any,
      { input }: { input: { id: string; status: string } }
    ) => {
      const now = new Date()
      return await prisma.creditRequest.update({
        where: { id: input.id },
        data: { 
          status: input.status,
          approvalDate: input.status === 'approved' ? now : null,
        },
        include: {
          user: true,
          paymentInstallments: true,
        },
      })
    },

    submitLoanApplication: async (
      _: any, 
      { input }: { input: { 
        fullName: string, 
        email: string, 
        phone: string, 
        salary: number, 
        idDocument: string, 
        idIssueDate: string, 
        amount: number, 
        termMonths: number 
      }}
    ) => {
      try {
        // 1. Upsert User (Buscar o Crear)
        const user = await prisma.user.upsert({
          where: { email: input.email },
          update: {
            name: input.fullName,
            phone: input.phone,
            // Podríamos guardar idDocument en User si tuviéramos el campo, pero por ahora solo está en el input.
            // Para simplificar, asumimos que el usuario se identifica por email.
          },
          create: {
            email: input.email,
            name: input.fullName,
            phone: input.phone,
          }
        })

        // 2. Evaluar Riesgo (Scoring)
        const scoring = evaluateCreditRisk(input.salary, input.amount)
        
        // 3. Crear Solicitud de Crédito
        const creditRequest = await prisma.creditRequest.create({
          data: {
            userId: user.id,
            amount: input.amount,
            interestRate: scoring.interestRate, // Tasa decidida por el sistema
            termMonths: input.termMonths,
            status: scoring.status,
            requestDate: new Date(),
            approvalDate: scoring.status === 'approved' ? new Date() : null,
          }
        })

        let paymentPlan: any[] = []
        let totalPayment = 0
        let monthlyPaymentObj = 0

        // 4. Si es Aprobado/En Revisión, Generar Plan de Pagos
        if (scoring.status !== 'rejected') {
          const schedule = generateAmortizationSchedule(input.amount, input.termMonths, scoring.interestRate)
          
          paymentPlan = schedule.map(item => ({
            ...item,
            // Convertir fechas a string si GraphQL lo requiere como String, o Date si el scalar lo permite.
            // En schema.prisma PaymentInstallment.dueDate es DateTime.
            // En schema.ts PaymentInstallment.dueDate es String!.
            // Prisma devuelve Date, pero GraphQL espera String. Apollo Server suele manejar Date -> String (ISO).
            // Pero para seguridad, lo convertiremos en el resolver de campo o aquí si devolvemos objeto plano.
            dueDate: item.dueDate.toISOString() 
          }))

          totalPayment = schedule.reduce((sum, item) => sum + item.amount, 0)
          monthlyPaymentObj = schedule.length > 0 ? schedule[0].amount : 0

          // Persistir cuotas en la base de datos (Opcional: Si solo es simulación, no guardaríamos. Pero el usuario pidió persistencia).
          // Guardaremos las cuotas asociadas al request.
          await prisma.paymentInstallment.createMany({
            data: schedule.map(item => ({
              creditRequestId: creditRequest.id,
              installmentNumber: item.installmentNumber,
              dueDate: item.dueDate,
              amount: item.amount,
              principal: item.principal,
              interest: item.interest,
              status: 'pending'
            }))
          })
        }

        // 5. Retornar Respuesta Compleja
        return {
          success: true,
          message: scoring.message,
          status: scoring.status,
          interestRate: scoring.interestRate,
          monthlyPayment: monthlyPaymentObj,
          totalPayment: totalPayment,
          creditRequestId: creditRequest.id,
          paymentPlan: paymentPlan // Array de objetos simples
        }

      } catch (error: any) {
        console.error('Error submitting loan:', error)
        return {
          success: false,
          message: 'Error interno procesando la solicitud: ' + error.message,
          status: 'error',
          interestRate: 0,
          monthlyPayment: 0,
          totalPayment: 0,
          creditRequestId: null,
          paymentPlan: []
        }
      }
    },

    payInstallment: async (_: any, { id }: { id: string }) => {
      const installment = await prisma.paymentInstallment.findUnique({
        where: { id }
      })

      if (!installment) {
        throw new Error('Cuota no encontrada')
      }

      if (installment.status === 'paid') {
        throw new Error('Esta cuota ya ha sido pagada')
      }

      return await prisma.paymentInstallment.update({
        where: { id },
        data: {
          status: 'paid',
          paidDate: new Date()
        },
        include: {
          creditRequest: true
        }
      })
    },
  },

  User: {
    creditRequests: async (parent: any) => {
      return await prisma.creditRequest.findMany({
        where: { userId: parent.id },
      })
    },
  },

  CreditRequest: {
    user: async (parent: any) => {
      return await prisma.user.findUnique({
        where: { id: parent.userId },
      })
    },
    paymentInstallments: async (parent: any) => {
      return await prisma.paymentInstallment.findMany({
        where: { creditRequestId: parent.id },
        orderBy: { installmentNumber: 'asc' } // Ordenar por número de cuota
      })
    },
    // Añadimos conversion de fechas a string para GraphQL
    requestDate: (parent: any) => parent.requestDate ? new Date(parent.requestDate).toISOString() : null,
    approvalDate: (parent: any) => parent.approvalDate ? new Date(parent.approvalDate).toISOString() : null,
    createdAt: (parent: any) => new Date(parent.createdAt).toISOString(),
    updatedAt: (parent: any) => new Date(parent.updatedAt).toISOString(),
  },

  PaymentInstallment: {
    creditRequest: async (parent: any) => {
      return await prisma.creditRequest.findUnique({
        where: { id: parent.creditRequestId },
      })
    },
    dueDate: (parent: any) => new Date(parent.dueDate).toISOString(),
    paidDate: (parent: any) => parent.paidDate ? new Date(parent.paidDate).toISOString() : null,
    createdAt: (parent: any) => new Date(parent.createdAt).toISOString(),
    updatedAt: (parent: any) => new Date(parent.updatedAt).toISOString(),
  },
}
