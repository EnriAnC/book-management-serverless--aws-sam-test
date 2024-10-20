import { Context, util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";
import { PutGenreMutationVariables } from "./models/API";

export function request(ctx: Context<PutGenreMutationVariables>) {
  const genreId = ctx.args.genreId || util.autoId();
  return ddb.put({
    key: {
      PK: `GENRE#${genreId}`,
      SK: `METADATA#GENRE`,
    },
    item: {
      PK: `GENRE#${genreId}`,
      SK: `METADATA#GENRE`,
      genreId: genreId,
      name: ctx.args.input.name,
    },
  });
}

export function response(ctx: Context) {
  return ctx.result;
}
