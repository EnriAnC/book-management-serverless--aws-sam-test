import { Context, util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";
import { PutAuthorMutationVariables } from "./models/API";

export function request(ctx: Context<PutAuthorMutationVariables>) {
  const authorId = ctx.args.authorId || util.autoId();
  return ddb.put({
    key: {
      PK: `AUTHOR#${authorId}`,
      SK: `METADATA#AUTHOR`,
    },
    item: {
      PK: `AUTHOR#${authorId}`,
      SK: `METADATA#AUTHOR`,
      authorId: authorId,
      firstName: ctx.args.input.firstName,
      lastName: ctx.args.input.lastName,
      dateOfBirth: ctx.args.input.dateOfBirth,
      rut: ctx.args.input.rut,
    },
  });
}

export function response(ctx: Context) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  return ctx.result;
}
