export interface AppSyncEvent<T> {
  field?: string;
  arguments: T;
  source?: string;
}
