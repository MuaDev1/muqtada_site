'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Modal from '../../../components/Modal';

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  number_of_seasons: number;
  number_of_episodes: number;
}

export async function getStaticPaths() {
  // يمكن أن يكون هذا API أو قائمة بالمحتوى الخاص بك
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const res = await axios.get(
    `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=ar&page=1`
  );
  const shows = res.data.results;

  const paths = shows.map((show: TVShow) => ({
    params: { id: show.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const res = await axios.get(
    `https://api.themoviedb.org/3/tv/${params.id}?api_key=${apiKey}&language=ar`
  );
  return { props: { tvShow: res.data } };
}

const TVShowDetail = ({ tvShow }: { tvShow: TVShow }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const watchUrl = `https://vidsrc.me/embed/${tvShow.id}`;

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="text-blue-500 underline">
        العودة إلى الصفحة الرئيسية
      </Link>
      {tvShow && (
        <div className="mt-8">
          <h1 className="text-4xl font-bold mb-4">{tvShow.name}</h1>
          <div className="relative mb-4">
            <img
              src={`https://image.tmdb.org/t/p/w1280${tvShow.backdrop_path}`}
              alt={tvShow.name}
              className="w-full rounded-lg shadow-lg object-cover h-64"
            />
            <img
              src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
              alt={tvShow.name}
              className="absolute bottom-4 left-4 w-24 h-36 rounded-lg shadow-md object-cover"
            />
          </div>
          <p className="text-lg mb-4">{tvShow.overview}</p>
          <ul className="list-disc list-inside mb-4">
            <li><strong>تاريخ العرض الأول:</strong> {tvShow.first_air_date}</li>
            <li><strong>التصنيف:</strong> {tvShow.vote_average} / 10</li>
            <li><strong>عدد المقيمين:</strong> {tvShow.vote_count}</li>
            <li><strong>عدد المواسم:</strong> {tvShow.number_of_seasons}</li>
            <li><strong>عدد الحلقات:</strong> {tvShow.number_of_episodes}</li>
          </ul>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
          >
            شاهد المسلسل
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

export default TVShowDetail;
