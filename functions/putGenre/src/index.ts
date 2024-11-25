import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  BatchWriteCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { AppSyncEvent } from "../../../graphql/models/AppSyncEvent";
import { PutGenreMutationVariables } from "../../../graphql/models/API";

const client = new DynamoDBClient(process.env.REGION);
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (
  event: AppSyncEvent<PutGenreMutationVariables>
) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));
  const { genreId, input } = event.arguments;
  try {
    const putGenreRequest: BatchWriteCommandInput["RequestItems"]["PutRequest"] =
      [
        {
          PutRequest: {
            Item: {
              PK: `GENRE#${genreId}`,
              SK: `METADATA#GENRE`,
              genreId: genreId,
              name: input.name,
            },
          },
        },
      ];
    const putGenreParams: BatchWriteCommandInput = { RequestItems: {} };
    putGenreParams.RequestItems[TABLE_NAME] = putGenreRequest;

    const batchPutCommand = new BatchWriteCommand(putGenreParams);
    console.log("command: ", batchPutCommand);
    const putData = await docClient.send(batchPutCommand);
    console.log("putData: ", putData);
    const unprocessedItems = putData.UnprocessedItems[TABLE_NAME];
    console.log("unprocessedItems: ", unprocessedItems);

    if (unprocessedItems && unprocessedItems.length > 0) {
      return {
        statusCode: 400,
        message: `Unprocessed items: ${JSON.stringify(unprocessedItems)}`,
      };
    }
    return {
      statusCode: 200,
      message: "Genre put successfully.",
    };
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw new Error(error?.message);
  }
};
