# Примеры Использования в React

Здесь приведены примеры интеграции библиотеки с React для отображения данных.

## Пример 1: Отображение Популярных Медиа

Этот компонент загружает и отображает список популярных фильмов и сериалов.

```jsx
import React, { useState, useEffect } from 'react';
import { createTMDBProxyClient, MediaItem, Movie, TVShow, ApiError, ImageConfig } from 'tmdb-xhzloba';

// Инициализируем клиент один раз
const apiClient = createTMDBProxyClient("ВАШ_API_КЛЮЧ");

function PopularMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]); // Используем MediaItem для смешанного списка
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient.media.getPopular();
        setMedia(data.items);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
        if (err instanceof ApiError) {
          setError(`Ошибка API (${err.statusCode}): ${err.apiMessage || err.message}`);
        } else if (err instanceof Error) {
          setError(`Произошла ошибка: ${err.message}`);
        } else {
          setError("Произошла неизвестная ошибка");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз при монтировании

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div>
      <h1>Популярные фильмы и сериалы</h1>
      <ul>
        {media.map((item) => (
          <li key={item.id}>
            <img
              src={item.getPosterUrl('w92')} // Получаем URL постера
              alt={item instanceof Movie ? item.title : item.name} // У Movie есть title, у TVShow - name
              width="92"
              style={{ marginRight: '10px', verticalAlign: 'middle' }}
            />
            {item instanceof Movie ? item.title : item.name}
            {' '}
            ({item.getFormattedReleaseDate ? item.getFormattedReleaseDate('ru-RU') : item.getFormattedFirstAirDate ? item.getFormattedFirstAirDate('ru-RU') : 'Дата неизвестна'})
            {' - '}
            ⭐ {item.voteAverage.toFixed(1)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PopularMedia;
```

**Пояснения к примеру:**

1.  **Инициализация Клиента:** `createTMDBProxyClient` вызывается **вне** компонента.
2.  **Состояние:** `useState` для `media`, `loading`, `error`.
3.  **Загрузка Данных:** `useEffect` с `[]` для запроса `apiClient.media.getPopular()` один раз.
4.  **Обработка Загрузки и Ошибок:** Отображение статусов.
5.  **Отображение:** Итерация по `media` с помощью `map`.
6.  **Определение Типа:** `instanceof Movie` для доступа к `title`/`name` и форматирования даты.
7.  **Изображения:** Используется `getPosterUrl()`.

## Пример 2: Отображение Профиля Персоны

Этот компонент загружает и отображает детальную информацию о персоне, включая её известные работы и работы в озвучке.

```jsx
import React, { useState, useEffect } from "react";
import {
  createTMDBProxyClient,
  Person,
  Movie,
  TVShow,
  ApiError,
  ImageConfig,
} from "tmdb-xhzloba";

// Замени на свой ключ!
const MY_API_KEY = "СЮДА_ВСТАВЬ_СВОЙ_API_КЛЮЧ";
const client = createTMDBProxyClient(MY_API_KEY);

interface PersonProfileProps {
  personId: number;
}

const PersonProfile: React.FC<PersonProfileProps> = ({ personId }) => {
  const [person, setPerson] = (useState < Person) | (null > null);
  const [loading, setLoading] = useState < boolean > true;
  const [error, setError] = (useState < string) | (null > null);

  useEffect(() => {
    const fetchPerson = async () => {
      setLoading(true);
      setError(null);
      try {
        // Запрашиваем детали с фильмографией
        const personDetails = await client.person.getPersonDetails(personId, {
          appendToResponse: ["combined_credits"],
          language: "ru", // Опционально: запросить на русском
        });
        setPerson(personDetails);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(`Ошибка API (${err.statusCode}): ${err.message}`);
        } else if (err instanceof Error) {
          setError(`Ошибка: ${err.message}`);
        } else {
          setError("Произошла неизвестная ошибка");
        }
        console.error("Ошибка загрузки персоны:", err);
      }
      setLoading(false);
    };

    fetchPerson();
  }, [personId]); // Перезагружаем при смене ID

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!person) return <p>Данные не найдены.</p>;

  // Используем методы класса Person для отображения,
  // сохраняя результаты в константы для читаемости
  const profileImageUrl = person.getProfileUrl("w185");
  const knownForWorks = person.getKnownForWorks(5); // 5 самых известных работ
  const voicedWorks = person.getVoicedWorks();
  const knownMovies = person.getKnownForMovies(); // Лимит по умолчанию 10
  const knownTvShows = person.getKnownForTvShows(); // Лимит по умолчанию 10

  // Получаем доступные размеры постеров для демонстрации
  const availablePosterSizes = ImageConfig.getAvailablePosterSizes();
  {
    /* ImageConfig.getAvailablePosterSizes() возвращает массив строк.
            Это может быть полезно, чтобы динамически выбирать или предлагать 
            пользователю доступные размеры изображений в интерфейсе. */
  }

  return (
    <div>
      <h1>{person.name}</h1>
      {profileImageUrl && (
        <img
          src={profileImageUrl}
          alt={person.name}
          style={{ width: "185px", float: "left", marginRight: "15px" }}
        />
      )}
      <p>{person.biography || "Биография отсутствует."}</p>
      <div style={{ clear: "both" }}></div>

      <h2>Наиболее известен(на) по:</h2>
      {knownForWorks.length > 0 ? (
        <ul>
          {knownForWorks.map((work) => (
            <li key={work.id}>
              {work instanceof Movie ? work.title : work.name} (
              {work instanceof Movie ? "Фильм" : "Сериал"})
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет данных.</p>
      )}

      <h2>Работы в озвучке:</h2>
      {voicedWorks.length > 0 ? (
        <ul>
          {voicedWorks.map((work) => (
            <li key={`voiced-${work.id}`}>
              {work instanceof Movie ? work.title : work.name} (
              {work instanceof Movie ? "Фильм" : "Сериал"})
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет данных об озвучке.</p>
      )}

      <h2>Известные фильмы ({knownMovies.length}):</h2>
      {knownMovies.length > 0 ? (
        <ul>
          {knownMovies.map((movie) => {
            const year = movie.releaseDate?.substring(0, 4) || "N/A";
            const posterUrl = movie.getPosterUrl("w92");
            return (
              <li
                key={`movie-${movie.id}`}
                style={{ marginBottom: "10px", listStyle: "none" }}
              >
                {posterUrl && (
                  <img
                    src={posterUrl}
                    alt={`Постер ${movie.title}`}
                    width="60" // Немного меньше для компактности
                    style={{ verticalAlign: "middle", marginRight: "10px" }}
                  />
                )}
                {movie.title} ({year})
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Нет данных.</p>
      )}

      <h2>Известные сериалы ({knownTvShows.length}):</h2>
      {knownTvShows.length > 0 ? (
        <ul>
          {knownTvShows.map((tvShow) => (
            <li key={`tv-${tvShow.id}`}>{tvShow.name}</li>
          ))}
        </ul>
      ) : (
        <p>Нет данных.</p>
      )}

      {/* Демонстрация ImageConfig */}
      <div style={{ marginTop: "20px", fontSize: "0.8em", color: "grey" }}>
        <p>
          Доступные размеры постеров (из ImageConfig):{" "}
          {availablePosterSizes.join(", ")}
          {/* 
            Пример вывода: w92, w154, w185, w342, w500, w780, original 
            ImageConfig.getAvailablePosterSizes() возвращает массив строк.
            Это может быть полезно, чтобы динамически выбирать или предлагать 
            пользователю доступные размеры изображений в интерфейсе.
          */}
        </p>
      </div>
    </div>
  );
};

export default PersonProfile;
```

## Пример 3: Получение Новинок (Latest)

Этот компонент загружает и отображает списки последних добавленных фильмов и сериалов.

```jsx
import React, { useState, useEffect } from 'react';
import { createTMDBProxyClient, Movie, TVShow, ApiError } from 'tmdb-xhzloba';

const client = createTMDBProxyClient("ВАШ_API_КЛЮЧ");

function LatestMedia() {
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [latestTvShows, setLatestTvShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatest = async () => {
      setLoading(true);
      setError(null);
      try {
        // Запрашиваем параллельно
        const [moviesData, tvShowsData] = await Promise.all([
          client.media.getLatestMovies(1), // Первая страница последних фильмов
          client.media.getLatestTvShows(1), // Первая страница последних сериалов
        ]);
        setLatestMovies(moviesData.items);
        setLatestTvShows(tvShowsData.items);
      } catch (err) {
        console.error("Ошибка загрузки новинок:", err);
        if (err instanceof ApiError) {
          setError(`Ошибка API (${err.statusCode}): ${err.apiMessage || err.message}`);
        } else {
          setError("Произошла неизвестная ошибка");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  if (loading) return <p>Загрузка новинок...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Последние добавленные фильмы</h2>
      {latestMovies.length > 0 ? (
        <ul>
          {latestMovies.map((movie) => (
            <li key={`movie-${movie.id}`}>{movie.title}</li>
          ))}
        </ul>
      ) : <p>Нет данных.</p>}

      <h2>Последние добавленные сериалы</h2>
      {latestTvShows.length > 0 ? (
        <ul>
          {latestTvShows.map((tvShow) => (
            <li key={`tv-${tvShow.id}`}>{tvShow.name}</li>
          ))}
        </ul>
      ) : <p>Нет данных.</p>}
    </div>
  );
}

export default LatestMedia;
```

## Пример 4: Получение Актуальных Медиа (Now Playing)

Этот компонент загружает и отображает списки фильмов и сериалов, которые актуальны сейчас (в прокате/эфире).

```jsx
import React, { useState, useEffect } from 'react';
import { createTMDBProxyClient, Movie, TVShow, ApiError } from 'tmdb-xhzloba';

const client = createTMDBProxyClient("ВАШ_API_КЛЮЧ");

function NowPlayingMedia() {
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [nowPlayingTvShows, setNowPlayingTvShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      setLoading(true);
      setError(null);
      try {
        const [moviesData, tvShowsData] = await Promise.all([
          client.media.getNowPlayingMovies(1),
          client.media.getNowPlayingTvShows(1),
        ]);
        setNowPlayingMovies(moviesData.items);
        setNowPlayingTvShows(tvShowsData.items);
      } catch (err) {
        console.error("Ошибка загрузки актуального:", err);
        if (err instanceof ApiError) {
          setError(`Ошибка API (${err.statusCode}): ${err.apiMessage || err.message}`);
        } else {
          setError("Произошла неизвестная ошибка");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlaying();
  }, []);

  if (loading) return <p>Загрузка актуального...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Фильмы в прокате</h2>
      {/* ... Отображение списка nowPlayingMovies ... */}
      <h2>Сериалы в эфире</h2>
      {/* ... Отображение списка nowPlayingTvShows ... */}
    </div>
  );
}

export default NowPlayingMedia;
```

## Пример 5: Поиск Медиа

Этот компонент позволяет пользователю вводить поисковый запрос и отображает найденные фильмы и сериалы.

```jsx
import React, { useState, useEffect, useCallback } from 'react';
import { createTMDBProxyClient, Movie, TVShow, ApiError } from 'tmdb-xhzloba';

const client = createTMDBProxyClient("ВАШ_API_КЛЮЧ");

function MediaSearch() {
  const [query, setQuery] = useState<string>("");
  const [foundMovies, setFoundMovies] = useState<Movie[]>([]);
  const [foundTvShows, setFoundTvShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(false); // Не загружаем сразу
  const [error, setError] = useState<string | null>(null);

  // Функция для выполнения поиска
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setFoundMovies([]);
      setFoundTvShows([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [moviesData, tvShowsData] = await Promise.all([
        client.media.searchMovies(searchQuery),
        client.media.searchTVShows(searchQuery),
      ]);
      setFoundMovies(moviesData.items);
      setFoundTvShows(tvShowsData.items);
    } catch (err) {
      console.error("Ошибка поиска:", err);
      setFoundMovies([]);
      setFoundTvShows([]);
      if (err instanceof ApiError) {
        setError(`Ошибка API (${err.statusCode}): ${err.apiMessage || err.message}`);
      } else {
        setError("Произошла неизвестная ошибка при поиске");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Обработчик отправки формы
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    performSearch(query);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Найти фильм или сериал..."
        />
        <button type="submit" disabled={loading}>
          {loading ? "Поиск..." : "Найти"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Найденные фильмы</h2>
      {/* ... Отображение списка foundMovies ... */}
      <h2>Найденные сериалы</h2>
      {/* ... Отображение списка foundTvShows ... */}
    </div>
  );
}

export default MediaSearch;
```

## Пример 6: Получение Деталей Медиа

Этот компонент загружает и отображает детали конкретного фильма или сериала по ID.

```jsx
import React, { useState, useEffect } from "react";
import { createTMDBProxyClient, Movie, TVShow, ApiError } from "tmdb-xhzloba";

const client = createTMDBProxyClient("ВАШ_API_КЛЮЧ");

interface MediaDetailsProps {
  mediaType: "movie" | "tv";
  mediaId: number;
}

function MediaDetails({ mediaType, mediaId }: MediaDetailsProps) {
  const [details, setDetails] = (useState < Movie) | TVShow | (null > null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = (useState < string) | (null > null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        let fetchedDetails: Movie | TVShow;
        if (mediaType === "movie") {
          fetchedDetails = await client.media.getMovieDetails(mediaId, {
            language: "ru",
            appendToResponse: ["credits", "videos"], // Пример доп. данных
          });
        } else {
          fetchedDetails = await client.media.getTVShowDetails(mediaId, {
            language: "ru",
            appendToResponse: ["credits", "videos"], // Пример доп. данных
          });
        }
        setDetails(fetchedDetails);
      } catch (err) {
        console.error("Ошибка загрузки деталей:", err);
        if (err instanceof ApiError) {
          setError(
            `Ошибка API (${err.statusCode}): ${err.apiMessage || err.message}`
          );
        } else {
          setError("Произошла неизвестная ошибка");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [mediaId, mediaType]); // Перезагружаем при смене ID или типа

  if (loading) return <p>Загрузка деталей...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!details) return <p>Детали не найдены.</p>;

  // Отображаем детали в зависимости от типа
  const isMovie = details instanceof Movie;
  const title = isMovie ? details.title : details.name;
  const posterUrl = details.getPosterUrl("w185");
  const directors = details.getDirectors ? details.getDirectors() : [];

  return (
    <div>
      <h1>{title}</h1>
      {posterUrl && <img src={posterUrl} alt={title} />}
      <p>{details.overview}</p>
      {/* Отображение доп. данных, например, режиссеров */}
      {directors.length > 0 && (
        <p>Режиссеры: {directors.map((d) => d.name).join(", ")}</p>
      )}
      {/* ... Отображение других деталей, видео и т.д. ... */}
    </div>
  );
}

export default MediaDetails;
```
