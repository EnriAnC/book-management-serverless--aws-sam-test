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

export const handler = async (event: AppSyncEvent<{ bookIds: string[] }>) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));

  try {
    const deleteBooksRequest: BatchWriteCommandInput["RequestItems"]["DeleteRequest"] =
      event.arguments.bookIds.map((bookId) => ({
        DeleteRequest: {
          Key: {
            PK: `BOOK#${bookId}`,
            SK: "METADATA#BOOK",
          },
        },
      }));
    const deleteBooksParams: BatchWriteCommandInput = { RequestItems: {} };
    deleteBooksParams.RequestItems[TABLE_NAME] = deleteBooksRequest;

    const batchDeleteCommand = new BatchWriteCommand(deleteBooksParams);
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
        deleteBooksRequest.length > 1
          ? `Books deleted successfully`
          : `Book deleted successfully`,
    };
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw new Error("Could not load items");
  }
};
