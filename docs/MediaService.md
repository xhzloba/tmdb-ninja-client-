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

- **`client.media.getNowPlayingTvShows( [page] )`**
  - Получает список только актуальных сериалов.
  - Возвращает: `Promise<PaginatedTVShowResult>` (список `TVShow`).
  - ```typescript
    client.media
      .getNowPlayingTvShows()
      .then((data) => console.log("Сериалы в эфире:", data.items));
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

## Опция `appendToResponse`

При запросе деталей с помощью `getMovieDetails` или `getTVShowDetails`, вы можете указать массив строк `appendToResponse` для получения дополнительных данных в одном запросе. Это позволяет получить доступ к соответствующим полям в объекте `Movie` или `TVShow`.

**Доступные значения:**

- `'credits'`: Актерский состав (`cast`) и съемочная группа (`crew`). Доступно через `movie.credits` или `tvShow.credits`.
- `'videos'`: Трейлеры и другие видео. Доступно через `movie.videos` или `tvShow.videos`.
- `'images'`: Дополнительные изображения (постеры, фоны, логотипы). Доступно через `movie.images` или `tvShow.images`.
- `'keywords'`: Ключевые слова (теги). Доступно через `movie.keywords` или `tvShow.keywords`.
- `'recommendations'`: Рекомендованные фильмы/сериалы. Доступно через `movie.recommendations` или `tvShow.recommendations`.
- `'similar'`: Похожие фильмы/сериалы. Доступно через `movie.similar` или `tvShow.similar`.
- `'reviews'`: Обзоры зрителей. Доступно через `movie.reviews` или `tvShow.reviews`.
- `'external_ids'`: ID на внешних ресурсах (IMDb, Wikidata и т.д.). Доступно через `movie.externalIds` или `tvShow.externalIds`.
- `'watch/providers'`: Информация о провайдерах для просмотра онлайн. Доступно через `movie.watchProviders` или `tvShow.watchProviders`.
- `'content_ratings'` (для TV): Возрастные рейтинги контента.
- `'alternative_titles'` (для TV): Альтернативные названия.
- `'release_dates'` (для Movie): Даты релизов в разных странах.

**Пример:**

```typescript
client.media
  .getMovieDetails(550, {
    language: "ru",
    appendToResponse: ["credits", "videos", "keywords"],
  })
  .then((movie) => {
    console.log("Режиссеры:", movie.getDirectors());
    console.log("Трейлеры:", movie.videos?.results);
    console.log(
      "Ключевые слова:",
      movie.keywords?.keywords?.map((k) => k.name)
    );
  });
```

## Классы `Movie` и `TVShow`

Результаты методов возвращаются в виде экземпляров классов `Movie` или `TVShow`. Они содержат все поля, полученные от API, а также предоставляют удобные геттеры и методы.

**Общие Поля и Методы (доступны у обоих классов):**

- `id`: `number` - Уникальный ID.
- `overview`: `string | null` - Описание.
- `popularity`: `number` - Рейтинг популярности.
- `voteAverage`: `number` - Средняя оценка (0-10).
- `voteCount`: `number` - Количество голосов.
- `posterPath`: `string | null` - Часть URL постера.
- `backdropPath`: `string | null` - Часть URL фона.
- `adult`: `boolean` - Контент для взрослых?
- `originalLanguage`: `string` - Оригинальный язык (код).
- `genres`: `Genre[] | null` - Массив жанров (требует `getDetails`).
- `status`: `string | null` - Статус ('Released', 'Ended', 'In Production'...). (требует `getDetails`).
- `getPosterUrl(size?)`: Возвращает полный URL постера указанного `size` (e.g., 'w185', 'w500').
  - ```typescript
    const poster = movie.getPosterUrl("w500"); // => "https://imagetmdb.com/t/p/w500/...jpg"
    ```
- `getBackdropUrl(size?)`: Возвращает полный URL фона указанного `size` (e.g., 'w780', 'w1280').
  - ```typescript
    const backdrop = tvShow.getBackdropUrl("w1280");
    ```
- `getDirectors()`: Возвращает массив режиссеров (требует `credits`).
  - ```typescript
    const directors = movie.getDirectors(); // => [{ id: ..., name: '...' }, ...]
    ```
- `getCast()`: Возвращает массив актеров (`cast`) (требует `credits`).
  - ```typescript
    const cast = movie.getCast().slice(0, 5); // Первые 5 актеров
    ```
- `getCrewByDepartment(department)`: Возвращает членов команды из указанного `department` (требует `credits`).
  - ```typescript
    const writers = movie.getCrewByDepartment("Writing");
    ```

**Поля и Методы `Movie`:**

- `title`: `string` - Название.
- `originalTitle`: `string` - Оригинальное название.
- `releaseDate`: `string | null` - Дата выхода (YYYY-MM-DD).
- `runtime`: `number | null` - Длительность в минутах (требует `getDetails`).
- `tagline`: `string | null` - Слоган (требует `getDetails`).
- `getFormattedReleaseDate(locale?)`: Возвращает дату выхода в локализованном формате.
  - ```typescript
    const dateRu = movie.getFormattedReleaseDate("ru-RU"); // => "1 марта 2022 г."
    const dateEn = movie.getFormattedReleaseDate("en-US"); // => "Mar 1, 2022"
    ```

**Поля и Методы `TVShow`:**

- `name`: `string` - Название.
- `originalName`: `string` - Оригинальное название.
- `firstAirDate`: `string | null` - Дата первой серии (YYYY-MM-DD).
- `numberOfSeasons`: `number | null` - Количество сезонов (требует `getDetails`).
- `numberOfEpisodes`: `number | null` - Количество эпизодов (требует `getDetails`).
- `seasons`: `Season[] | null` - Массив сезонов (требует `getDetails`).
- `getFormattedFirstAirDate(locale?)`: Возвращает дату первой серии в локализованном формате.
  - ```typescript
    const dateRu = tvShow.getFormattedFirstAirDate("ru-RU");
    ```

Для получения полного списка полей смотрите исходные типы (`DetailedMovie` и `DetailedTVShow` в `src/types/media.ts`) или используйте `JSON.stringify()` для просмотра всего объекта.
