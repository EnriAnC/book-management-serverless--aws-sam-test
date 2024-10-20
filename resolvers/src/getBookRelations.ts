import { util, Context } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx: Context) {
  const { bookId } = ctx.args;
  return ddb.query({
    query: {
      PK: { eq: `BOOK#${bookId}` },
    },
    select: "SPECIFIC_ATTRIBUTES",
    projection: ["PK", "SK"],
  });
}

export function response(ctx: Context) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  const items = ctx.result.items;

  if (items.length === 0) {
    return {
      statusCode: 404,
      message: "Book not found",
    };
  }

  // Paso 2: Preparar los elementos para la eliminación por lotes
  return items;
}
