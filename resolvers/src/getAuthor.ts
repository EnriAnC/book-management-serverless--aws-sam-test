import { DynamoDBGetItemRequest, util } from "@aws-appsync/utils";

export function request(ctx) {
  return dynamoDBGetItemRequest({ authorId: ctx.args.authorId });
}

export function response(ctx) {
  return ctx.result;
}

/**
 * A helper function to get a DynamoDB item
 */
function dynamoDBGetItemRequest({ authorId }: { authorId: string }) {
  return {
    operation: "GetItem",
    key: util.dynamodb.toMapValues({
      PK: "AUTHOR#" + authorId,
      SK: "METADATA#AUTHOR",
    }),
  } as DynamoDBGetItemRequest;
}
