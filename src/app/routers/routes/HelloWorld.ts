import {
  ArgumentMapping,
  Configuration,
  Discoverable,
  Endpoint,
  ErrorMapping,
  Route,
  RouteDescription,
} from "../../../lib/src/lib/decorators/Route";

interface HelloResponse {
  message: string;
}

@Route("/api/v1/hello")
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
  @ErrorMapping({ NOT_AUTHORIZED: 404 })
  public async postHello(): Promise<HelloResponse> {
    try {
      console.log("🚀 ~ HelloWorld ~ postHello ~ Hello World!:");
      return { message: "POSTED" };
    } catch (error: any) {
      switch (error.id) {
        default:
          throw error;
      }
    }
  }
}
