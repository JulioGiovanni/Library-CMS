const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

//Create a new book
export const createBook = async (req, res) => {
  const { title, author, year, category } = req.body;
  try {
    const book = await prisma.books.create({
      title,
      author,
      year_of_publication: year,
      categoryId: category,
      cover_image: req.file.path,
    });

    await prisma.$disconnect();
    return res.status(201).json(book);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
};

//Get all books that are active
export const getBooks = async (req, res) => {
  try {
    const books = await prisma.books.findMany({
      where: {
        isActive: true,
      },
    });
    await prisma.$disconnect();
    return res.status(200).json(books);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
};

//Get a single book to display
export const getBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await prisma.books.findUnique({
      where: {
        id: Number(id),
        isActive: true,
      },
    });
    await prisma.$disconnect();
    return res.status(200).json(book);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
};

//Update a book
export const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, year, category } = req.body;
  try {
    const book = await prisma.books.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        author,
        year_of_publication: year,
        categoryId: category,
        cover_image: req.file.path,
      },
    });
    await prisma.$disconnect();
    return res.status(200).json(book);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
};

//Disable a book
export const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await prisma.books.update({
      where: {
        id: Number(id),
      },
      data: {
        isActive: false,
      },
    });
    await prisma.$disconnect();
    return res.status(200).json(book);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
};

//Borrow a book. Only an admin can borrow a book
export const borrowBook = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const AvailableBook = await prisma.books.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!AvailableBook.isAvailable) {
      return res
        .status(400)
        .json({ message: 'Book is not available' });
    }
    const book = await prisma.books.update({
      where: {
        id: Number(id),
      },
      data: {
        isAvailable: false,
      },
    });
    const borrow = await prisma.borrowed_books.create({
      data: {
        userId: userId,
        bookId: id,
        date_borrowed: new Date(),
      },
    });
    await prisma.$disconnect();
    return res.status(200).json({ book, borrow });
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
};

//Request a book, all users can request a book
export const requestBook = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const AvailableBook = await prisma.books.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!AvailableBook.isAvailable) {
      return res
        .status(400)
        .json({ message: 'Book is not Avalaible' });
    }

    const request = await prisma.requested_books.create({
      data: {
        userId: userId,
        bookId: id,
        date_requested: new Date(),
      },
    });
    await prisma.$disconnect();
    return res.status(200).json(request);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
};

//Return a book, only an admin can return a book
export const returnBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await prisma.books.update({
      where: {
        id: Number(id),
      },
      data: {
        isAvailable: true,
      },
    });
    const borrow = await prisma.borrowed_books.update({
      where: {
        bookId: Number(id),
      },
      data: {
        returnedDate: new Date(),
      },
    });
    await prisma.$disconnect();
    return res.status(200).json({ book, borrow });
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
};
