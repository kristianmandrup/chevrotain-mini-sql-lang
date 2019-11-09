# Worker

Call `run` with `({ createLanguageServer })` to create and start the Language Server worker.

Typical `createLanguageServer` factory method:

```ts
const createLanguageServer = ({connection}) => new MyLanguageServer(connection)
```

The `run` function for the `worker` is very similar to the `cli`
