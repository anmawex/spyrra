# Guía Rápida - Spyrra

## ⚡ Inicio Rápido

### 1. Configurar Base de Datos

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env y agrega tu URL de Supabase
# DATABASE_URL="postgresql://postgres:TU-PASSWORD@TU-PROJECT.supabase.co:5432/postgres"
```

### 2. Generar Cliente Prisma y Crear Tablas

```bash
npm run prisma:generate
npm run prisma:push
```

### 3. Iniciar Servidor

```bash
npm run dev
```

## 🎯 URLs Importantes

- **Aplicación**: http://localhost:3000
- **GraphQL API**: http://localhost:3000/api/graphql
- **Test GraphQL**: http://localhost:3000/test-graphql
- **Prisma Studio**: Ejecutar `npm run prisma:studio`

## 📋 Comandos Útiles

```bash
# Desarrollo
npm run dev                  # Iniciar servidor de desarrollo
npm run prisma:studio        # Abrir Prisma Studio

# Base de Datos
npm run prisma:generate      # Generar cliente Prisma
npm run prisma:push          # Sincronizar schema (desarrollo)
npm run prisma:migrate       # Crear migración (producción)

# Producción
npm run build                # Construir aplicación
npm run start                # Iniciar en producción
```

## 🔍 Ejemplo Rápido de Uso

### 1. Crear un Usuario

```graphql
mutation {
  createUser(input: {
    email: "juan@ejemplo.com"
    name: "Juan Pérez"
    phone: "+573001234567"
  }) {
    id
    email
    name
  }
}
```

### 2. Crear Solicitud de Crédito

```graphql
mutation {
  createCreditRequest(input: {
    userId: "ID_DEL_USUARIO"
    amount: 5000000
    interestRate: 15.5
    termMonths: 24
  }) {
    id
    amount
    status
    user {
      name
    }
  }
}
```

### 3. Consultar Solicitudes

```graphql
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
  }
}
```

## 🛠️ Solución de Problemas

### Error: "Cannot find module '@prisma/client'"
```bash
npm run prisma:generate
```

### Error de conexión a base de datos
1. Verifica que tu URL en `.env` sea correcta
2. Asegúrate de que tu proyecto Supabase esté activo
3. Verifica que la contraseña sea correcta

### Las tablas no existen
```bash
npm run prisma:push
```

## 📚 Más Información

Ver [SETUP.md](./SETUP.md) para documentación completa.
