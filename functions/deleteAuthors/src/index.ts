import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  BatchWriteCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { AppSyncEvent } from "../../models";

const client = new DynamoDBClient(process.env.REGION);
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event: AppSyncEvent<{ authorIds: string[] }>) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));

  try {
    const deleteAuthorsRequest: BatchWriteCommandInput["RequestItems"]["DeleteRequest"] =
      event.arguments.authorIds.map((authorId) => ({
        DeleteRequest: {
          Key: {
            PK: `AUTHOR#${authorId}`,
            SK: "METADATA#AUTHOR",
          },
        },
      }));
    const deleteAuthorParams: BatchWriteCommandInput = { RequestItems: {} };
    deleteAuthorParams.RequestItems[TABLE_NAME] = deleteAuthorsRequest;

    const batchDeleteCommand = new BatchWriteCommand(deleteAuthorParams);
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
        deleteAuthorsRequest.length > 1
          ? `Authors deleted successfully`
          : `Author deleted successfully`,
    };
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw new Error("Could not load items");
  }
};
