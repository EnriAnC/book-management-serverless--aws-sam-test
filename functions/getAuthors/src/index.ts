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
    const authorsParams: QueryCommandInput = {
      TableName: TABLE_NAME,
      IndexName: "InverseIndex",
      KeyConditionExpression: "#SK = :SK",
      ExpressionAttributeNames: {
        "#SK": "SK",
      },
      ExpressionAttributeValues: {
        ":SK": "METADATA#AUTHOR",
      },
    };

    const commandAuthors = new QueryCommand(authorsParams);
    console.log("commandAuthors: ", commandAuthors);
    const authorsData = await docClient.send(commandAuthors);
    console.log("authorsData: ", authorsData);
    const authors = authorsData.Items;
    console.log("authors: ", authors);

    return authors;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw new Error("Could not load items");
  }
};
