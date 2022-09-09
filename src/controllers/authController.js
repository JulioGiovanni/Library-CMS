import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // const token = jwt.sign(
    //   { email: user.email, id: user.id },
    //   'test',
    //   {
    //     expiresIn: '1h',
    //   }
    // );
    await prisma.$disconnect();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    return res.status(500).json({ message: error });
  }
};

export const register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const emailFound = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (emailFound) {
      return res
        .status(400)
        .json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    await prisma.$disconnect();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    return res.status(500).json({ message: error });
  }
};

export const logout = (req, res) => {
  res.send('Logout');
};
