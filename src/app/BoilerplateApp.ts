// src/app.ts

import { ExpressBuilder } from "../lib/src/lib/express/ExpressBuilder";
import "./routers/routes/index";

export default function App() {
  return new ExpressBuilder().initialize();
}
