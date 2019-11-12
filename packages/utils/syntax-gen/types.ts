export interface GenerateSyntaxOpts {
  ext: string;
}

export interface GenerateRepoOpts extends GenerateSyntaxOpts {
  name: string;
  fileTypes?: string[];
  scopeName?: string;
  main?: string;
}
