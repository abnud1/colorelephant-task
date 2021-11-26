import axios from "axios";
import dayjs from "dayjs";
import type { GetServerSideProps, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { TMDB_API_KEY, TMDB_BASE_URL } from "components/consts";
import { TMDBConfiguration, TMDBMovie } from "components/tmdb";
interface Movie {
  id: number;
  image?: string;
  year?: number;
  rating?: number;
  title?: string;
}
interface HomeProps {
  topMovies: Movie[];
  posters_base_url: string;
}
const Home: NextPage<HomeProps> = (props: HomeProps) => {
  const { topMovies, posters_base_url } = props;
  return (
    <>
      <h1>Top Movies</h1>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th className="w-12">Year</th>
            <th className="w-16">Rating</th>
            <th>Poster Image</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {topMovies.map((m) => (
            <tr key={m.id}>
              <td></td>
              <td>{m.title}</td>
              <td>{m.year}</td>
              <td>{m.rating}</td>
              <td className="relative w-96 h-96">
                <Image
                  alt={m.title}
                  src={`${posters_base_url}original${m.image}?api_key=${TMDB_API_KEY}`}
                  layout="fill"
                  objectFit="cover"
                />
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
  console.log(configResponse.data.images.poster_sizes);
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
        rating: v.vote_count,
        title: v.title,
      })),
    },
  };
};
export default Home;
