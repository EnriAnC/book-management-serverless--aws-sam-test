import { DynamoDBBatchDeleteItemRequest, util } from "@aws-appsync/utils";

export function request(ctx) {
  return batchDeleteItemsRequest(ctx.result);
}

export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  const { items } = ctx.result; // This is the list of PK that were deleted
  if (items.length === 0) {
    return {
      statusCode: 404,
      message: "Author not found",
    };
  }
  return {
    statusCode: 200,
    message:
      "Author and related items(" + items.length + ") successfully deleted",
  };
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
    tables: { BookManagementTable: deleteRequests },
  } as DynamoDBBatchDeleteItemRequest;
}
