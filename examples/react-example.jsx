import React, { useState, useEffect } from 'react';
// Импортируем необходимые части из нашей библиотеки
import { createNinjaClient, Movie, ApiError } from 'tmdb-ninja-client';

// Создаем клиент один раз вне компонента
const client = createNinjaClient();

function MovieList() {
  // Состояние для хранения списка фильмов
  const [movies, setMovies] = useState<Movie[]>([]); 
  // Состояние для отслеживания загрузки
  const [loading, setLoading] = useState(true);
  // Состояние для хранения ошибки
  const [error, setError] = useState<string | null>(null);
  // Состояние для текущей страницы
  const [currentPage, setCurrentPage] = useState(1);
  // Состояние для общего количества страниц
  const [totalPages, setTotalPages] = useState(0);

  // Функция для загрузки фильмов
  const fetchMovies = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      // Вызываем метод библиотеки для получения популярных фильмов
      const result = await client.media.getPopularMovies(page);
      
      // Если это первая страница, заменяем данные, иначе добавляем
      setMovies(prevMovies => page === 1 ? result.items : [...prevMovies, ...result.items]);
      setTotalPages(result.totalPages); // Сохраняем общее количество страниц
      setCurrentPage(result.page); // Обновляем текущую страницу
      
    } catch (err) {
      console.error("Ошибка при загрузке фильмов:", err);
      let errorMessage = 'Произошла неизвестная ошибка';
      if (err instanceof ApiError) {
        errorMessage = `Ошибка API (${err.statusCode}): ${err.message}`;
      } else if (err instanceof Error) {
         errorMessage = `Ошибка: ${err.message}`;
      }
      setError(errorMessage);
      setMovies([]); // Очищаем фильмы при ошибке
      setTotalPages(0);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем первую страницу при монтировании компонента
  useEffect(() => {
    fetchMovies(1);
  }, []); // Пустой массив зависимостей - запускается один раз

  // Обработчик для кнопки "Загрузить еще"
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchMovies(currentPage + 1);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1>Популярные фильмы (React Пример)</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {movies.map((movie) => (
          <li key={movie.id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
            <h2>{movie.title} ({movie.releaseDate})</h2>
            <div style={{ display: 'flex', gap: '15px' }}>
              <img
                // Используем getPosterUrl с размером w185
                src={movie.getPosterUrl('w185') || 'placeholder.png'} // Добавь placeholder если нужно
                alt={`Постер ${movie.title}`}
                style={{ width: '100px', height: 'auto', objectFit: 'contain' }}
                onError={(e) => (e.currentTarget.src = 'placeholder.png')} // Запасное изображение при ошибке загрузки
              />
              <div>
                <p><strong>Рейтинг:</strong> {movie.voteAverage?.toFixed(1)} / 10</p>
                <p>{movie.overview}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Показываем кнопку, если есть еще страницы и не идет загрузка */}
      {!loading && currentPage < totalPages && (
        <button onClick={handleLoadMore} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Загрузить еще
        </button>
      )}

      {/* Показываем индикатор загрузки */}
      {loading && <p>Загрузка...</p>}
    </div>
  );
}

export default MovieList;

// Как использовать:
// 1. Убедись, что `tmdb-ninja-client` установлен.
// 2. Импортируй этот компонент в свой основной файл (например, App.js):
//    import MovieList from './examples/react-example'; 
// 3. Вставь <MovieList /> в JSX своего приложения.
// 4. Убедись, что в твоем React-проекте настроена поддержка TypeScript или переименуй файл в .jsx и удали типы. 