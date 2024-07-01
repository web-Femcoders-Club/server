/* eslint-disable prettier/prettier */
// src/decorators/cors.decorator.ts
// src/decorators/cors.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const CORS_ALLOWED_ORIGIN = 'cors_allowed_origin';

export const CrossOrigin = (origin: string) => SetMetadata(CORS_ALLOWED_ORIGIN, origin);
