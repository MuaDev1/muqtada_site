import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Modal from '../../../components/Modal'; // تأكد من مسار الاستيراد

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

async function fetchMovieDetails(id: string): Promise<Movie | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=ar`;
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.error('Failed to fetch movie details', err);
    return null;
  }
}

export default async function MovieDetail({ params }: { params: { id: string } }) {
  const movie = await fetchMovieDetails(params.id);
  const watchUrl = `https://vidsrc.me/embed/${params.id}`;

  if (!movie) {
    return <div className="container mx-auto p-4">فشل في جلب بيانات الفيلم.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="text-blue-500 underline">العودة إلى الصفحة الرئيسية</Link>
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
        <Modal
          isOpen={false} // حالياً غير مفعل، يمكنك إدارة الحالة حسب الحاجة
          onClose={() => {}}
          videoUrl={watchUrl}
        />
      </div>
    </div>
  );
}
