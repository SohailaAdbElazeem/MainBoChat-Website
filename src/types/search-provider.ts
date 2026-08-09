export type SearchProvider = {
  key: string;               
  label: string;             
  search: (q: string) => Promise<SearchResult[]> | SearchResult[];
};

 