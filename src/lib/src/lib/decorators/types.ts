export interface RouteOptions {
  version?: string;
}

export interface EndpointOptions {
  hints?: string[];
}

export interface ConfigurationOptions {
  access?: "PUBLIC" | "PROTECTED";
  auth?: "NONE" | "JWT";
  guard?: Record<string, unknown>;
}

export interface ErrorMappingOptions {
  [errorCode: string]: number;
}
