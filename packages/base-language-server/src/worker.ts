import { getWorkerConnection } from "../../lsp-utils";
export const run = ({ createLanguageServer }) => {
  const connection = getWorkerConnection();
  const server = createLanguageServer({ connection });
  server.start();
  connection.onExit(self.close);
};
