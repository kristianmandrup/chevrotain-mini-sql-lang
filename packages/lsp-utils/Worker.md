# Worker

- `WorkerMessageReader`
- `WorkerMessageWriter`

## WorkerMessageReader

Sets up an `onmessage` handler on the `ctx` context, which calls the `callback` with the event data

```ts
  listen(callback: DataCallback) {
    this.ctx.onmessage = (event: MessageEvent) => callback(event.data);
  }
```

## WorkerMessageWriter

Any call to `write` with a `message` will call `postMessage` on the `ctx` context

```ts
  write(message) {
    this.ctx.postMessage(message);
  }
```
