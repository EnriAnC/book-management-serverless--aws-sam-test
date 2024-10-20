/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../models/API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const putAuthor = /* GraphQL */ `mutation PutAuthor($authorId: ID!, $input: AuthorInput!) {
  putAuthor(authorId: $authorId, input: $input) {
    authorId
    firstName
    lastName
    dateOfBirth
    rut
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PutAuthorMutationVariables,
  APITypes.PutAuthorMutation
>;
export const deleteAuthor = /* GraphQL */ `mutation DeleteAuthor($authorId: ID!) {
  deleteAuthor(authorId: $authorId) {
    statusCode
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAuthorMutationVariables,
  APITypes.DeleteAuthorMutation
>;
export const putBook = /* GraphQL */ `mutation PutBook($bookId: ID!, $input: BookInput!) {
  putBook(bookId: $bookId, input: $input) {
    bookId
    title
    publicationDate
    authorId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PutBookMutationVariables,
  APITypes.PutBookMutation
>;
export const deleteBook = /* GraphQL */ `mutation DeleteBook($bookId: ID!) {
  deleteBook(bookId: $bookId) {
    statusCode
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteBookMutationVariables,
  APITypes.DeleteBookMutation
>;
export const putGenre = /* GraphQL */ `mutation PutGenre($genreId: ID!, $input: GenreInput!) {
  putGenre(genreId: $genreId, input: $input) {
    genreId
    name
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PutGenreMutationVariables,
  APITypes.PutGenreMutation
>;
export const deleteGenre = /* GraphQL */ `mutation DeleteGenre($genreId: ID!) {
  deleteGenre(genreId: $genreId) {
    statusCode
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteGenreMutationVariables,
  APITypes.DeleteGenreMutation
>;
