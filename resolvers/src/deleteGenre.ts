import { util, Context } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";
import { DeleteGenreMutationVariables } from "./models/API";

export function request(ctx: Context<DeleteGenreMutationVariables>) {
  const { genreId } = ctx.args;
  return ddb.remove({
    key: {
      PK: `GENRE#${genreId}`,
      SK: "METADATA#GENRE",
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
      message: "Genre not found",
    };
  }

  // Paso 2: Preparar los elementos para la eliminación por lotes
  return result;
}
