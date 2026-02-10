export interface ScoringResult {
  status: 'approved' | 'rejected' | 'in_review'
  interestRate: number // Monthly
  maxAmount: number
  message: string
}

export interface PaymentPlanItem {
  installmentNumber: number
  dueDate: Date
  amount: number
  principal: number
  interest: number
  remainingBalance: number
}

// Lógica de Scoring basada en Salario
export function evaluateCreditRisk(salary: number, requestedAmount: number): ScoringResult {
  // Regla 1: Salario Mínimo de Riesgo ($1.5M)
  if (salary < 1500000) {
    return {
      status: 'rejected',
      interestRate: 0,
      maxAmount: 0,
      message: 'Ingresos insuficientes para la política de riesgo actual.'
    }
  }

  // Regla 2: Capacidad de Endeudamiento (Cuota aprox < 30% Salario)
  // Estimación rápida: Cuota = Monto / 12 (ajuste grueso)
  if (requestedAmount / 12 > salary * 0.45) {
     return {
      status: 'rejected',
      interestRate: 0,
      maxAmount: salary * 0.3 * 12,
      message: 'El monto solicitado excede su capacidad de pago estimada.'
    }
  }

  // Regla 3: Clasificación por Nivel de Ingresos
  if (salary >= 3000000) {
    return {
      status: 'approved',
      interestRate: 1.5, // 1.5% MV (Mejor tasa)
      maxAmount: salary * 10,
      message: '¡Felicidades! Su crédito ha sido pre-aprobado con tasa preferencial.'
    }
  } else {
    return {
      status: 'in_review', // Requiere revisión humana o documentos extra
      interestRate: 2.2, // 2.2% MV (Riesgo medio)
      maxAmount: salary * 5,
      message: 'Su solicitud ha sido recibida y está en proceso de análisis.'
    }
  }
}

// Generador de Plan de Pagos (Sistema Francés - Cuota Fija)
export function generateAmortizationSchedule(
  amount: number,
  termMonths: number,
  monthlyRatePercent: number
): PaymentPlanItem[] {
  const rate = monthlyRatePercent / 100
  
  // Fórmula de Cuota Fija: R = P * [i * (1+i)^n] / [(1+i)^n - 1]
  const fixedMonthlyPayment = (amount * rate * Math.pow(1 + rate, termMonths)) / (Math.pow(1 + rate, termMonths) - 1)
  
  let balance = amount
  const plan: PaymentPlanItem[] = []
  const today = new Date()

  for (let i = 1; i <= termMonths; i++) {
    const interest = balance * rate
    const principal = fixedMonthlyPayment - interest
    balance -= principal

    // Fecha de pago: +1 mes cada vez
    const dueDate = new Date(today)
    dueDate.setMonth(today.getMonth() + i)

    plan.push({
      installmentNumber: i,
      dueDate: dueDate,
      amount: Number(fixedMonthlyPayment.toFixed(2)),
      principal: Number(principal.toFixed(2)),
      interest: Number(interest.toFixed(2)),
      remainingBalance: Math.max(0, Number(balance.toFixed(2)))
    })
  }

  return plan
}
