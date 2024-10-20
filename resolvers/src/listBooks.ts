import { util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  return ddb.query({
    index: "InverseIndex",
    query: {
      SK: { eq: "METADATA#BOOK" },
      // PK: { beginsWith: "BOOK#" },
    },
  });
}

export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  const books = ctx.result.items;
  return books;
}
