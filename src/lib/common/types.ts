export type PathLike = string | Array<string | string[]>;
export type PathMapping = { [key: string]: PathLike };
export type Platform = "local" | "azure";
export type PlatformComponent = string;
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
