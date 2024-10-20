import {
  Context,
  DynamoDBBatchGetItemRequest,
  DynamoDBGetItemRequest,
  util,
} from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx: Context<{ items: { PK: string; SK: string }[] }>) {
  return dynamoDBQueryRequest(ctx.prev.result);
}

export function response(ctx) {
  return ctx.result;
}

function dynamoDBQueryRequest(items) {
  const keys = items.map((item) => {
    return util.dynamodb.toMapValues({
      PK: item.PK,
      SK: "METADATA#BOOK",
    });
  });
  return {
    operation: "BatchGetItem",
    tables: { BookManagementTable: keys },
  } as DynamoDBBatchGetItemRequest;
}
