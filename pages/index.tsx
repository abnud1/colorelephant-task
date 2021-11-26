import axios from "axios";
import dayjs from "dayjs";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { TMDB_API_KEY, TMDB_BASE_URL } from "components/consts";
import { TMDBConfiguration, TMDBMovie } from "components/tmdb";
import { useState } from "react";
interface Movie {
  id: number;
  image: string;
  year: number;
  rating: number;
  title: string;
}
interface HomeProps {
  topMovies: Movie[];
  posters_base_url: string;
}
const Home: NextPage<HomeProps> = (props: HomeProps) => {
  const { topMovies, posters_base_url } = props;
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const sortedMovies = [...topMovies].sort((a, b) =>
    order === "asc" ? a.rating - b.rating : b.rating - a.rating
  );
  return (
    <>
      <h1>Top Movies</h1>
      <div>
        <button
          onClick={() => setOrder("asc")}
          type="button"
          className="bg-blue-500 w-12 rounded-lg mr-1"
        >
          ASC
        </button>
        <button
          onClick={() => setOrder("desc")}
          type="button"
          className="bg-blue-500 w-12 rounded-lg"
        >
          DESC
        </button>
      </div>
      <table className="text-4xl sm:text-base">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th className="w-12">Year</th>
            <th className="w-16">Rating</th>
            <th>Poster Image</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {sortedMovies.map((m) => (
            <tr key={m.id}>
              <td></td>
              <td>{m.title}</td>
              <td>{m.year}</td>
              <td>{m.rating}</td>
              <td className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={m.title}
                  src={`${posters_base_url}w500${m.image}?api_key=${TMDB_API_KEY}`}
                  width={500}
                  height={750}
                />
              </td>
              <td>
                <Link href={`/movie/${m.id}`}>Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async () => {
  const configResponse = await axios.get<TMDBConfiguration>(
    `${TMDB_BASE_URL}/configuration?api_key=${TMDB_API_KEY}`
  );
  const response = await axios.get<{ results: TMDBMovie[] }>(
    `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`
  );
  return {
    props: {
      posters_base_url: configResponse.data.images.secure_base_url,
      topMovies: response.data.results.map((v) => ({
        id: v.id,
        image: v.poster_path,
        year: dayjs(v.release_date).year(),
        rating: v.vote_average,
        title: v.title,
      })),
    },
  };
};
export default Home;
