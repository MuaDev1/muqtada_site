'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';

interface Media {
  id: number;
  title?: string; // العنوان للأفلام
  name?: string; // الاسم للمسلسلات
  poster_path: string;
  backdrop_path: string;
  overview: string;
  media_type: string; // نوع الوسائط (فيلم أو مسلسل)
}

interface Category {
  id: string;
  name: string;
}

const movieCategories: Category[] = [
  { id: '28', name: 'أكشن' },
  { id: '35', name: 'كوميديا' },
  { id: '18', name: 'دراما' },
  // يمكنك إضافة المزيد من التصنيفات هنا
];

const tvCategories: Category[] = [
  { id: '10759', name: 'أكشن ومغامرة' },
  { id: '35', name: 'كوميديا' },
  { id: '18', name: 'دراما' },
  // يمكنك إضافة المزيد من التصنيفات هنا
];

export default function Home() {
  const [movies, setMovies] = useState<Record<string, Media[]>>({});
  const [tvShows, setTvShows] = useState<Record<string, Media[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Media[]>([]);

  useEffect(() => {
    const fetchMoviesByCategory = async (categoryId: string) => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=ar&with_genres=${categoryId}`;
      const response = await axios.get(url);
      setMovies((prevMovies) => ({
        ...prevMovies,
        [categoryId]: response.data.results.map((movie: any) => ({ ...movie, media_type: 'movie' })),
      }));
    };

    const fetchTvShowsByCategory = async (categoryId: string) => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=ar&with_genres=${categoryId}`;
      const response = await axios.get(url);
      setTvShows((prevTvShows) => ({
        ...prevTvShows,
        [categoryId]: response.data.results.map((show: any) => ({ ...show, media_type: 'tv' })),
      }));
    };

    movieCategories.forEach((category) => {
      fetchMoviesByCategory(category.id);
    });
    tvCategories.forEach((category) => {
      fetchTvShowsByCategory(category.id);
    });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ar&query=${searchTerm}`;
    const response = await axios.get(url);
    setSearchResults(response.data.results.filter((result: any) => result.media_type === 'movie' || result.media_type === 'tv'));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">موقع الأفلام والمسلسلات</h1>
      <form onSubmit={handleSearch} className="mb-8 text-center">
        <input
          type="text"
          placeholder="ابحث عن فيلم أو مسلسل"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-lg w-full md:w-1/2"
        />
        <button
          type="submit"
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          بحث
        </button>
      </form>

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {searchResults.map((media) => (
            <Link href={`/${media.media_type}/${media.id}`} key={media.id}>
              <div className="cursor-pointer">
                <img
                  src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                  alt={media.title || media.name}
                  className="rounded-lg shadow-md object-cover"
                />
                <span className="block text-center mt-2">{media.title || media.name}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">أفلام</h2>
          {movieCategories.map((category) => (
            <div key={category.id} className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
              <Swiper
                spaceBetween={10}
                slidesPerView={5}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 5 },
                }}
                className="mb-8"
              >
                {movies[category.id]?.map((movie) => (
                  <SwiperSlide key={movie.id} className="flex flex-col items-center">
                    <Link href={`/movie/${movie.id}`}>
                      <div className="cursor-pointer">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="rounded-lg shadow-md object-cover"
                        />
                        <span className="block text-center mt-2">{movie.title}</span>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ))}

          <h2 className="text-2xl font-semibold mb-4">مسلسلات</h2>
          {tvCategories.map((category) => (
            <div key={category.id} className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
              <Swiper
                spaceBetween={10}
                slidesPerView={5}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 5 },
                }}
                className="mb-8"
              >
                {tvShows[category.id]?.map((show) => (
                  <SwiperSlide key={show.id} className="flex flex-col items-center">
                    <Link href={`/tv/${show.id}`}>
                      <div className="cursor-pointer">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                          alt={show.name}
                          className="rounded-lg shadow-md object-cover"
                        />
                        <span className="block text-center mt-2">{show.name}</span>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
