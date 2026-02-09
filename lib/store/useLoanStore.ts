import { create } from 'zustand'

// Define la estructura de nuestros datos del wizard
export interface WizardData {
  // Paso 1: Información Personal
  fullName: string
  email: string
  phone: string
  salary: number
  
  // Paso 2: Validación de Identidad
  idDocument: string
  idIssueDate: string
}

// Define el estado global y las acciones
interface LoanState {
  // Datos del crédito (Slider)
  loanAmount: number
  termMonths: number
  
  // Datos del formulario (Wizard)
  currentStep: number
  wizardData: WizardData
  
  // Acciones (Funciones para modificar el estado)
  setLoanAmount: (amount: number) => void
  setTermMonths: (months: number) => void
  setCurrentStep: (step: number) => void
  updateWizardData: (data: Partial<WizardData>) => void
  resetStore: () => void
}

const DEFAULT_WIZARD_DATA = {
  fullName: '',
  email: '',
  phone: '',
  salary: 0,
  idDocument: '',
  idIssueDate: '',
}

export const useLoanStore = create<LoanState>((set) => ({
  // Valores iniciales
  loanAmount: 1000000, // 1 Millón por defecto
  termMonths: 12,      // 12 meses por defecto
  currentStep: 1,      // Empezamos en el paso 1
  wizardData: DEFAULT_WIZARD_DATA,

  // Acciones
  setLoanAmount: (amount) => set({ loanAmount: amount }),
  setTermMonths: (months) => set({ termMonths: months }),
  
  // Navegación segura (No puedes saltar a pasos negativos, pero sí ir atrás)
  setCurrentStep: (step) => set((state) => ({ 
    currentStep: Math.max(1, Math.min(step, 3)) 
  })),
  
  updateWizardData: (data) => set((state) => ({
    wizardData: { ...state.wizardData, ...data }
  })),
  
  resetStore: () => set({
    loanAmount: 1000000,
    termMonths: 12,
    currentStep: 1,
    wizardData: DEFAULT_WIZARD_DATA
  })
}))
