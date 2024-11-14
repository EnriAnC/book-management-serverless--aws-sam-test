/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../models/API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getAuthor = /* GraphQL */ `query GetAuthor($authorId: ID!) {
  getAuthor(authorId: $authorId) {
    authorId
    firstName
    lastName
    dateOfBirth
    rut
    __typename
  }
}
` as GeneratedQuery<APITypes.GetAuthorQueryVariables, APITypes.GetAuthorQuery>;
export const getBook = /* GraphQL */ `query GetBook($bookId: ID!) {
  getBook(bookId: $bookId) {
    bookId
    title
    publicationDate
    authorId
    __typename
  }
}
` as GeneratedQuery<APITypes.GetBookQueryVariables, APITypes.GetBookQuery>;
export const getGenre = /* GraphQL */ `query GetGenre($genreId: ID!) {
  getGenre(genreId: $genreId) {
    genreId
    name
    __typename
  }
}
` as GeneratedQuery<APITypes.GetGenreQueryVariables, APITypes.GetGenreQuery>;
export const getAuthorAndBooks = /* GraphQL */ `query GetAuthorAndBooks($authorId: ID!) {
  getAuthorAndBooks(authorId: $authorId) {
    bookId
    title
    publicationDate
    authorId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAuthorAndBooksQueryVariables,
  APITypes.GetAuthorAndBooksQuery
>;
export const listAuthors = /* GraphQL */ `query ListAuthors {
  listAuthors {
    authorId
    firstName
    lastName
    dateOfBirth
    rut
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAuthorsQueryVariables,
  APITypes.ListAuthorsQuery
>;
export const listBooks = /* GraphQL */ `query ListBooks {
  listBooks {
    bookId
    title
    publicationDate
    authorId
    __typename
  }
}
` as GeneratedQuery<APITypes.ListBooksQueryVariables, APITypes.ListBooksQuery>;
export const listGenres = /* GraphQL */ `query ListGenres {
  listGenres {
    genreId
    name
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGenresQueryVariables,
  APITypes.ListGenresQuery
>;
export const listBooksSortByGenders = /* GraphQL */ `query ListBooksSortByGenders {
  listBooksSortByGenders {
    genreId
    name
    books {
      bookId
      title
      publicationDate
      authorId
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBooksSortByGendersQueryVariables,
  APITypes.ListBooksSortByGendersQuery
>;
