# ✅ Configuración Completada - Spyrra

## 🎉 ¡Todo está listo!

Se ha configurado exitosamente **Prisma** con **PostgreSQL (Supabase)** y un servidor **GraphQL** básico en tu proyecto Next.js.

## 📦 Lo que se ha instalado

### Dependencias Principales
- `@prisma/client` - Cliente de Prisma para interactuar con la base de datos
- `prisma` - CLI de Prisma
- `@apollo/server` - Servidor Apollo para GraphQL
- `@as-integrations/next` - Integración de Apollo Server con Next.js
- `graphql` - Librería core de GraphQL
- `graphql-tag` - Para definir schemas GraphQL
- `dotenv` - Para cargar variables de entorno

## 📁 Archivos Creados

### Configuración de Base de Datos
- ✅ `prisma/schema.prisma` - Schema de Prisma con 3 modelos:
  - **User** - Usuarios del sistema
  - **CreditRequest** - Solicitudes de crédito
  - **PaymentInstallment** - Cuotas de pago
- ✅ `prisma.config.ts` - Configuración de Prisma
- ✅ `lib/prisma.ts` - Cliente singleton de Prisma

### GraphQL
- ✅ `lib/graphql/schema.ts` - Schema de GraphQL (tipos, queries, mutations)
- ✅ `lib/graphql/resolvers.ts` - Resolvers de GraphQL
- ✅ `app/api/graphql/route.ts` - API Route de GraphQL

### Utilidades y Documentación
- ✅ `app/test-graphql/page.tsx` - Página interactiva para probar GraphQL
- ✅ `.env.example` - Plantilla de variables de entorno
- ✅ `SETUP.md` - Documentación completa del proyecto
- ✅ `QUICKSTART.md` - Guía rápida de inicio

### Configuración
- ✅ `package.json` - Scripts de Prisma agregados
- ✅ `.gitignore` - Actualizado para proteger .env

## 🚀 Próximos Pasos

### 1. Configurar Supabase (REQUERIDO)

Antes de poder usar la aplicación, necesitas configurar tu base de datos:

1. **Crear proyecto en Supabase**
   - Ve a https://supabase.com
   - Crea un nuevo proyecto
   - Espera a que se complete la configuración

2. **Obtener la Connection String**
   - En tu proyecto Supabase, ve a **Settings** → **Database**
   - Copia la **Connection string** (usa "Connection pooling" para mejor rendimiento)
   - Reemplaza `[YOUR-PASSWORD]` con tu contraseña de base de datos

3. **Actualizar .env**
   ```bash
   # Edita el archivo .env
   DATABASE_URL="postgresql://postgres:TU-PASSWORD@db.xxxxx.supabase.co:5432/postgres"
   ```

### 2. Crear las Tablas en la Base de Datos

```bash
# Sincronizar el schema con Supabase
npm run prisma:push
```

Este comando creará automáticamente las 3 tablas en tu base de datos Supabase.

### 3. Iniciar el Servidor

```bash
npm run dev
```

### 4. Probar la API

Abre tu navegador en:
- **Aplicación**: http://localhost:3000
- **Test GraphQL**: http://localhost:3000/test-graphql

## 📊 Modelos de Datos Configurados

### User (Usuario)
```prisma
- id: UUID
- email: String (único)
- name: String
- phone: String (opcional)
- creditRequests: Relación 1:N con CreditRequest
```

### CreditRequest (Solicitud de Crédito)
```prisma
- id: UUID
- userId: String (FK a User)
- amount: Decimal
- interestRate: Decimal
- termMonths: Int
- status: String (pending, approved, rejected, active, completed)
- requestDate: DateTime
- approvalDate: DateTime (opcional)
- paymentInstallments: Relación 1:N con PaymentInstallment
```

### PaymentInstallment (Cuota de Pago)
```prisma
- id: UUID
- creditRequestId: String (FK a CreditRequest)
- installmentNumber: Int
- dueDate: DateTime
- amount: Decimal
- principal: Decimal
- interest: Decimal
- status: String (pending, paid, overdue)
- paidDate: DateTime (opcional)
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev                  # Iniciar servidor de desarrollo
npm run prisma:studio        # Abrir Prisma Studio (GUI para la DB)

# Base de Datos
npm run prisma:generate      # Generar cliente Prisma
npm run prisma:push          # Sincronizar schema (desarrollo)
npm run prisma:migrate       # Crear migración (producción)

# Producción
npm run build                # Construir aplicación
npm run start                # Iniciar en producción
```

## 🎯 Endpoints Disponibles

### GraphQL API
**URL**: `http://localhost:3000/api/graphql`

**Queries**:
- `users` - Obtener todos los usuarios
- `user(id)` - Obtener un usuario específico
- `creditRequests` - Obtener todas las solicitudes
- `creditRequest(id)` - Obtener una solicitud específica
- `userCreditRequests(userId)` - Solicitudes de un usuario
- `paymentInstallments(creditRequestId)` - Cuotas de una solicitud

**Mutations**:
- `createUser(input)` - Crear nuevo usuario
- `createCreditRequest(input)` - Crear solicitud de crédito
- `updateCreditRequestStatus(input)` - Actualizar estado de solicitud

## 📝 Ejemplo de Uso Completo

### 1. Crear un usuario
```graphql
mutation {
  createUser(input: {
    email: "maria@ejemplo.com"
    name: "María García"
    phone: "+573001234567"
  }) {
    id
    email
    name
  }
}
```

### 2. Crear una solicitud de crédito
```graphql
mutation {
  createCreditRequest(input: {
    userId: "ID_DEL_USUARIO_ANTERIOR"
    amount: 10000000
    interestRate: 12.5
    termMonths: 12
  }) {
    id
    amount
    status
  }
}
```

### 3. Consultar solicitudes
```graphql
query {
  creditRequests {
    id
    amount
    status
    user {
      name
      email
    }
  }
}
```

## 🛠️ Herramientas Útiles

- **Prisma Studio**: `npm run prisma:studio` - GUI para ver y editar datos
- **Test GraphQL**: http://localhost:3000/test-graphql - Interfaz web para probar queries
- **Apollo Studio**: https://studio.apollographql.com/sandbox - Cliente GraphQL profesional

## ⚠️ Importante

1. **Nunca subas el archivo `.env`** a tu repositorio (ya está en .gitignore)
2. **Usa `.env.example`** como referencia para otros desarrolladores
3. **Ejecuta `npm run prisma:generate`** después de cambiar el schema
4. **Usa migraciones** (`npm run prisma:migrate`) en producción

## 📚 Documentación Adicional

- **SETUP.md** - Documentación completa con todos los detalles
- **QUICKSTART.md** - Guía rápida de referencia
- **README.md** - Información general del proyecto

## 🎓 Recursos de Aprendizaje

- [Prisma Docs](https://www.prisma.io/docs)
- [GraphQL Docs](https://graphql.org/learn)
- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

**¡Feliz desarrollo! 🚀**

Si tienes alguna pregunta, consulta la documentación en SETUP.md o los recursos mencionados arriba.
