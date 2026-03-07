# FemCoders Club — Backend API

API REST del backend de [FemCoders Club](https://www.femcodersclub.com), comunidad de mujeres en tecnología en España.

---

## Stack

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0902?style=flat&logo=typeorm&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=flat&logo=railway&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)

---

## Funcionalidades

- Autenticación y gestión de usuarias con JWT
- Gestión de eventos con integración Eventbrite (sincronización automática vía webhook)
- CRM interno: seguimiento de asistentes, historial de participación y exportación de datos
- Módulos de contenido: ofertas de trabajo, sponsors, FAQs, voluntariado, cuestionarios
- Envío de correos transaccionales con Nodemailer
- API documentada con Swagger

---

## Desarrollo local

```bash
pnpm install
pnpm run start:dev
```

La API queda disponible en `http://localhost:3000`.
Documentación interactiva en `http://localhost:3000/api`.

---

## Tests

```bash
pnpm run test
pnpm run test:e2e
```

---

[femcodersclub.com](https://www.femcodersclub.com)

---

Desarrollado por [Irina Ichim](https://github.com/Irina-Ichim)
