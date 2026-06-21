export type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  href?: string; // if provided, Enter will navigate
  icon?: React.ReactNode;
  meta?: string;
};

 