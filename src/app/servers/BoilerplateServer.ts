import { ENVIRONMENT } from "@akshay-na/exoframe/lib/common/Environment";
import App from "../BoilerplateApp";

const PORT = ENVIRONMENT.get("PORT") ?? 8888;

App().listen(PORT, () =>
  console.log(`🚀 API ready on : http://localhost:${PORT}`)
);
