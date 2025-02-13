export interface IFilterQuery {
  seller?: string;
  category?: string;
  brand?: string;
  price?: {
    $gte?: number;
    $lte?: number;
  };
  [key: string]: any; 
}

export interface IFilterOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
