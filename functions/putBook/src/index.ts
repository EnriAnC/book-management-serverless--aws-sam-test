import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  BatchWriteCommandInput,
} from "@aws-sdk/lib-dynamodb";
import {
  AppSyncEvent,
  PutBookMutationVariables,
} from "../../../graphql/models";

const client = new DynamoDBClient(process.env.REGION);
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (
  event: AppSyncEvent<PutBookMutationVariables>
) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));
  const { bookId, input } = event.arguments;
  try {
    const putBookRequest: BatchWriteCommandInput["RequestItems"]["PutRequest"] =
      [
        {
          PutRequest: {
            Item: {
              PK: `BOOK#${bookId}`,
              SK: "METADATA#BOOK",
              bookId: bookId,
              title: input.title,
              publicationDate: input.publicationDate,
              authorId: input.authorId,
              genreIds: input.genreIds,
            },
          },
        },
        {
          PutRequest: {
            Item: {
              PK: `BOOK#${bookId}`,
              SK: "AUTHOR#" + input.authorId,
              authorId: input.authorId,
            },
          },
        },
      ];
    const putGenresRelationRequest: BatchWriteCommandInput["RequestItems"]["PutRequest"] =
      input.genreIds.map((genreId: string) => ({
        PutRequest: {
          Item: {
            PK: `BOOK#${bookId}`,
            SK: "GENRE#" + genreId,
            genreId: genreId,
          },
        },
      }));
    const putBookParams: BatchWriteCommandInput = { RequestItems: {} };
    putBookParams.RequestItems[TABLE_NAME] = putBookRequest.concat(
      putGenresRelationRequest
    );

    const batchPutCommand = new BatchWriteCommand(putBookParams);
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
      message: `Book put successfully`,
    };
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw new Error(error?.message);
  }
};
