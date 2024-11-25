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
  DeleteGenreBookRelationsMutationVariables,
} from "../../../graphql/models";

const client = new DynamoDBClient(process.env.REGION);
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (
  event: AppSyncEvent<DeleteGenreBookRelationsMutationVariables>
) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));

  try {
    const deleteGenreBookRelationsRequest: BatchWriteCommandInput["RequestItems"]["DeleteRequest"] =
      [];

    for (const { bookId, genreIds: idsToDelete } of event.arguments.input) {
      const book = await getBookDetails(bookId);
      if (!book) throw Error("No existe el libro con el id indicado.");
      const currentIds = new Set(book.genreIds);
      idsToDelete.forEach((idToDelete) => {
        if (!currentIds.has(idToDelete)) return;
        deleteGenreBookRelationsRequest.push({
          DeleteRequest: {
            Key: {
              PK: `BOOK#${bookId}`,
              SK: `GENRE#${idToDelete}`,
            },
          },
        });
        currentIds.delete(idToDelete);
      });
      const updatedIds = [...currentIds];
      deleteGenreBookRelationsRequest.push({
        PutRequest: {
          Item: {
            PK: `BOOK#${bookId}`,
            SK: `METADATA#BOOK`,
            bookId: bookId,
            authorId: book.authorId,
            title: book.title,
            publicationDate: book.publicationDate,
            genreIds: updatedIds,
          } as Partial<Book>,
        },
      });
    }

    const deleteGenreBookRelationsParams: BatchWriteCommandInput = {
      RequestItems: {},
    };
    deleteGenreBookRelationsParams.RequestItems[TABLE_NAME] =
      deleteGenreBookRelationsRequest;

    const batchDeleteCommand = new BatchWriteCommand(
      deleteGenreBookRelationsParams
    );
    console.log("command: ", batchDeleteCommand);
    const deleteData = await docClient.send(batchDeleteCommand);
    console.log("deleteData: ", deleteData);
    const unprocessedItems = deleteData.UnprocessedItems[TABLE_NAME];
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
        deleteGenreBookRelationsRequest.length > 1
          ? `Genre Book relations deleted successfully`
          : `Genre Book relation deleted successfully`,
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
  const bookData = await docClient.send(commandBook);
  const book = bookData.Item;
  console.log("book: ", book);
  if (!book) throw Error("No existe el libro con el id indicado.");
  return book as Book;
};
