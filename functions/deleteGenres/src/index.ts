import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  BatchWriteCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { AppSyncEvent } from "../../../graphql/models";

const client = new DynamoDBClient(process.env.REGION);
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event: AppSyncEvent<{ genreIds: string[] }>) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));

  try {
    const deleteGenresRequest: BatchWriteCommandInput["RequestItems"]["DeleteRequest"] =
      event.arguments.genreIds.map((genreId) => ({
        DeleteRequest: {
          Key: {
            PK: `GENRE#${genreId}`,
            SK: "METADATA#GENRE",
          },
        },
      }));
    const deleteGenresParams: BatchWriteCommandInput = { RequestItems: {} };
    deleteGenresParams.RequestItems[TABLE_NAME] = deleteGenresRequest;

    const batchDeleteCommand = new BatchWriteCommand(deleteGenresParams);
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
        deleteGenresRequest.length > 1
          ? `Genres deleted successfully`
          : `Genre deleted successfully`,
    };
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw new Error(error?.message);
  }
};
