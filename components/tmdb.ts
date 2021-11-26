export interface TMDBMovie {
  id: number;
  poster_path: string;
  release_date: string;
  vote_count: number;
  title: string;
}
export interface TMDBConfiguration {
  images: {
    secure_base_url: string;
    poster_sizes: string[];
  };
}
