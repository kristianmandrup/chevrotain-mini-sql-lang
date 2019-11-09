import { getCliConnection } from "../../lsp-utils";

export const run = ({ createLanguageServer, title }) => {
  const connection = getCliConnection(title);
  const server = createLanguageServer({ connection });
  server.start();
  return connection;
};
