# Spyrra - Sistema de Gestión de Créditos

Sistema de gestión de solicitudes de crédito con GraphQL API y PostgreSQL (Supabase).

## 🚀 Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Base de Datos**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **API**: GraphQL con Apollo Server
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4

## 📊 Modelos de Datos

### User (Usuario)
- `id`: UUID único
- `email`: Email único del usuario
- `name`: Nombre completo
- `phone`: Teléfono (opcional)
- `creditRequests`: Relación con solicitudes de crédito

### CreditRequest (Solicitud de Crédito)
- `id`: UUID único
- `userId`: ID del usuario solicitante
- `amount`: Monto del crédito
- `interestRate`: Tasa de interés
- `termMonths`: Plazo en meses
- `status`: Estado (pending, approved, rejected, active, completed)
- `requestDate`: Fecha de solicitud
- `approvalDate`: Fecha de aprobación (opcional)
- `paymentInstallments`: Relación con cuotas de pago

### PaymentInstallment (Cuota de Pago)
- `id`: UUID único
- `creditRequestId`: ID de la solicitud de crédito
- `installmentNumber`: Número de cuota
- `dueDate`: Fecha de vencimiento
- `amount`: Monto total de la cuota
- `principal`: Capital
- `interest`: Interés
- `status`: Estado (pending, paid, overdue)
- `paidDate`: Fecha de pago (opcional)

## 🛠️ Configuración Inicial

### 1. Clonar y Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve a **Project Settings** → **Database**
3. Copia la **Connection String** (se recomienda usar "Connection pooling")
4. Actualiza el archivo `.env`:

\`\`\`env
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@[TU-PROJECT-REF].supabase.co:5432/postgres"
\`\`\`

### 3. Configurar la Base de Datos

Ejecuta las migraciones de Prisma para crear las tablas:

\`\`\`bash
# Generar el cliente de Prisma
npm run prisma:generate

# Crear las tablas en la base de datos
npm run prisma:push

# O usar migraciones (recomendado para producción)
npm run prisma:migrate
\`\`\`

### 4. Verificar la Base de Datos

Abre Prisma Studio para ver tus datos:

\`\`\`bash
npm run prisma:studio
\`\`\`

## 🚀 Ejecutar el Proyecto

\`\`\`bash
npm run dev
\`\`\`

El servidor estará disponible en: `http://localhost:3000`

## 📡 GraphQL API

La API de GraphQL está disponible en: `http://localhost:3000/api/graphql`

### Queries Disponibles

\`\`\`graphql
# Obtener todos los usuarios
query {
  users {
    id
    email
    name
    phone
    creditRequests {
      id
      amount
      status
    }
  }
}

# Obtener un usuario específico
query {
  user(id: "user-id-here") {
    id
    email
    name
    creditRequests {
      id
      amount
      status
    }
  }
}

# Obtener todas las solicitudes de crédito
query {
  creditRequests {
    id
    amount
    interestRate
    termMonths
    status
    user {
      name
      email
    }
    paymentInstallments {
      installmentNumber
      amount
      status
    }
  }
}

# Obtener solicitudes de crédito de un usuario
query {
  userCreditRequests(userId: "user-id-here") {
    id
    amount
    status
    paymentInstallments {
      installmentNumber
      dueDate
      amount
    }
  }
}

# Obtener cuotas de pago de una solicitud
query {
  paymentInstallments(creditRequestId: "credit-request-id") {
    id
    installmentNumber
    dueDate
    amount
    principal
    interest
    status
  }
}
\`\`\`

### Mutations Disponibles

\`\`\`graphql
# Crear un nuevo usuario
mutation {
  createUser(input: {
    email: "usuario@ejemplo.com"
    name: "Juan Pérez"
    phone: "+1234567890"
  }) {
    id
    email
    name
  }
}

# Crear una solicitud de crédito
mutation {
  createCreditRequest(input: {
    userId: "user-id-here"
    amount: 10000.00
    interestRate: 12.5
    termMonths: 12
  }) {
    id
    amount
    status
    user {
      name
    }
  }
}

# Actualizar el estado de una solicitud
mutation {
  updateCreditRequestStatus(input: {
    id: "credit-request-id"
    status: "approved"
  }) {
    id
    status
    approvalDate
  }
}
```

## 🧪 Probar la API

### Página de Pruebas Integrada

El proyecto incluye una página de pruebas interactiva en: `http://localhost:3000/test-graphql`

Esta página te permite:
- Escribir y ejecutar queries y mutations
- Ver los resultados en tiempo real
- Cargar ejemplos predefinidos con un clic

### Herramientas Externas

También puedes usar herramientas como:
- [Apollo Studio](https://studio.apollographql.com/sandbox/explorer)
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)

Configura el endpoint: `http://localhost:3000/api/graphql`

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npm run prisma:generate` - Genera el cliente de Prisma
- `npm run prisma:migrate` - Crea y aplica migraciones
- `npm run prisma:studio` - Abre Prisma Studio
- `npm run prisma:push` - Sincroniza el schema con la base de datos (desarrollo)

## 🗂️ Estructura del Proyecto

\`\`\`
spyrra/
├── app/
│   ├── api/
│   │   └── graphql/
│   │       └── route.ts          # API Route de GraphQL
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── graphql/
│   │   ├── schema.ts              # Schema de GraphQL
│   │   └── resolvers.ts           # Resolvers de GraphQL
│   └── prisma.ts                  # Cliente de Prisma
├── prisma/
│   └── schema.prisma              # Schema de la base de datos
├── .env                           # Variables de entorno
└── package.json
\`\`\`

## 🔐 Variables de Entorno

Asegúrate de tener configurado el archivo `.env`:

\`\`\`env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"
\`\`\`

**⚠️ Importante**: Nunca subas el archivo `.env` a tu repositorio. Ya está incluido en `.gitignore`.

## 🚧 Próximos Pasos

1. Implementar autenticación de usuarios
2. Agregar validaciones de negocio
3. Crear lógica para generar cuotas automáticamente
4. Implementar sistema de notificaciones
5. Crear dashboard de administración
6. Agregar tests unitarios e integración

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server)
- [Supabase Documentation](https://supabase.com/docs)
- [GraphQL Documentation](https://graphql.org/learn)

## 📄 Licencia

Este proyecto es privado.
