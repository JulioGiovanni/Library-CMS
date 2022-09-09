import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//Get all categories
export const getCategories = async (req, res) => {
  const { page = 1, limit = 4 } = req.query;
  const offset = page * limit - limit;
  try {
    const total = await prisma.category.count({
      where: {
        isActive: true,
      },
    });
    const categories = await prisma.category.findMany({
      skip: offset,
      take: limit,
      where: {
        isActive: true,
      },
    });
    await prisma.$disconnect();
    return res
      .status(200)
      .json({ data: categories, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    res.status(500).json({ message: error });
  }
};

//Disable category
export const disableCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        isActive: false,
      },
    });
    await prisma.$disconnect();
    return res.status(200).json(category);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    res.status(500).json({ message: error });
  }
};

//Enable category
export const enableCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        isActive: true,
      },
    });
    await prisma.$disconnect();
    return res.status(200).json(category);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    res.status(500).json({ message: error });
  }
};

//Update category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
      },
    });
    await prisma.$disconnect();
    return res.status(200).json(category);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    res.status(500).json({ message: error });
  }
};

//Count categories
export const countCategories = async (req, res) => {
  try {
    const categories = await prisma.category.count({});
    await prisma.$disconnect();
    return res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    res.status(500).json({ message: error });
  }
};
