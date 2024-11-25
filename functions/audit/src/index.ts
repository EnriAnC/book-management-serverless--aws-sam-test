import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuditLog } from "./audit.interface";
import { AppSyncEvent } from "../../../graphql/models";

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event: AuditLog) => {
  console.log("Event received:", JSON.stringify(event, null, 2));

  try {
    // Validación del payload
    const { action, tableName, recordKey, value, username } = event;

    if (!["put", "create", "delete"].includes(action)) {
      throw new Error(
        `Invalid action: ${action}. Must be 'put', 'create', or 'delete'.`
      );
    }

    if (!recordKey || !username) {
      throw new Error("recordKey and identity are required parameters.");
    }

    const timestamp = new Date().toISOString();
    const SK = `${Object.values(recordKey).join("&")}#${timestamp}`;
    // Formar el objeto de auditoría
    const auditLog = {
      PK: `AUDIT#${username}`, // Relacionar con el usuario Cognito
      SK: SK, // Ordenado cronológicamente
      action,
      tableName,
      timestamp: timestamp,
      value: value,
      username,
    };

    console.log("Audit log to insert:", auditLog);

    // Guardar en la tabla DynamoDB
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: auditLog,
    });

    await docClient.send(command);

    return {
      statusCode: 200,
      message: "Audit log created successfully",
    };
  } catch (error) {
    console.error("Error in audit log:", error);
    return {
      statusCode: 500,
      error: "Failed to create audit log",
    };
  }
};
