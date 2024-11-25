import { util } from "@aws-appsync/utils";
export function request(ctx) {
  return {
    version: "2018-05-29",
    method: "POST",
    resourcePath: "/",
    params: {
      headers: {
        "Content-Type": "application/x-amz-json-1.0",
        "x-amz-target": "AWSStepFunctions.StartSyncExecution",
      },
      body: {
        stateMachineArn: ctx.stash.stateMachineArn,
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
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return ctx.result;
}
