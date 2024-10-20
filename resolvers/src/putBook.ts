import { Context, DynamoDBBatchPutItemRequest, util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";
import { PutBookMutation, PutBookMutationVariables } from "./models/API";

export function request(ctx: Context<PutBookMutationVariables>) {
  const bookId = ctx.args.bookId || util.autoId();
  const { input } = ctx.args;

  return {
    operation: "BatchPutItem",
    tables: {
      BookManagementTable: [
        util.dynamodb.toMapValues({
          PK: `BOOK#${bookId}`,
          SK: "METADATA#BOOK",
          bookId: bookId,
          title: input.title,
          publicationDate: input.publicationDate,
          authorId: input.authorId,
        }),
        util.dynamodb.toMapValues({
          PK: `BOOK#${bookId}`,
          SK: "AUTHOR#" + input.authorId,
          authorId: input.authorId,
        }),
      ],
    },
  } as DynamoDBBatchPutItemRequest;

  // return ddb.put({
  //   key: {
  //     PK: `BOOK#${bookId}`,
  //     SK: "METADATA",
  //   },
  //   item: {
  //     PK: `BOOK#${bookId}`,
  //     SK: "METADATA",
  //     title: input.title,
  //     publicationDate: input.publicationDate,
  //     authorId: input.authorId,
  //   },
  // });
}

export function response(ctx: Context<PutBookMutation>) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  return ctx.result;
}
