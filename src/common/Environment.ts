import * as dotenv from "dotenv";
import * as path from "path";

class Environment {
  private static envVariables: { [key: string]: string | undefined } = {};

  /**
   * Initializes the environment by loading the respective .env file
   * based on the current NODE_ENV.
   */
  public static load(): void {
    const env = process.env.NODE_ENV || "development";
    console.log(`NODE_ENV = ${env}`);

    const envFilePath = path.resolve(process.cwd(), `.env.${env}`);
    const result = dotenv.config({ path: envFilePath });

    if (result.error) {
      console.error(
        `Failed to load environment file for NODE_ENV=${env}: ${result.error}`
      );
    } else {
      console.log(`Environment variables loaded from ${envFilePath}`);
      this.envVariables = process.env; // Keep the loaded env variables for future use
    }
  }

  /**
   * Get the value of an environment variable.
   * @param key - The name of the environment variable
   * @returns The value of the environment variable, or undefined if not found
   */
  public static get(key: string): string | undefined {
    return this.envVariables[key];
  }

  /**
   * Set the value of an environment variable (in-memory only).
   * @param key - The name of the environment variable
   * @param value - The value to set
   */
  public static set(key: string, value: string): void {
    this.envVariables[key] = value;
  }

  /**
   * Print all current environment variables for debugging purposes.
   */
  public static printAll(): void {
    console.log("Current Environment Variables:");
    console.log(this.envVariables);
  }
}

export default Environment;
