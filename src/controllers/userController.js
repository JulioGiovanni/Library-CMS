const { PrismaClient } = require('@prisma/client');
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.users.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    await prisma.$disconnect();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.users.update({
      where: {
        id: Number(id),
      },
      data: {
        isActive: false,
      },
    });
    await prisma.$disconnect();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
};
