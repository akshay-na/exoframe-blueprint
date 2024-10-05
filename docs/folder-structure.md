## Project Structure

```
src/
┣ app/
┃ ┣ app.controller.spec.ts
┃ ┣ app.controller.ts
┃ ┣ app.module.ts
┃ ┣ app.service.ts
┃ ┗ app.utils.ts
┣ common/
┃ ┣ configs/ ### Where environment variables are centrally available
┃ ┃ ┣ config.interface.ts
┃ ┃ ┗ config.ts
┃ ┣ dtos/ ### DTO is an object that defines strictness as to how data will be sent over the network
┃ ┃ ┗ baseApi-response.dto.ts
┃ ┗ shared.module.ts
┣ demo/
┃ ┣ controller/ ### Responsible for handling incoming requests and returning responses to the client.
┃ ┃ ┗ demo.controller.ts
┃ ┣ dal/
┃ ┣ helpers/ ### Assist service files to implement business logic
┃ ┣ schema/
┃ ┣ services/ ### Where business logic is written
┃ ┃ ┗ demo.service.ts
┃ ┗ demo.module.ts
┣ main.ts
┗ metadata.ts
```
