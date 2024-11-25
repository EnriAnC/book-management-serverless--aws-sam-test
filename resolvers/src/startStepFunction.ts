import { Context } from "@aws-appsync/utils";

export function request(ctx: Context) {
  return {
    version: "2018-05-29",
    method: "POST",
    resourcePath: "/",
    params: {
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "x-amz-target": "AWSStepFunctions.StartExecution",
      },
      body: {
        stateMachineArn: process.env.STATE_MACHINE_ARN,
        input: JSON.stringify({
          field: ctx.info.fieldName,
          arguments: ctx.args,
          source: ctx.source,
          identity: ctx.identity,
        }),
      },
    },
  };
}

export function response(ctx) {
  if (ctx.error) {
    throw new Error(ctx.error.message);
  }
  return ctx.result;
}
