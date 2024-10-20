import { util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  return dynamoDBGetItemRequest({ genreId: ctx.args.genreId });
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
      PK: "GENRE#" + key.genreId,
      SK: "METADATA#GENRE",
    },
  });
}
