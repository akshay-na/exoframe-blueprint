interface RouteOptions {
  version?: string;
}

interface EndpointOptions {
  hints?: string[];
}

interface ConfigurationOptions {
  access?: "PUBLIC" | "PROTECTED";
  auth?: "NONE" | "JWT";
  guard?: Record<string, unknown>;
}

interface ErrorMappingOptions {
  [errorCode: string]: number;
}
