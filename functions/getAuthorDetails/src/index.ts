import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { AppSyncEvent } from "../../models";

const client = new DynamoDBClient(process.env.REGION);
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event: AppSyncEvent<{ authorId: string }>) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));

  try {
    // Consulta para obtener los libros
    const authorDetailsParams: GetCommandInput = {
      TableName: TABLE_NAME,
      Key: {
        PK: "AUTHOR#" + event.arguments.authorId,
        SK: "METADATA#AUTHOR",
      },
    };

    const commandAuthorDetails = new GetCommand(authorDetailsParams);
    console.log("commandAuthorDetails: ", commandAuthorDetails);
    const authorDetailsData = await docClient.send(commandAuthorDetails);
    console.log("authorDetailsData: ", authorDetailsData);
    const authorDetails = authorDetailsData.Item;
    console.log("authorDetails: ", authorDetails);

    return authorDetails;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw new Error("Could not load items");
  }
};
