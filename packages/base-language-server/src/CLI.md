# CLI

Call run with `({ createLanguageServer, title })` to create and start the Language Server.

Typical `createLanguageServer` factory method:

```ts
const createLanguageServer = ({connection}) => new MyLanguageServer(connection)
```
