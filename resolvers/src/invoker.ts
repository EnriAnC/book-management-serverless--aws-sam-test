import { Context, Identity } from "@aws-appsync/utils";

export function request(ctx: Context) {
  const { source, args, identity } = ctx;
  console.log("Invoking Lambda...context: ", ctx);
  return {
    operation: "Invoke",
    payload: { field: ctx.info.fieldName, arguments: args, source, identity },
  };
}

export function response(ctx) {
  return ctx.result;
}
