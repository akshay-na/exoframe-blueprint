import {
  ArgumentMapping,
  Configuration,
  Discoverable,
  Endpoint,
  Route,
  RouteDescription,
} from "../../../lib/decorators/Route";

interface HelloResponse {
  message: string;
}

@Route("/api/v1/hello") // base path
@RouteDescription("Simple hello-world endpoint") // optional metadata
@Discoverable("demo:hello") // arbitrary tag
export class HelloWorld {
  @Endpoint("GET")
  @Configuration({ access: "PUBLIC", auth: "NONE" })
  @ArgumentMapping([]) // no special args
  public async sayHello(): Promise<HelloResponse> {
    return { message: "Hello World!" };
  }
}
