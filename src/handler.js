import { nanoid } from 'nanoid';
import books from './books.js';

const addBookHandler = (request, res) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        return res.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return res.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt,
    };

    books.push(newBook);

    return res.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
    }).code(201);
};

const getAllBooksHandler = (request) => {
    const { name, reading, finished } = request.query;
    let filteredBooks = books;

    if (name) {
        filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (reading !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading));
    }
    if (finished !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished));
    }

    return {
        status: 'success',
        data: {
            books: filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher })),
        },
    };
};

const getBookByIdHandler = (request, res) => {
    const { bookId } = request.params;
    const book = books.find((book) => book.id === bookId);

    if (!book) {
        return res.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }).code(404);
    }

    return res.response({
        status: 'success',
        data: {
            book,
        },
    }).code(200);
};

const updateBookByIdHandler = (request, res) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        return res.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return res.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    const index = books.findIndex((book) => book.id === bookId);

    if (index === -1) {
        return res.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
    }

    const updatedAt = new Date().toISOString();
    books[index] = {
        ...books[index],
        name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
    };

    return res.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    }).code(200);
};

const deleteBookByIdHandler = (request, res) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if (index === -1) {
        return res.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
    }

    books.splice(index, 1);
 6
    return res.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    }).code(200);
};

export {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBookByIdHandler,
    deleteBookByIdHandler,
};
