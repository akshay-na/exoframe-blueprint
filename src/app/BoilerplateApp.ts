// src/app.ts
import express from "express";

import { ExpressBuilder } from "../lib/src/lib/express/ExpressBuilder";
import "./routers/routes/index";

export default function App() {
  const app = express();
  app.use(express.json());
  new ExpressBuilder(app).initialize();
  return app;
}
