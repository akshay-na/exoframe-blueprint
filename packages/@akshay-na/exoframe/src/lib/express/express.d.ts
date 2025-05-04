import { Request } from "express";
import { File } from "multer"; // if using multer for file uploads

declare global {
  namespace Express {
    interface Request {
      files?: {
        [fieldname: string]: Express.Multer.File | Express.Multer.File[];
      };
    }
  }
}
