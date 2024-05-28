import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
    operation: "DeleteItem",
    key: util.dynamodb.toMapValues({
      entityId: "AUTHOR",
      entityType: `AUTHOR#${ctx.args.authorId}`,
    })
  };
}

export function response(ctx) {
  return {
    statusCode: 200,
    message: "Successfully",
  };
}