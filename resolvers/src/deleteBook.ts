import { util, Context } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";
import { DeleteBookMutationVariables } from "./models/API";

export function request(ctx: Context<DeleteBookMutationVariables>) {
  const { bookId } = ctx.args;
  return ddb.remove({
    key: {
      PK: `BOOK#${bookId}`,
      SK: "METADATA#BOOK",
    },
  });
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    util.error(error.message, error.type);
  }

  if (!result) {
    return {
      statusCode: 404,
      message: "Book not found",
    };
  }

  // Paso 2: Preparar los elementos para la eliminación por lotes
  return result;
}
