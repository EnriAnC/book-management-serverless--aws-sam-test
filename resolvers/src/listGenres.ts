import { Context, util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";
import { ListGenresQuery, ListGenresQueryVariables } from "./models/API";

export function request(ctx: Context<ListGenresQueryVariables>) {
  return ddb.query({
    index: "InverseIndex",
    query: {
      SK: { eq: "METADATA#GENRE" },
      // PK: { beginsWith: "GENRE#" },
    },
  });
}

export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  const genres = ctx.result.items;
  return genres;
}
