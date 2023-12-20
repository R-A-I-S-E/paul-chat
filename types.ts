export type Input = {
  queryTexts: string;
  nResults: number;
};
export type Metadatas = { name: string }; //metadatas can be added in the ingest process if you want to have here more information
export type DatabaseResponse = {
  response: {
    ids: string[];
    distances: number[][];
    documents: string[];
    metadatas: Metadatas[] | null;
    embeddings: number[][] | null;
    data: any | null;
    uris: any | null;
  };
};
