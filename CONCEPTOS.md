# Conceptos Clave: Prisma y GraphQL

Este documento explica los conceptos fundamentales para desarrolladores que vienen de un background REST + SQL tradicional.

## 💎 ¿Qué es Prisma?

Prisma es un **ORM (Object-Relational Mapper)** de nueva generación.

### Analogía
Imagina que tu base de datos es una biblioteca gigante organizada de forma muy compleja (SQL).
- **Sin Prisma:** Tienes que buscar los libros manualmente sabiendo exactamente dónde están (`SELECT * FROM users...`).
- **Con Prisma:** Tienes un bibliotecario inteligente. Le dices "Traeme el usuario Juan" (`prisma.user.findFirst(...)`) y él se encarga de todo el trabajo sucio.

### ¿Por qué lo usamos?
1. **Type-Safety:** Si tu base de datos dice que el `email` es obligatorio, Prisma no te dejará compilar el código si intentas guardar un usuario sin email.
2. **Autocompletado:** Tu editor de código sabrá exactamente qué campos existen en tu base de datos.

---

## ⚡ GraphQL vs REST

### REST (Lo tradicional)
Estilo "Menú de Restaurante".
- Tienes múltiples URLs (`/api/users`, `/api/posts`, `/api/comments`).
- Cada URL devuelve una estructura de datos fija.
- **Problema:** A menudo recibes más datos de los que necesitas (sobrecarga) o menos (tienes que hacer varias peticiones).

### GraphQL (Lo moderno)
Estilo "Buffet Libre" o "Query Language".
- Tienes **UN SOLO** endpoint (`/api/graphql`).
- Envías una "query" describiendo exactamente qué quieres.
- **Ventaja:** El frontend tiene el control total. Pide solo lo que necesita.

**Ejemplo Práctico:**
Quiero el nombre de un usuario y el monto de sus solicitudes de crédito.

**En REST:**
1. `GET /api/users/1` -> Devuelve nombre, email, password, fecha, dirección... (Desperdicio de datos)
2. `GET /api/credit-requests?userId=1` -> Devuelve todas las solicitudes completas...

**En GraphQL:**
Envías esto:
```graphql
query {
  user(id: "1") {
    name
    creditRequests {
      amount
    }
  }
}
```
Y recibes EXACTAMENTE eso. Nada más, nada menos.

---

## 🛠️ Guía de Scripts de Prisma

### 1. `npm run prisma:studio` (El Visor)
Abre una interfaz gráfica en tu navegador (`http://localhost:5555`).
- Es como un Excel para tu base de datos.
- Puedes ver filas, editar celdas, filtrar y buscar datos visualmente.
- Ideal para verificar que tus datos se guardaron correctamente.

### 2. `npm run prisma:generate` (El Traductor)
Actualiza el "Cliente Prisma" (el código que usas en tu app).
- **¿Cuándo ejecutarlo?** Siempre que modifiques el archivo `schema.prisma`.
- Si agregas un campo nuevo en el schema pero no ejecutas esto, tu código TypeScript no sabrá que ese campo existe.

### 3. `npm run prisma:push` (Prototipado Rápido)
Sincroniza tu esquema con la base de datos *a la fuerza*.
- **Uso:** Desarrollo y Prototipado.
- **Riesgo:** Puede borrar datos si cambiaste nombres de columnas.
- **Ventaja:** Es muy rápido para iterar diseños.

### 4. `npm run prisma:migrate` (Control de Cambios)
Crea archivos de migración SQL para llevar un historial.
- **Uso:** Producción y trabajo en equipo.
- Crea una carpeta `migrations/` con archivos SQL (`CREATE TABLE...`).
- Permite "viajar en el tiempo" o replicar la base de datos en otro servidor exactamente igual.

---

## 🔄 Flujo de Trabajo Típico

1. **Modificas** tu modelo en `prisma/schema.prisma`.
2. **Ejecutas** `npm run prisma:push` para actualizar tu base de datos local de desarrollo.
3. **Ejecutas** `npm run prisma:generate` para que TypeScript reconozca los cambios.
4. **Codificas** tu nueva funcionalidad.
5. **Verificas** los datos con `npm run prisma:studio`.
