import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient(process.env.REGION);
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));

  try {
    // Consulta para obtener los libros
    const booksParams: QueryCommandInput = {
      TableName: TABLE_NAME,
      IndexName: "InverseIndex",
      KeyConditionExpression: "#PK = :PK AND begins_with(#SK, :SK)",
      ExpressionAttributeNames: {
        "#PK": "PK",
        "#SK": "SK",
      },
      ExpressionAttributeValues: {
        ":PK": "GENRE#" + event.genreId,
        ":SK": "METADATA#BOOK",
      },
    };

    const commandBooks = new QueryCommand(booksParams);
    console.log("commandBooks: ", commandBooks);
    const booksData = await docClient.send(commandBooks);
    console.log("booksData: ", booksData);
    const books = booksData.Items;
    console.log("books: ", books);

    return books;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw new Error("Could not load items");
  }
};
