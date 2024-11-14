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
export const deleteAuthors = /* GraphQL */ `mutation DeleteAuthors($authorIds: [ID]!) {
  deleteAuthors(authorIds: $authorIds) {
    statusCode
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAuthorsMutationVariables,
  APITypes.DeleteAuthorsMutation
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
export const deleteBooks = /* GraphQL */ `mutation DeleteBooks($bookIds: [ID]!) {
  deleteBooks(bookIds: $bookIds) {
    statusCode
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteBooksMutationVariables,
  APITypes.DeleteBooksMutation
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
export const deleteGenres = /* GraphQL */ `mutation DeleteGenres($genreIds: [ID]!) {
  deleteGenres(genreIds: $genreIds) {
    statusCode
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteGenresMutationVariables,
  APITypes.DeleteGenresMutation
>;
