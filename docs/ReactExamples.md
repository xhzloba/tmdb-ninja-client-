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
