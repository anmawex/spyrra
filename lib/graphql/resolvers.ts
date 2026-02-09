import { prisma } from '../prisma'

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
      return await prisma.creditRequest.update({
        where: { id: input.id },
        data: { 
          status: input.status,
          approvalDate: input.status === 'approved' ? new Date() : undefined,
        },
        include: {
          user: true,
          paymentInstallments: true,
        },
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
      })
    },
  },

  PaymentInstallment: {
    creditRequest: async (parent: any) => {
      return await prisma.creditRequest.findUnique({
        where: { id: parent.creditRequestId },
      })
    },
  },
}
