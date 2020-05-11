import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.users.findOne({
    where: {
      email: 'apple@123.com',
    },
    include: {
      Urls: true,
    },
  });
  console.log(users);
}

export default main;
