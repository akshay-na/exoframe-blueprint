import App from "../BoilerplateApp";

const PORT = process.env.PORT ?? 3000;

App().listen(PORT, () =>
  console.log(`🚀 API ready on : http://localhost${PORT}`)
);
