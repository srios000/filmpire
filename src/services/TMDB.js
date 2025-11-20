import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const tmdbApiKey = import.meta.env.VITE_TMDB_KEY;
const tmdbBearerToken = import.meta.env.VITE_TMDB_BEARER_TOKEN;
const page = 1;

// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: `Bearer ${tmdbBearerToken}`
//   }
// };

// fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
//   .then(res => res.json())
//   .then(res => console.log(res))
//   .catch(err => console.error(err));

export const tmdbApi = createApi({
    reducerPath: 'tmdbApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.themoviedb.org/3' }),
    endpoints: (builder) => ({
        //* Get Movies by [Type]
        getMovies: builder.query({
            query: () => `/movie/popular?page=${page}&api_key=${tmdbApiKey}`,
        }),
    }),
});

export const {
    useGetMoviesQuery
} = tmdbApi;