import { Context, DynamoDBDeleteItemRequest, util } from "@aws-appsync/utils";
import { DeleteAuthorsMutationVariables } from "../../graphql/models/API";

export function request(ctx: Context<DeleteAuthorsMutationVariables>) {
  return batchDeleteItemsRequest(ctx.args.authorIds[0]);
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    util.error(error.message, error.type);
  }
  if (!result) {
    return {
      statusCode: 404,
      message: "Author not found",
    };
  }
  return {
    statusCode: 200,
    message: `Author deleted successfully`,
  };
}

function batchDeleteItemsRequest(authorId): DynamoDBDeleteItemRequest {
  return {
    operation: "DeleteItem",
    key: util.dynamodb.toMapValues({
      PK: `AUTHOR#${authorId}`,
      SK: "METADATA#AUTHOR",
    }),
  };
}
