# Сервис Медиа (`client.media`)

Этот сервис предоставляет методы для получения списков фильмов и сериалов, а также деталей по конкретному медиа-элементу.

## Получение Списков Медиа

Все методы для получения списков возвращают пагинированный результат (`PaginatedMediaResult`, `PaginatedMovieResult` или `PaginatedTVShowResult`), содержащий:

- `items`: Массив объектов `Movie` и/или `TVShow`.
- `page`: Текущий номер страницы.
- `totalPages`: Общее количество страниц.
- `totalResults`: Общее количество результатов.

- **`client.media.getPopular( [page] )`**

  - Получает список самых популярных фильмов и сериалов.
  - Возвращает: `Promise<PaginatedMediaResult>` (смешанный список `Movie | TVShow`).
  - ```typescript
    // Получить первую страницу популярных
    client.media.getPopular().then((data) => console.log(data.items));
    // Получить вторую страницу
    client.media.getPopular(2).then((data) => console.log(data.items));
    ```

- **`client.media.getLatest( [page] )`**

  - Получает список последних добавленных медиа (сортировка `latest`).
  - Возвращает: `Promise<PaginatedMediaResult>` (смешанный список `Movie | TVShow`).
  - ```typescript
    client.media
      .getLatest()
      .then((data) => console.log("Последние добавленные:", data.items));
    ```

- **`client.media.getLatestMovies( [page] )`**

  - Получает список только последних добавленных фильмов.
  - Возвращает: `Promise<PaginatedMovieResult>` (список `Movie`).
  - ```typescript
    client.media
      .getLatestMovies()
      .then((data) => console.log("Последние фильмы:", data.items));
    ```

- **`client.media.getLatestTvShows( [page] )`**

  - Получает список только последних добавленных сериалов.
  - Возвращает: `Promise<PaginatedTVShowResult>` (список `TVShow`).
  - ```typescript
    client.media
      .getLatestTvShows()
      .then((data) => console.log("Последние сериалы:", data.items));
    ```

- **`client.media.getLatestHighQualityTVShows( [page] )`**

  - Получает список только последних добавленных сериалов **в высоком качестве**.
  - Возвращает: `Promise<PaginatedTVShowResult>` (список `TVShow`).
  - ```typescript
    // Получить первую страницу сериалов в высоком качестве
    client.media
      .getLatestHighQualityTVShows()
      .then((data) =>
        console.log("Последние сериалы в высоком качестве:", data.items)
      );
    ```

    - **`client.media.getLatestHighQualityMovies( [page] )`**

  - Получает список только последних добавленных фильмов **в высоком качестве (4K)**.
  - Возвращает: `Promise<PaginatedMovieResult>` (список `Movie`).
  - ```typescript
    // Получить первую страницу фильмов в 4K
    client.media
      .getLatestHighQualityMovies()
      .then((data) => console.log("Последние 4K фильмы:", data.items));
    ```

- **`client.media.getLatestHighQuality( [page] )`**

  - Получает смешанный список последних добавленных фильмов и сериалов **в высоком качестве (4K)**.
  - Возвращает: `Promise<PaginatedMediaResult>` (смешанный список `Movie | TVShow`).
  - ```typescript
    // Получить первую страницу новинок в 4K
    client.media
      .getLatestHighQuality()
      .then((data) =>
        console.log("Последние 4K новинки (фильмы и сериалы):", data.items)
      );
    ```

- **`client.media.getNowPlaying( [page] )`**

  - Получает список актуальных медиа (в прокате/эфире).
  - Возвращает: `Promise<PaginatedMediaResult>` (смешанный список `Movie | TVShow`).
  - ```typescript
    client.media
      .getNowPlaying()
      .then((data) => console.log("Сейчас актуально:", data.items));
    ```

- **`client.media.getNowPlayingMovies( [page] )`**

  - Получает список только актуальных фильмов.
  - Возвращает: `Promise<PaginatedMovieResult>` (список `Movie`).
  - ```typescript
    client.media
      .getNowPlayingMovies()
      .then((data) => console.log("Фильмы в прокате:", data.items));
    ```

- **`client.media.getCurrentYearTvShows( [page] )`**

  - Получает список **новинок** (сериалов, выходящих или вышедших в **текущем** году).
  - Автоматически определяет текущий год для запроса (используется параметр `airdate` в API).
  - Возвращает: `Promise<PaginatedTVShowResult>` (список `TVShow`).
  - ```typescript
    // Получить новинки сериалов текущего года
    client.media.getCurrentYearTvShows().then((data) => {
      console.log(`Сериалы ${new Date().getFullYear()} года:`, data.items);
    });
    ```

- **`client.media.getPopularMovies( [page] )`**

  - Получает список ТОЛЬКО популярных фильмов (сортировка 'top' в API).
  - Возвращает: `Promise<PaginatedMovieResult>` (список `Movie`).
  - ```typescript
    // Получить первую страницу популярных фильмов
    client.media
      .getPopularMovies()
      .then((data) => console.log("Популярные фильмы:", data.items));
    // Получить третью страницу
    client.media.getPopularMovies(3).then((data) => console.log(data.items));
    ```

- **`client.media.getPopularTVShows( [page] )`**

  - Получает список ТОЛЬКО популярных сериалов (сортировка 'top' в API).
  - Возвращает: `Promise<PaginatedTVShowResult>` (список `TVShow`).
  - ```typescript
    // Получить первую страницу популярных сериалов
    client.media
      .getPopularTVShows()
      .then((data) => console.log("Популярные сериалы:", data.items));
    // Получить вторую страницу
    client.media.getPopularTVShows(2).then((data) => console.log(data.items));
    ```

- **`client.media.getCurrentYearMovies( [page] )`**

  - Получает список **новинок** (фильмов, выходящих или вышедших в **текущем** году).
  - Автоматически определяет текущий год для запроса (используется параметр `airdate` в API).
  - Возвращает: `Promise<PaginatedMovieResult>` (список `Movie`).
  - ```typescript
    client.media
      .getCurrentYearMovies()
      .then((data) =>
        console.log(`Фильмы ${new Date().getFullYear()} года:`, data.items)
      );
    // Получить вторую страницу фильмов текущего года
    client.media
      .getCurrentYearMovies(2)
      .then((data) => console.log("Фильмы текущего года (стр 2):", data.items));
    ```

## Поиск Медиа

- **`client.media.searchMovies( query, [page] )`**

  - Ищет фильмы по текстовому запросу `query`.
  - Возвращает: `Promise<PaginatedMovieResult>` (список `Movie`).
  - ```typescript
    client.media
      .searchMovies("Интерстеллар")
      .then((data) => console.log("Результаты поиска фильмов:", data.items));
    ```

- **`client.media.searchTVShows( query, [page] )`**
  - Ищет сериалы по текстовому запросу `query`.
  - Возвращает: `Promise<PaginatedTVShowResult>` (список `TVShow`).
  - ```typescript
    client.media
      .searchTVShows("Очень странные дела")
      .then((data) => console.log("Результаты поиска сериалов:", data.items));
    ```

## Получение Деталей

- **`client.media.getMovieDetails( movieId, [options] )`**

  - Получает детальную информацию о фильме по его `movieId`.
  - `options`: `{ language?: string, appendToResponse?: string[] }`.
  - Возвращает: `Promise<Movie>`.
  - ```typescript
    // Получить детали фильма "Бойцовский клуб" (ID 550) на русском с кредитами
    client.media
      .getMovieDetails(550, { language: "ru", appendToResponse: ["credits"] })
      .then((movie) =>
        console.log(`Фильм: ${movie.title}`, movie.getDirectors())
      );
    ```

- **`client.media.getTVShowDetails( tvShowId, [options] )`**

  - Получает детальную информацию о сериале по его `tvShowId`.
  - `options`: `{ language?: string, appendToResponse?: string[] }`.
  - Возвращает: `Promise<TVShow>`.
  - ```typescript
    // Получить детали сериала "Игра Престолов" (ID 1399) с видео
    client.media
      .getTVShowDetails(1399, { appendToResponse: ["videos"] })
      .then((tvShow) => console.log(`Сериал: ${tvShow.name}`, tvShow.videos));
    ```

- **`client.media.getCollectionDetails( collectionId, [options] )`**

  - Получает детали коллекции фильмов по её `collectionId`.
  - `options`: `{ language?: string }`. Параметр `appendToResponse` здесь не используется, так как основной запрос коллекции уже включает базовую информацию о её частях (фильмах).
  - Возвращает: `Promise<Collection>`.
  - ```typescript
    // Получить детали коллекции "Расплата" (ID 870339) на русском
    client.media
      .getCollectionDetails(870339, { language: "ru" })
      .then((collection) => {
        console.log(`Коллекция: ${collection.name}`);
        console.log(`Количество частей: ${collection.parts.length}`);
        collection.parts.forEach((movie) => {
          console.log(
            ` - ${movie.title} (${movie.releaseDate?.substring(0, 4)})`
          );
        });
      });
    ```

- **`client.media.discoverMoviesByKeyword( keywordIds, [options] )`**

  - Находит фильмы, связанные с указанным ключевым словом (или несколькими).
  - `keywordIds`: ID ключевого слова (`number`) или массив ID (`number[]`).
  - `options`: `{ page?: number, language?: string, operator?: 'AND' | 'OR' }`.
    - `page`: Номер страницы результатов (по умолчанию `1`).
    - `language`: Код языка для локализации результатов (по умолчанию английский).
    - `operator`: Определяет логику объединения нескольких ID ключевых слов:
      - `'AND'` (по умолчанию): Фильмы должны содержать **ВСЕ** указанные ключевые слова (ID объединяются через запятую).
      - `'OR'`: Фильмы должны содержать **ХОТЯ БЫ ОДНО** из указанных ключевых слов (ID объединяются через вертикальную черту `|`).
  - Возвращает: `Promise<PaginatedMovieResult>` (список `Movie`).
  - **Использование в UI**: Идеально подходит для создания фильтров по категориям или тематикам фильмов. Получив список ключевых слов из детального представления фильма, вы можете дать пользователям возможность исследовать похожие фильмы.
  - **Расширение результатов**: Для получения полных деталей фильмов из списка можно выполнить дополнительный запрос `getMovieDetails` с параметром `appendToResponse`.
  - ```typescript
    // Базовое использование - найти фильмы по одному ключевому слову
    client.media
      .discoverMoviesByKeyword(703, { language: "ru" })
      .then((result) => {
        console.log(`Найдено ${result.totalResults} фильмов о коррупции`);
        // Обработка списка фильмов
        result.items.forEach((movie) => {
          console.log(`${movie.title} (${movie.releaseDate?.substring(0, 4)})`);
        });
      });

    // Поиск фильмов соответствующих ВСЕМ указанным ключевым словам
    // Например: научно-фантастические фильмы про инопланетян
    client.media
      .discoverMoviesByKeyword([878, 9663], { operator: "AND" })
      .then((data) => {
        // Более строгий фильтр - меньше результатов
        console.log(`Найдено ${data.totalResults} фильмов`);
      });

    // Поиск фильмов соответствующих ЛЮБОМУ из указанных ключевых слов
    // Например: фильмы основанные на книгах ИЛИ с антиутопическим сюжетом
    client.media
      .discoverMoviesByKeyword([818, 3133], { operator: "OR", page: 2 })
      .then((data) => {
        // Более широкий фильтр - больше результатов
        console.log(`Страница ${data.page} из ${data.totalPages}`);
      });

    // Пример обогащения результатов дополнительными данными
    async function getDetailedMoviesByKeyword(keywordId) {
      // Сначала получаем список фильмов по ключевому слову
      const result = await client.media.discoverMoviesByKeyword(keywordId, {
        language: "ru",
      });

      // Затем для первых трех фильмов загружаем полные детали с трейлерами
      const detailedMovies = await Promise.all(
        result.items.slice(0, 3).map((movie) =>
          client.media.getMovieDetails(movie.id, {
            language: "ru",
            appendToResponse: ["videos", "credits", "keywords"],
          })
        )
      );

      return {
        totalFound: result.totalResults,
        detailedItems: detailedMovies,
      };
    }
    ```

  - **Примеры использования в React-компонентах:**

    ```jsx
    // Пример 1: Компонент для отображения списка фильмов по ключевому слову
    import React, { useState, useEffect } from "react";
    import { createTMDBProxyClient } from "tmdb-xhzloba";

    // Компонент списка фильмов по ключевому слову
    const KeywordMoviesList = ({ keywordId, keywordName }) => {
      const [movies, setMovies] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [page, setPage] = useState(1);
      const [totalPages, setTotalPages] = useState(0);

      // Инициализация клиента
      const client = createTMDBProxyClient("YOUR_API_KEY");

      useEffect(() => {
        const fetchMovies = async () => {
          setLoading(true);
          try {
            const result = await client.media.discoverMoviesByKeyword(
              keywordId,
              {
                language: "ru",
                page: page,
              }
            );

            setMovies(result.items);
            setTotalPages(result.totalPages);
            setLoading(false);
          } catch (err) {
            setError("Не удалось загрузить фильмы");
            setLoading(false);
            console.error(err);
          }
        };

        fetchMovies();
      }, [keywordId, page]);

      const handleNextPage = () => {
        if (page < totalPages) {
          setPage((prevPage) => prevPage + 1);
        }
      };

      const handlePrevPage = () => {
        if (page > 1) {
          setPage((prevPage) => prevPage - 1);
        }
      };

      if (loading) return <div>Загрузка фильмов...</div>;
      if (error) return <div>{error}</div>;

      return (
        <div className="keyword-movies">
          <h2>Фильмы по теме: {keywordName}</h2>

          <div className="movies-grid">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <img
                  src={movie.getPosterUrl("w200")}
                  alt={`Постер ${movie.title}`}
                />
                <h3>{movie.title}</h3>
                <p>{movie.releaseDate?.substring(0, 4) || "Нет даты"}</p>
                <p className="rating">★ {movie.voteAverage.toFixed(1)}</p>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button onClick={handlePrevPage} disabled={page === 1}>
              Назад
            </button>
            <span>
              Страница {page} из {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={page === totalPages}>
              Вперед
            </button>
          </div>
        </div>
      );
    };

    // Пример 2: Детальная страница фильма с похожими фильмами на основе ключевых слов
    const MovieDetails = ({ movieId }) => {
      const [movie, setMovie] = useState(null);
      const [relatedMovies, setRelatedMovies] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      const client = createTMDBProxyClient("YOUR_API_KEY");

      useEffect(() => {
        const fetchMovieDetails = async () => {
          setLoading(true);
          try {
            // Загружаем детали фильма со всеми дополнительными данными
            const movieDetails = await client.media.getMovieDetails(movieId, {
              language: "ru",
              appendToResponse: ["credits", "videos", "keywords"],
            });

            setMovie(movieDetails);

            // Если у фильма есть ключевые слова, загружаем связанные фильмы
            if (movieDetails.keywords?.keywords?.length > 0) {
              // Берем первые 2 ключевых слова
              const keywordIds = movieDetails.keywords.keywords
                .slice(0, 2)
                .map((kw) => kw.id);

              // Ищем фильмы с теми же ключевыми словами
              const relatedResult = await client.media.discoverMoviesByKeyword(
                keywordIds,
                {
                  language: "ru",
                  operator: "OR", // Фильмы с любым из этих ключевых слов
                }
              );

              // Фильтруем, чтобы исключить текущий фильм из результатов
              const filteredMovies = relatedResult.items
                .filter((relatedMovie) => relatedMovie.id !== movieId)
                .slice(0, 6); // Берем только первые 6 результатов

              setRelatedMovies(filteredMovies);
            }

            setLoading(false);
          } catch (err) {
            setError("Ошибка при загрузке информации о фильме");
            setLoading(false);
            console.error(err);
          }
        };

        fetchMovieDetails();
      }, [movieId]);

      if (loading) return <div>Загрузка информации о фильме...</div>;
      if (error) return <div>{error}</div>;
      if (!movie) return <div>Фильм не найден</div>;

      // Выбираем трейлер, если есть
      const trailer = movie.videos?.results?.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );

      // Получаем список режиссеров
      const directors =
        movie.credits?.crew?.filter((person) => person.job === "Director") ||
        [];

      // Получаем список ключевых слов
      const keywords = movie.keywords?.keywords || [];

      return (
        <div className="movie-details">
          <div className="movie-header">
            <img
              src={movie.getPosterUrl("w300")}
              alt={`Постер ${movie.title}`}
              className="movie-poster"
            />

            <div className="movie-info">
              <h1>
                {movie.title}{" "}
                <span>({movie.releaseDate?.substring(0, 4)})</span>
              </h1>
              <p className="tagline">{movie.tagline}</p>

              <div className="rating">★ {movie.voteAverage.toFixed(1)}</div>

              <p className="overview">{movie.overview}</p>

              {directors.length > 0 && (
                <div className="directors">
                  <h3>Режиссер{directors.length > 1 ? "ы" : ""}:</h3>
                  <p>{directors.map((d) => d.name).join(", ")}</p>
                </div>
              )}

              {keywords.length > 0 && (
                <div className="keywords">
                  <h3>Ключевые слова:</h3>
                  <div className="keywords-list">
                    {keywords.map((keyword) => (
                      <span key={keyword.id} className="keyword">
                        {keyword.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {trailer && (
                <div className="trailer">
                  <h3>Трейлер:</h3>
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={`${movie.title} - трейлер`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          </div>

          {relatedMovies.length > 0 && (
            <div className="related-movies">
              <h2>Похожие фильмы по темам</h2>
              <div className="related-movies-grid">
                {relatedMovies.map((relatedMovie) => (
                  <div key={relatedMovie.id} className="related-movie-card">
                    <img
                      src={relatedMovie.getPosterUrl("w200")}
                      alt={`Постер ${relatedMovie.title}`}
                    />
                    <h3>{relatedMovie.title}</h3>
                    <p>
                      {relatedMovie.releaseDate?.substring(0, 4) || "Нет даты"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    };
    ```

## Опция `appendToResponse`

При запросе деталей с помощью `getMovieDetails` или `getTVShowDetails`, вы можете указать массив строк `appendToResponse` для получения дополнительных данных в одном запросе. Это позволяет получить доступ к соответствующим полям в объекте `Movie` или `TVShow`.

**Доступные значения (через запятую в URL, как массив строк в библиотеке):**

- **Общие для Movie и TVShow:**

  - `credits`: Актерский состав (`cast`) и съемочная группа (`crew`).
  - `images`: Изображения (постеры `posters`, фоны `backdrops`, логотипы `logos`).
  - `videos`: Видео (трейлеры, тизеры и т.д.).
  - `keywords`: Ключевые слова (теги), связанные с медиа.
  - `recommendations`: Список рекомендованных похожих фильмов/сериалов.
  - `similar`: Список похожих фильмов/сериалов (может отличаться от `recommendations`).
  - `reviews`: Пользовательские обзоры.
  - `external_ids`: Идентификаторы на внешних ресурсах (IMDb, Wikidata, TVDB и т.д.).
  - `watch/providers`: Информация о доступности на стриминговых сервисах и платформах для покупки/аренды (по странам).
  - `alternative_titles`: Альтернативные названия (часто по странам).
  - `translations`: Переводы основной информации (название, описание) на разные языки.

- **Только для Movie:**

  - `release_dates`: Даты релизов и связанные с ними сертификаты (возрастные рейтинги) по странам.

- **Только для TVShow:**
  - `content_ratings`: Возрастные рейтинги контента по странам.
  - `aggregate_credits`: Объединенный список актеров и команды за все сезоны.
  - `episode_groups`: Информация об альтернативных группировках эпизодов (например, для DVD-релизов).
  - `screened_theatrically`: Информация о показах сериала в кинотеатрах (если были).

**Примечание:** Доступность и полнота данных для каждого значения `appendToResponse`
