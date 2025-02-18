export interface CapabilitySpec {
  name: string;
  type: "middleware";
  blueprint: string;
  optional: boolean;
  options: any;
}
