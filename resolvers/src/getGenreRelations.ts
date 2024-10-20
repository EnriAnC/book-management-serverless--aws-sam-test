import { util, Context } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";
import { GetGenreQueryVariables } from "./models/API";

export function request(ctx: Context<GetGenreQueryVariables>) {
  const { genreId } = ctx.args;
  return ddb.query({
    index: "InverseIndex",
    query: {
      PK: { eq: `GENRE#${genreId}` },
    },
    select: "SPECIFIC_ATTRIBUTES",
    projection: ["PK", "SK"],
  });
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    if (!ctx.stash.errors) ctx.stash.errors = [];
    ctx.stash.errors.push(ctx.error);
    return util.appendError(error.message, error.type, result);
  }

  const items = result.items as { PK: string; SK: string }[];

  if (items.length === 0) {
    return {
      statusCode: 404,
      message: "Genre not found",
    };
  }

  // Paso 2: Preparar los elementos para la eliminación por lotes
  return items;
}
