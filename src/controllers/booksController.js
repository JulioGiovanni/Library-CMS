import { PrismaClient } from '@prisma/client';
import path from 'path'; //Para usar las rutas de archivos
const prisma = new PrismaClient();

//Search books by title
export const searchBooks = async (req, res) => {
  const { title } = req.query;
  const { page = 1, limit = 4 } = req.query;
  const offset = page * limit - limit;
  try {
    const total = await prisma.books.count({
      where: {
        title: {
          contains: title,
        },
      },
    });
    const books = await prisma.book.findMany({
      skip: offset,
      take: limit,
      where: {
        title: {
          contains: title,
        },
      },
    });
    await prisma.$disconnect();
    res.json({ data: books, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
};

//Create a new book
export const createBook = async (req, res) => {
  const { title, author, year, category } = req.body;
  try {
    const name = req.file.originalname.split('.');
    const book = await prisma.books.create({
      data: {
        title,
        author,
        year_of_publication: Number(year),
        categoryId: Number(category),
        cover_image:
          'src/public/uploads/' +
          name[0] +
          '-' +
          path.extname(req.file.originalname),
        isActive: true,
        isAvailable: true,
        createdAt: new Date(),
      },
    });

    await prisma.$disconnect();
    return res.status(201).json(book);
  } catch (error) {
    await prisma.$disconnect();
    console.log(error);
    res.status(500).json({ message: error });
  }
};

//Get all books that are active
export const getBooks = async (req, res) => {
  const { page = 1, limit = 4 } = req.query;
  const offset = page * limit - limit;

  try {
    const total = await prisma.books.count({
      where: {
        isActive: true,
      },
    });

    const books = await prisma.books.findMany({
      skip: offset,
      take: limit,
      where: {
        isActive: true,
      },
    });
    await prisma.$disconnect();
    return res
      .status(200)
      .json({ data: books, pages: Math.ceil(total / limit) });
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

//Enable a book
export const enableBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await prisma.books.update({
      where: {
        id: Number(id),
      },
      data: {
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

//Get the requested books
export const getRequestedBooks = async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 4 } = req.query;
  const offset = page * limit - limit;
  try {
    const requestedBooks = await prisma.requested_books.findMany({
      skip: offset,
      take: limit,
      orderBy: { requestDate: 'desc' },
      select: {
        book: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    await prisma.$disconnect();
    return res.status(200).json({
      data: requestedBooks,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
};

//Get borrowed books
export const getBorrowedBooks = async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 4 } = req.query;
  const offset = page * limit - limit;
  try {
    const borrowedBooks = await prisma.borrowed_books.findMany({
      skip: offset,
      take: limit,
      orderBy: { requestDate: 'desc' },
      select: {
        book: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    await prisma.$disconnect();
    return res.status(200).json({
      data: borrowedBooks,
      pages: Math.ceil(total / limit),
    });
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

//Count books
export const countBooks = async (req, res) => {
  try {
    const books = await prisma.books.count();
    await prisma.$disconnect();
    return res.status(200).json(books);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
};

//Count available books
export const countAvailableBooks = async (req, res) => {
  try {
    const books = await prisma.books.count({
      where: {
        isAvailable: true,
      },
    });
    await prisma.$disconnect();
    return res.status(200).json(books);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
};

//Count borrowed books by a user
export const countBorrowedBooks = async (req, res) => {
  const { id } = req.params;
  try {
    const books = await prisma.borrowed_books.count({
      where: {
        userId: Number(id),
      },
    });
    await prisma.$disconnect();
    return res.status(200).json(books);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
};

//Get books borrowed by a user
export const getBorrowedBooksByUser = async (req, res) => {
  const { page = 1, limit = 4 } = req.query;
  const offset = page * limit - limit;
  const { id } = req.params;
  try {
    const total = await prisma.borrowed_books.count({
      where: {
        userId: Number(id),
      },
    });

    const borrowedBooks = await prisma.borrowed_books.findMany({
      skip: offset,
      take: limit,
      where: {
        userId: Number(id),
      },
      include: {
        books: true,
      },
    });
    await prisma.$disconnect();
    return res
      .status(200)
      .json({ data: borrowedBooks, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
};
