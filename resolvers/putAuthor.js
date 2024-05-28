import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
    operation: "PutItem",
    key: util.dynamodb.toMapValues({
      entityId: `AUTHOR#${ctx.args.authorId}`,
      entityType: `AUTHOR#${ctx.args.authorId}`,
    }),
    attributeValues: util.dynamodb.toMapValues({
      authorId: ctx.args.authorId,
      firstName: ctx.args.input.firstName,
      lastName: ctx.args.input.lastName,
      dateOfBirth: ctx.args.input.dateOfBirth,
      rut: ctx.args.input.rut,
    }),
  };
}

export function response(ctx) {
  return {
    statusCode: 200,
    message: "Successfully",
  };
}