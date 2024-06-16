'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Modal from '../../../components/Modal';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
}

export async function getStaticPaths() {
  // يمكن أن يكون هذا API أو قائمة بالمحتوى الخاص بك
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ar&page=1`
  );
  const movies = res.data.results;

  const paths = movies.map((movie: Movie) => ({
    params: { id: movie.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/${params.id}?api_key=${apiKey}&language=ar`
  );
  return { props: { movie: res.data } };
}

const MovieDetail = ({ movie }: { movie: Movie }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const watchUrl = `https://vidsrc.me/embed/${movie.id}`;

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="text-blue-500 underline">
        العودة إلى الصفحة الرئيسية
      </Link>
      {movie && (
        <div className="mt-8">
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
          <div className="relative mb-4">
            <img
              src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg object-cover h-64"
            />
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="absolute bottom-4 left-4 w-24 h-36 rounded-lg shadow-md object-cover"
            />
          </div>
          <p className="text-lg mb-4">{movie.overview}</p>
          <ul className="list-disc list-inside mb-4">
            <li><strong>التاريخ:</strong> {movie.release_date}</li>
            <li><strong>التصنيف:</strong> {movie.vote_average} / 10</li>
            <li><strong>عدد المقيمين:</strong> {movie.vote_count}</li>
            <li><strong>مدة العرض:</strong> {movie.runtime} دقيقة</li>
          </ul>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
          >
            شاهد الفيلم
          </button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            videoUrl={watchUrl}
          />
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
