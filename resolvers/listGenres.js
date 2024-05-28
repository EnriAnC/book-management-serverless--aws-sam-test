import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return dynamoDBListItems({ entityId: "GENRE" });
}

export function response(ctx) {
  return ctx.result.items;
}

/**
 * A helper function to get a DynamoDB item
 */
function dynamoDBListItems({ entityId }) {
  return {
    operation: "Query",
    query: {
      expression: "#entityId = :entityId",
      expressionNames: {
        "#entityId": "entityId"
      },
      expressionValues: util.dynamodb.toMapValues({
        ":entityId": entityId
      }),
    }
  };
}
