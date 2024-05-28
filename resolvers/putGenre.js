import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
    operation: "PutItem",
    key: util.dynamodb.toMapValues({
      entityId: `GENRE#${ctx.args.genreId}`,
      entityType: `GENRE#${ctx.args.genreId}`,
    }),
    attributeValues: util.dynamodb.toMapValues({
      genreId: ctx.args.genreId,
      name: ctx.args.input.name,
    }),
  };
}

export function response(ctx) {
  return {
    statusCode: 200,
    message: "Successfully",
  };
}