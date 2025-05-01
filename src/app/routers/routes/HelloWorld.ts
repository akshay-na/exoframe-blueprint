import {
  ArgumentMapping,
  Configuration,
  Discoverable,
  Endpoint,
  ErrorMapping,
  Route,
  RouteDescription,
} from "@akshay-na/exoframe/lib/decorators/Route";
import { ZodUtils } from "@akshay-na/exoframe/lib/zod/ZodUtils";
import { UserData, userSchema } from "./schemas/HelloWorldBody";

interface HelloResponse {
  message: string;
}

@Route("/api/v1/hello/:name?")
@RouteDescription("Simple hello-world endpoint")
@Discoverable("demo:hello")
export class HelloWorld {
  @Endpoint("GET")
  @Configuration({ access: "PUBLIC", auth: "NONE" })
  @ArgumentMapping([])
  @ErrorMapping({ NOT_AUTHORIZED: 404 })
  public async sayHello(): Promise<HelloResponse> {
    try {
      return { message: "Hello World!" };
    } catch (error: any) {
      switch (error.id) {
        default:
          throw error;
      }
    }
  }

  @Endpoint("POST")
  @Configuration({ access: "PUBLIC", auth: "NONE" })
  @ArgumentMapping(["$body"])
  @ErrorMapping({ VALIDATION_FAILED: 400 })
  public async postHello(data: UserData): Promise<HelloResponse> {
    try {
      ZodUtils.parse(userSchema, data);
      return { message: "POSTED" };
    } catch (error: any) {
      switch (error.id) {
        default:
          throw error;
      }
    }
  }

  @Endpoint("PUT")
  @Configuration({ access: "PUBLIC", auth: "NONE" })
  @ArgumentMapping([{ $param: "name" }, { $body: { $schema: "body" } }])
  @ErrorMapping({ VALIDATION_FAILED: 400 })
  public async repeatHello(
    category: string,
    body: UserData
  ): Promise<HelloResponse> {
    try {
      ZodUtils.parse(userSchema, body);
      return { message: `Hello ${category}!` };
    } catch (error: any) {
      switch (error.id) {
        default:
          throw error;
      }
    }
  }
}
