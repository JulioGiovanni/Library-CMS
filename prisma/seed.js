import { PrismaClient } from '@prisma/client';
import { books } from './books.js';

const prisma = new PrismaClient();

async function main() {
  await prisma.books.createMany({
    data: books,
  });
}

main();
