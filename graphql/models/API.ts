/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type AuthorInput = {
  firstName?: string | null,
  lastName?: string | null,
  dateOfBirth?: string | null,
  rut?: string | null,
};

export type Author = {
  __typename: "Author",
  authorId?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  dateOfBirth?: string | null,
  rut?: string | null,
};

export type MutationResponse = {
  __typename: "MutationResponse",
  statusCode: number,
  message: string,
};

export type BookInput = {
  title?: string | null,
  publicationDate?: string | null,
  authorId?: string | null,
  genreIds?: Array< string | null > | null,
};

export type Book = {
  __typename: "Book",
  bookId?: string | null,
  title?: string | null,
  publicationDate?: string | null,
  authorId?: string | null,
};

export type GenreInput = {
  name?: string | null,
};

export type Genre = {
  __typename: "Genre",
  genreId?: string | null,
  name?: string | null,
};

export type BooksGender = {
  __typename: "BooksGender",
  genreId?: string | null,
  name?: string | null,
  books?:  Array<Book | null > | null,
};

export type PutAuthorMutationVariables = {
  authorId: string,
  input: AuthorInput,
};

export type PutAuthorMutation = {
  putAuthor?:  {
    __typename: "Author",
    authorId?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    dateOfBirth?: string | null,
    rut?: string | null,
  } | null,
};

export type DeleteAuthorsMutationVariables = {
  authorIds: Array< string | null >,
};

export type DeleteAuthorsMutation = {
  deleteAuthors?:  {
    __typename: "MutationResponse",
    statusCode: number,
    message: string,
  } | null,
};

export type PutBookMutationVariables = {
  bookId: string,
  input: BookInput,
};

export type PutBookMutation = {
  putBook?:  {
    __typename: "Book",
    bookId?: string | null,
    title?: string | null,
    publicationDate?: string | null,
    authorId?: string | null,
  } | null,
};

export type DeleteBooksMutationVariables = {
  bookIds: Array< string | null >,
};

export type DeleteBooksMutation = {
  deleteBooks?:  {
    __typename: "MutationResponse",
    statusCode: number,
    message: string,
  } | null,
};

export type PutGenreMutationVariables = {
  genreId: string,
  input: GenreInput,
};

export type PutGenreMutation = {
  putGenre?:  {
    __typename: "Genre",
    genreId?: string | null,
    name?: string | null,
  } | null,
};

export type DeleteGenresMutationVariables = {
  genreIds: Array< string | null >,
};

export type DeleteGenresMutation = {
  deleteGenres?:  {
    __typename: "MutationResponse",
    statusCode: number,
    message: string,
  } | null,
};

export type GetAuthorQueryVariables = {
  authorId: string,
};

export type GetAuthorQuery = {
  getAuthor?:  {
    __typename: "Author",
    authorId?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    dateOfBirth?: string | null,
    rut?: string | null,
  } | null,
};

export type GetBookQueryVariables = {
  bookId: string,
};

export type GetBookQuery = {
  getBook?:  {
    __typename: "Book",
    bookId?: string | null,
    title?: string | null,
    publicationDate?: string | null,
    authorId?: string | null,
  } | null,
};

export type GetGenreQueryVariables = {
  genreId: string,
};

export type GetGenreQuery = {
  getGenre?:  {
    __typename: "Genre",
    genreId?: string | null,
    name?: string | null,
  } | null,
};

export type GetAuthorAndBooksQueryVariables = {
  authorId: string,
};

export type GetAuthorAndBooksQuery = {
  getAuthorAndBooks?:  Array< {
    __typename: "Book",
    bookId?: string | null,
    title?: string | null,
    publicationDate?: string | null,
    authorId?: string | null,
  } | null > | null,
};

export type ListAuthorsQueryVariables = {
};

export type ListAuthorsQuery = {
  listAuthors?:  Array< {
    __typename: "Author",
    authorId?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    dateOfBirth?: string | null,
    rut?: string | null,
  } | null > | null,
};

export type ListBooksQueryVariables = {
};

export type ListBooksQuery = {
  listBooks?:  Array< {
    __typename: "Book",
    bookId?: string | null,
    title?: string | null,
    publicationDate?: string | null,
    authorId?: string | null,
  } | null > | null,
};

export type ListGenresQueryVariables = {
};

export type ListGenresQuery = {
  listGenres?:  Array< {
    __typename: "Genre",
    genreId?: string | null,
    name?: string | null,
  } | null > | null,
};

export type ListBooksSortByGendersQueryVariables = {
};

export type ListBooksSortByGendersQuery = {
  listBooksSortByGenders?:  Array< {
    __typename: "BooksGender",
    genreId?: string | null,
    name?: string | null,
    books?:  Array< {
      __typename: "Book",
      bookId?: string | null,
      title?: string | null,
      publicationDate?: string | null,
      authorId?: string | null,
    } | null > | null,
  } | null > | null,
};
