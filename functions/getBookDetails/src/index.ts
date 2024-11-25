import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { AppSyncEvent } from "../../../graphql/models";

const client = new DynamoDBClient(process.env.REGION!);
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event: AppSyncEvent<{ bookId: string }>) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));

  try {
    // Consulta para obtener los libros
    const book = await getBookDetails(event.arguments.bookId);
    return book;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw new Error("Could not load items");
  }
};

const getBookDetails = async (bookId: string) => {
  // Consulta para obtener los libros
  const booksParams: GetCommandInput = {
    TableName: TABLE_NAME,
    Key: {
      PK: "BOOK#" + bookId,
      SK: "METADATA#BOOK",
    },
  };

  const commandBooks = new GetCommand(booksParams);
  console.log("commandBooks: ", commandBooks);
  const booksData = await docClient.send(commandBooks);
  console.log("booksData: ", booksData);
  const books = booksData.Item;
  console.log("books: ", books);
  if (!books) throw Error("No existe el libro con el id indicado.");
  return books;
};
