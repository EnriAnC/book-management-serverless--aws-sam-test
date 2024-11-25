export interface AppSyncEvent<T> {
  field?: string;
  arguments: T;
  source?: string;
  identity?: {
    claims: Record<string, string | number | boolean>;
    username: string;
    sub: string;
    groups: string[] | null;
  };
}
