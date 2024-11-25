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
  CreateGenreBookRelationsMutationVariables,
} from "../../../graphql/models";

const client = new DynamoDBClient(process.env.REGION);
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (
  event: AppSyncEvent<CreateGenreBookRelationsMutationVariables>
) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));

  try {
    const createGenreBookRelationsRequest: BatchWriteCommandInput["RequestItems"]["PutRequest"] =
      [];
    for (const { bookId, genreIds: newGenreIds } of event.arguments.input) {
      const book = await getBookDetails(bookId);
      if (!book) throw Error("No existe el libro con el id indicado.");
      console.log("book: ", book);
      const currentIds = new Set(book.genreIds);
      newGenreIds.forEach((genreId) => {
        if (currentIds.has(genreId)) return;
        createGenreBookRelationsRequest.push({
          PutRequest: {
            Item: {
              PK: `BOOK#${bookId}`,
              SK: `GENRE#${genreId}`,
              genreId: genreId,
            },
          },
        });
        currentIds.add(genreId);
      });
      const updatedIds = [...currentIds];
      createGenreBookRelationsRequest.push({
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

    const createGenreBookRelationsParams: BatchWriteCommandInput = {
      RequestItems: {},
    };
    createGenreBookRelationsParams.RequestItems[TABLE_NAME] =
      createGenreBookRelationsRequest;

    const batchPutCommand = new BatchWriteCommand(
      createGenreBookRelationsParams
    );
    console.log("command: ", batchPutCommand);
    const createData = await docClient.send(batchPutCommand);
    console.log("createData: ", createData);
    const unprocessedItems = createData.UnprocessedItems[TABLE_NAME];
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
        createGenreBookRelationsRequest.length > 1
          ? `Genre Book relations created successfully`
          : `Genre Book relation created successfully`,
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
