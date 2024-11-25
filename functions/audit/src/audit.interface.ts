export interface AuditLog {
  action: string;
  tableName: string;
  recordKey: RecordKey;
  value: Record<string, any>;
  username: string;
  timestamp?: string;
}

export interface RecordKey {
  PK: string;
  SK: string;
}
