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

export const handler = async (event: AppSyncEvent<{ genreId: string }>) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));

  try {
    // Consulta para obtener los libros
    const genreDetailsParams: GetCommandInput = {
      TableName: TABLE_NAME,
      Key: {
        PK: "GENRE#" + event.arguments.genreId,
        SK: "METADATA#GENRE",
      },
    };

    const commandGenre = new GetCommand(genreDetailsParams);
    console.log("command: ", commandGenre);
    const genreData = await docClient.send(commandGenre);
    console.log("genreData: ", genreData);
    const genreDetails = genreData.Item;
    console.log("genreDetails: ", genreDetails);

    return genreDetails;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw new Error("Could not load items");
  }
};
