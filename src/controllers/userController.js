import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

//Get all active users
export const getUsers = async (req, res) => {
  const { page = 1, limit = 4 } = req.query;
  const offset = page * limit - limit;
  try {
    const total = await prisma.users.count({
      where: {
        isActive: true,
      },
    });

    const users = await prisma.user.findMany({
      skip: offset,
      take: limit,
      where: {
        isActive: true,
      },
    });
    await prisma.$disconnect();
    return res
      .status(200)
      .json({ data: users, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    res.status(500).json({ message: error });
  }
};

//Get User
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        name: true,
        email: true,
      },
    });
    await prisma.$disconnect();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    if (password) {
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
    }
    const user = await prisma.users.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        email,
      },
    });
    await prisma.$disconnect();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    res.status(500).json({ message: error });
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
    res.status(500).json({ message: error });
  }
};

export const enableUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.users.update({
      where: {
        id: Number(id),
      },
      data: {
        isActive: true,
      },
    });
    await prisma.$disconnect();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    res.status(500).json({ message: error });
  }
};
