import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  BatchWriteCommandInput,
  GetCommandInput,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  AppSyncEvent,
  Book,
  RewriteGenreBookRelationsMutationVariables,
} from "../../../graphql/models";

const client = new DynamoDBClient(process.env.REGION);
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (
  event: AppSyncEvent<RewriteGenreBookRelationsMutationVariables>
) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));

  try {
    const updateGenreBookRelationsRequest: BatchWriteCommandInput["RequestItems"]["PutRequest"] =
      [];

    for (const { bookId, genreIds: newGenreIds } of event.arguments.input) {
      const book = await getBookDetails(bookId);
      if (!book) throw Error("No existe el libro con el id indicado.");

      const oldGenreIdsMap = new Set(book.genreIds);
      const newGenreIdsMap = new Set(newGenreIds);

      // Identificar géneros a añadir/eliminar
      const genresToAdd = newGenreIds.filter(
        (newId) => !oldGenreIdsMap.has(newId)
      );
      const genresToRemove = book.genreIds.filter(
        (newId) => !newGenreIdsMap.has(newId)
      );

      genresToAdd.forEach((genreId) => {
        updateGenreBookRelationsRequest.push({
          PutRequest: {
            Item: {
              PK: `BOOK#${bookId}`,
              SK: `GENRE#${genreId}`,
              genreId: genreId,
            },
          },
        });
      });

      genresToRemove.forEach((genreId) => {
        updateGenreBookRelationsRequest.push({
          DeleteRequest: {
            Key: {
              PK: `BOOK#${bookId}`,
              SK: `GENRE#${genreId}`,
            },
          },
        });
      });

      updateGenreBookRelationsRequest.push({
        PutRequest: {
          Item: {
            PK: `BOOK#${bookId}`,
            SK: `METADATA#BOOK`,
            bookId: bookId,
            authorId: book.authorId,
            title: book.title,
            publicationDate: book.publicationDate,
            genreIds: newGenreIds,
          } as Partial<Book>,
        },
      });
    }

    const updateGenreBookRelationsParams: BatchWriteCommandInput = {
      RequestItems: {},
    };
    updateGenreBookRelationsParams.RequestItems[TABLE_NAME] =
      updateGenreBookRelationsRequest;
    const batchPutCommand = new BatchWriteCommand(
      updateGenreBookRelationsParams
    );
    console.log("command: ", batchPutCommand);
    const updateData = await docClient.send(batchPutCommand);
    console.log("updateData: ", updateData);
    const unprocessedItems = updateData.UnprocessedItems[TABLE_NAME];
    console.log("unprocessedItems: ", unprocessedItems);

    if (unprocessedItems && unprocessedItems.length > 0) {
      return {
        statusCode: 400,
        message: `Unprocessed items: ${JSON.stringify(unprocessedItems)}`,
      };
    }
    return {
      statusCode: 200,
      message:
        updateGenreBookRelationsRequest.length > 1
          ? `Genre Book relations updated successfully`
          : `Genre Book relation updated successfully`,
    };
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw new Error("Could not load items");
  }
};

const getBookDetails = async (bookId: string) => {
  // Consulta para obtener los libros
  const bookParams: GetCommandInput = {
    TableName: TABLE_NAME,
    Key: {
      PK: "BOOK#" + bookId,
      SK: "METADATA#BOOK",
    },
  };

  const commandBook = new GetCommand(bookParams);
  console.log("commandBook: ", commandBook);
  const bookData = await docClient.send(commandBook);
  console.log("bookData: ", bookData);
  const book = bookData.Item;
  console.log("book: ", book);
  if (!book) throw Error("No existe el libro con el id indicado.");
  return book as Book;
};
