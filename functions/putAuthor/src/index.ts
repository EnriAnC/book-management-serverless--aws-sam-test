import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  BatchWriteCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { AppSyncEvent } from "../../../graphql/models/AppSyncEvent";
import { PutAuthorMutationVariables } from "../../../graphql/models/API";

const client = new DynamoDBClient(process.env.REGION);
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (
  event: AppSyncEvent<PutAuthorMutationVariables>
) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));
  const { authorId, input } = event.arguments;
  try {
    const putAuthorRequest: BatchWriteCommandInput["RequestItems"]["PutRequest"] =
      [
        {
          PutRequest: {
            Item: {
              PK: `AUTHOR#${authorId}`,
              SK: `METADATA#AUTHOR`,
              authorId: authorId,
              firstName: input.firstName,
              lastName: input.lastName,
              dateOfBirth: input.dateOfBirth,
              rut: input.rut,
            },
          },
        },
      ];
    const putAuthorParams: BatchWriteCommandInput = { RequestItems: {} };
    putAuthorParams.RequestItems[TABLE_NAME] = putAuthorRequest;

    const batchPutCommand = new BatchWriteCommand(putAuthorParams);
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
      message: "Author put successfully.",
    };
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw new Error(error?.message);
  }
};
