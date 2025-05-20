# 🚀 Express JS Template &mdash; Powered by **Exoframe**

Welcome to the next generation of Express.js development! This project is more than just a boilerplate—it's a launchpad for building robust, distributed systems in record time, thanks to the power of **Exoframe**.

---

## What is **Exoframe**?

**Exoframe** is a modern, TypeScript-first wrapper around Express.js, designed to help you bootstrap scalable, distributed backend systems with minimal effort and maximum flexibility. It brings together the best of Express with advanced patterns, decorators, and utilities, so you can focus on your business logic—not boilerplate.

> **Think of Exoframe as your expressway to distributed system architecture.**

---

## ✨ Key Features

- **Decorator-Driven Routing:** Define routes, endpoints, and middleware using expressive TypeScript decorators.
- **Plug-and-Play Middleware:** Built-in logging, request tracing, and error handling out of the box.
- **Distributed System Ready:** Designed for microservices, with environment and configuration management, in-memory DB utilities, and more.
- **Type-Safe Everything:** Leverages Zod for schema validation and type safety across your API.
- **Production-Grade Logging:** Pino-powered, async-context-aware logging for observability.
- **Rapid Bootstrapping:** Go from zero to a running API in minutes, not hours.

---

## 🚦 Quickstart

```bash
# 1. Clone the template
$ git clone https://github.com/akshay-na/express-js-template.git
$ cd express-js-template

# 2. Install dependencies
$ pnpm install

# 3. Start the development server
$ pnpm run start-dev
```

---

## 🛠️ Example: Hello World Route (with Exoframe)

```typescript
import {
  Route,
  Endpoint,
  Configuration,
  ArgumentMapping,
  ErrorMapping,
  RouteDescription,
  Discoverable,
} from "@akshay-na/exoframe/lib/decorators/Route";

@Route("/api/v1/hello/:name?")
@RouteDescription("Simple hello-world endpoint")
@Discoverable("demo:hello")
export class HelloWorld {
  @Endpoint("GET")
  @Configuration({ access: "PUBLIC", auth: "NONE" })
  @ArgumentMapping(["$query"])
  @ErrorMapping({ NOT_AUTHORIZED: 404 })
  public async sayHello(query: any) {
    return { message: `Hello ${query.name || "World"}!` };
  }
}
```

---

## 🧩 How It Works

- **ExpressBuilder:** Instantiates and configures your Express app with best practices baked in.
- **Route Decorators:** Use `@Route`, `@Endpoint`, and friends to declare routes and HTTP methods directly on your classes.
- **Automatic Registration:** All decorated routes are auto-registered—no manual wiring required.
- **Request Logging:** Every request is logged with a unique request ID and rich context for distributed tracing.
- **Environment Management:** Seamlessly load and manage environment configs for local, dev, staging, and prod.

---

## 🌐 Distributed System Ready

- **In-Memory Database Utilities:** Prototype and test distributed flows without external DBs.
- **Configurable Environments:** Easily switch between environments and scale horizontally.
- **Observability:** Built-in logging and error handling for production-grade monitoring.

---

## 📦 Project Structure

```
├── src/
│   ├── app/
│   │   ├── routers/
│   │   │   └── routes/         # Route classes (decorator-based)
│   │   ├── servers/            # Server entrypoints
│   │   └── ...
│   └── ...
├── packages/
│   └── @akshay-na/
│       └── exoframe/           # The Exoframe core library
└── ...
```

---

## 📖 Documentation

- **API Docs:** See the `docs/` directory for detailed API documentation and advanced usage.
- **Example Apps:** Explore the `src/app/routers/routes/` for real-world route examples.

---

## 🤝 Contributing

PRs and issues are welcome! Please see the [contributing guidelines](CONTRIBUTING.md) (if available) or open an issue to discuss your ideas.

---

## 📝 License

```
MIT &copy; Akshay N A
```
