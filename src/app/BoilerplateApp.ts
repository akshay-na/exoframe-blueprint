// src/app.ts

import { ExpressBuilder } from "@akshay-na/exoframe/lib/express/ExpressBuilder";
import "./routers/routes/index";

export default function App() {
  return new ExpressBuilder().initialize();
}
