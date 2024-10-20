import {
  Context,
  DynamoDBBatchDeleteItemRequest,
  util,
} from "@aws-appsync/utils";

export function request(ctx: Context) {
  return batchDeleteItemsRequest(ctx.result);
}

export function response(ctx: Context) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  const { items } = ctx.result;
  if (items.length === 0) {
    return {
      statusCode: 404,
      message: "Author not found",
    };
  }
  return items;
}

function batchDeleteItemsRequest(keys) {
  const deleteRequests = keys.map((item) =>
    util.dynamodb.toMapValues({
      PK: item.SK,
      SK: item.PK,
    })
  );
  return {
    operation: "BatchDeleteItem",
    tables: { BookManagentTable: deleteRequests },
  } as DynamoDBBatchDeleteItemRequest;
}
