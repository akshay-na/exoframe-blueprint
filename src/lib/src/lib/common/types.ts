// PathUtils types
export type PathLike = string | Array<string | string[]>;
export type PathMapping = { [key: string]: PathLike };

// CryptoUtils Types
export type HashedValue = string;
export type EncryptedValue = string;
export type DecryptedValue = { type: string; value: string | Buffer };

export type UuidType = string;

export type KeyFile = PathLike | { keyfile: PathLike; passphrase: string };
export type Secret =
  | string
  | Buffer
  | { key: string | Buffer; passphrase: string };

// Environment Types
export type PlatformComponent = string;
export type Platform = "local" | "azure";
export type ParseSpec = { [key: string]: VarType };
export type EnvironmentType =
  | "local"
  | "docker"
  | "development"
  | "testing"
  | "staging"
  | "production";

export type VarType =
  | "integer"
  | "number"
  | "hex"
  | "colour"
  | "boolean"
  | "json"
  | "date"
  | "url";
