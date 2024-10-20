import { util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  return dynamoDBGetItemRequest({ bookId: ctx.args.bookId });
}

export function response(ctx) {
  return ctx.result;
}

/**
 * A helper function to get a DynamoDB item
 */
function dynamoDBGetItemRequest(key) {
  return ddb.get({
    key: {
      PK: "BOOK#" + key.bookId,
      SK: "METADATA#BOOK",
    },
  });
}
