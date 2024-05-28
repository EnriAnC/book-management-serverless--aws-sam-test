import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
    operation: "PutItem",
    key: util.dynamodb.toMapValues({
      entityId: `BOOK#${ctx.args.bookId}`,
      entityType: `BOOK#${ctx.args.bookId}`,
    }),
    attributeValues: util.dynamodb.toMapValues({
      bookId: ctx.args.bookId,
      title: ctx.args.input.title,
      publicationDate: ctx.args.input.publicationDate,
      authorId: ctx.args.input.authorId,
      genreIds: ctx.args.input.genreIds,
    }),
  };
}

export function response(ctx) {
  return {
    statusCode: 200,
    message: "Successfully",
  };
}