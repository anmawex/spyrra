import { z } from 'zod'

// Mensajes en español
const REQUIRED = 'Este campo es obligatorio'
const INVALID_EMAIL = 'Email inválido'
const POSITIVE_NUMBER = 'Debe ser un valor positivo'
const MIN_SALARY = 1000000

// Esquema de Información Personal (Step 1)
export const personalInfoSchema = z.object({
  fullName: z.string()
    .min(3, { message: 'Mínimo 3 caracteres' })
    .max(100, { message: 'Máximo 100 caracteres' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Solo letras y espacios' }),
  
  email: z.string()
    .email({ message: INVALID_EMAIL }),
  
  phone: z.string()
    .min(10, { message: 'Mínimo 10 dígitos' })
    .max(15, { message: 'Máximo 15 dígitos' })
    .regex(/^\+?[0-9\s-]+$/, { message: 'Formato inválido (Ej: +57 300 123 4567)' }),
  
  salary: z.coerce.number() // Convierte string a número si es necesario
    .positive({ message: POSITIVE_NUMBER })
    .min(MIN_SALARY, { message: `Salario mínimo: $${MIN_SALARY.toLocaleString()}` })
})

// Esquema de Identidad (Step 2)
export const identitySchema = z.object({
  idDocument: z.string()
    .min(6, { message: 'Documento inválido (Mín. 6 dígitos)' })
    .max(20)
    .regex(/^[0-9]+$/, { message: 'Solo números' }),
  
  idIssueDate: z.string()
    .refine((date) => {
      // Validar que sea una fecha pasada y mayor de edad (aprox)
      const issue = new Date(date)
      const now = new Date()
      const minAge = 18 * 365 * 24 * 60 * 60 * 1000 // 18 años en ms
      return issue < now && (now.getTime() - issue.getTime() > minAge)
    }, { message: 'Debes ser mayor de edad (~18 años de expedición)' })
})

// Tipos inferidos
export type PersonalInfoInputs = z.infer<typeof personalInfoSchema>
export type IdentityInputs = z.infer<typeof identitySchema>
