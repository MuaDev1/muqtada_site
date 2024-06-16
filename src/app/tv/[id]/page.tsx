import axios from 'axios';
import Link from 'next/link';
import Modal from '../../../components/Modal'; // تأكد من مسار الاستيراد

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

async function fetchTVShowDetails(id: string): Promise<TVShow | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=ar`;
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.error('Failed to fetch TV show details', err);
    return null;
  }
}

export default async function TVShowDetail({ params }: { params: { id: string } }) {
  const tvShow = await fetchTVShowDetails(params.id);
  const watchUrl = `https://vidsrc.me/embed/${params.id}`;

  if (!tvShow) {
    return <div className="container mx-auto p-4">فشل في جلب بيانات المسلسل.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="text-blue-500 underline">العودة إلى الصفحة الرئيسية</Link>
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
        <Modal
          isOpen={false} // حالياً غير مفعل، يمكنك إدارة الحالة حسب الحاجة
          onClose={() => {}}
          videoUrl={watchUrl}
        />
      </div>
    </div>
  );
}
