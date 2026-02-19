import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.string().transform((val) => {
    const num = Number(val);
    if (isNaN(num)) {
      throw new Error('REDIS_PORT must be a number');
    }
    return num;
  }),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_HOST: z.string().min(1),
  DB_PORT: z.string().transform((val) => {
    const num = Number(val);
    if (isNaN(num)) {
      throw new Error('DB_PORT must be a number');
    }
    return num;
  }),
});
