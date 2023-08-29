import { PrismaClient } from '@/__generated__/client';

export * from '@/__generated__/client';

const db = new PrismaClient();
export default db;
