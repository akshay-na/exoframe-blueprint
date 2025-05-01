// CryptoUtils.ts
// Utilities that support cryptographic operations and hashing

import bcrypt from "bcrypt";
import crypto from "crypto";
import fs from "fs";

import { ENVIRONMENT } from "../common/Environment";
import { Todo } from "./errors";
import { PathUtils } from "./PathUtils";
import {
  DecryptedValue,
  EncryptedValue,
  HashedValue,
  KeyFile,
  Secret,
} from "./types";
import { UUID } from "./UUID";

export class CryptoUtils {
  public static DEFAULT_ROUNDS = 5;
  public static IV = crypto.randomBytes(16);
  public static ALGORITHM = "aes-256-ctr";

  public static async hash(
    value: string,
    rounds?: number
  ): Promise<HashedValue> {
    return bcrypt.hash(value, rounds ?? CryptoUtils.DEFAULT_ROUNDS);
  }

  public static async compare(value: string, secret: string): Promise<boolean> {
    return bcrypt.compare(value, secret);
  }

  public static async encrypt(
    type: string,
    value: string | Buffer,
    secret: Secret
  ): Promise<EncryptedValue> {
    if (typeof value !== "string") throw new Todo({ spec: "encrypt Buffer" });
    if (ENVIRONMENT.isLocal) {
      return `Encrypted(${type}:${value})`;
    } else {
      if (typeof secret !== "string")
        throw new Todo({ spec: "support Secret types" });
      const key = secret.substr(0, 32);
      const cipher = crypto.createCipheriv(
        CryptoUtils.ALGORITHM,
        key,
        CryptoUtils.IV
      );
      const encrypted = Buffer.concat([
        cipher.update(`${type}:${value}`),
        cipher.final(),
      ]);
      return encrypted.toString("base64");
    }
  }

  public static async decrypt(
    value: EncryptedValue,
    secret: Secret
  ): Promise<DecryptedValue | undefined> {
    if (ENVIRONMENT.isLocal) {
      if (value === undefined || !value.startsWith("Encrypted("))
        return undefined;
      const bits = value.split(":");
      return { type: bits[0].slice(10), value: bits[1].slice(0, -1) };
    } else {
      if (typeof secret !== "string")
        throw new Todo({ spec: "support Secret types" });
      const key = secret.substr(0, 32);
      const decipher = crypto.createDecipheriv(
        CryptoUtils.ALGORITHM,
        key,
        Buffer.from(CryptoUtils.IV)
      );
      const decrpyted = Buffer.concat([
        decipher.update(Buffer.from(value, "base64")),
        decipher.final(),
      ]);
      const bits = decrpyted.toString().split(":");
      return { type: bits[0], value: bits[1] };
    }
  }

  public static async loadSecret(
    keyFile: KeyFile
  ): Promise<Secret | undefined> {
    const keysFolder = ENVIRONMENT.path("keys") ?? "keys";
    if (typeof keyFile === "string" || Array.isArray(keyFile)) {
      const filePath = PathUtils.path(keysFolder, keyFile);
      if (fs.existsSync(filePath)) return fs.readFileSync(filePath);
      else return undefined;
    } else {
      const filePath = PathUtils.path(keysFolder, keyFile.keyfile);
      if (fs.existsSync(filePath))
        return {
          key: fs.readFileSync(filePath),
          passphrase: keyFile.passphrase,
        };
      else return undefined;
    }
  }

  public static async generateToken(
    factory?: (value: string) => string
  ): Promise<string> {
    let token = await CryptoUtils.hash(UUID.randomUUID());
    if (factory !== undefined) token = factory(token);
    return Buffer.from(unescape(encodeURIComponent(token))).toString("base64");
  }
}
