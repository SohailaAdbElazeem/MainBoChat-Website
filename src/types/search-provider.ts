export type SearchProvider = {
  key: string;               // unique key: e.g., 'products', 'pages'
  label: string;             // section header
  search: (q: string) => Promise<SearchResult[]> | SearchResult[];
};

 