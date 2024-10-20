import { util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  return ddb.query({
    index: "InverseIndex",
    query: {
      SK: { eq: "METADATA#AUTHOR" },
      // PK: { beginsWith: "AUTHOR#" },
    },
  });
}

export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  const authors = ctx.result.items;
  return authors;
}
