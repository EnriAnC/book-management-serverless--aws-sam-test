import { DynamoDBQueryRequest, util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  return dynamoDBQueryRequest({ authorId: ctx.args.authorId });
}

export function response(ctx) {
  return ctx.result.items;
}

/**
 * In this function, we use GSI InverseIndex to get all books by an author
 */
function dynamoDBQueryRequest(key) {
  return ddb.query({
    index: "InverseIndex",
    query: {
      SK: { eq: `AUTHOR#${key.authorId}` },
      PK: { beginsWith: "BOOK#" },
    },
    select: "ALL_ATTRIBUTES",
    projection: ["PK", "SK"],
  });
}
