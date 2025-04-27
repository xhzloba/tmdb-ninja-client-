# Документация Ninja TMDB Client

Эта библиотека предоставляет удобный интерфейс для взаимодействия с твоим прокси TMDB API (`tmdb.kurwa-bober.ninja`).

## Установка

```bash
npm install tmdb-xhzloba
# или
yarn add tmdb-xhzloba
```

## Начало Работы

Основной способ использования библиотеки — через фабричную функцию `createNinjaClient`.

```typescript
import { createNinjaClient, ApiError } from "tmdb-xhzloba";

const API_KEY = "YOUR_TMDB_API_KEY"; // Твой API ключ
const BASE_URL = "https://tmdb.kurwa-bober.ninja/"; // URL твоего прокси

// Создаем клиент
const client = createNinjaClient(BASE_URL, API_KEY);

async function fetchMovies() {
  try {
    // Получаем популярные фильмы (первая страница)
    const popularMovies = await client.media.getPopularMovies(1);

    console.log(`Всего найдено: ${popularMovies.totalResults}`);

    popularMovies.items.forEach((movie) => {
      console.log(`- ${movie.title} (${movie.releaseDate?.substring(0, 4)})`);
      // Получаем URL постера определенного размера
      console.log(`  Постер (w342): ${movie.getPosterUrl("w342")}`);
    });

    // Получаем детали конкретного фильма (Бэтмен)
    const batmanDetails = await client.media.getMovieDetails(414906, {
      language: "ru",
      appendToResponse: ["credits", "videos"], // Запрашиваем доп. данные
    });

    console.log(`\nДетали фильма: ${batmanDetails.title}`);
    console.log(`Слоган: ${batmanDetails.tagline || "Нет"}`);
    console.log(
      `Режиссеры: ${batmanDetails
        .getDirectors()
        .map((d) => d.name)
        .join(", ")}`
    );
    console.log(
      `Трейлер (YouTube): ${
        batmanDetails.videos?.results?.find(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        )?.key || "Не найден"
      }`
    );
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(
        `Ошибка API (${error.statusCode || "N/A"}): ${error.message}`
      );
      if (error.apiMessage) {
        console.error(`  Сообщение от сервера: ${error.apiMessage}`);
      }
    } else {
      console.error("Произошла неожиданная ошибка:", error);
    }
  }
}

fetchMovies();
```

## Конфигурация

#### `createNinjaClient(baseURL: string, apiKey: string)`

- `baseURL`: (Обязательный) Базовый URL твоего прокси API.
- `apiKey`: (Обязательный) Твой API ключ для доступа к TMDB (или к твоему прокси, если он требует ключ).
- **Возвращает**: Объект клиента, содержащий сервисы (сейчас только `media`).

#### `ImageConfig`

Статический класс для настройки базового URL и размеров изображений (постеров, фонов).

- `ImageConfig.setBaseUrl(url: string)`: Устанавливает базовый URL для CDN изображений (по умолчанию используется стандартный URL TMDB).
- `ImageConfig.getAvailablePosterSizes()`: Возвращает массив доступных размеров постеров (строки типа 'w92', 'w154', ...).
- `ImageConfig.getAvailableBackdropSizes()`: Возвращает массив доступных размеров фонов.
- `ImageConfig.getAvailableLogoSizes()`: Возвращает массив доступных размеров логотипов.
- `ImageConfig.getAvailableProfileSizes()`: Возвращает массив доступных размеров аватаров/профилей.

## Сервис Медиа (`client.media`)

Предоставляет методы для получения информации о фильмах и сериалах.

- **`getPopularMovies(page: number): Promise<PaginatedMovieResult>`**

  - Получает список популярных фильмов.
  - `page`: Номер страницы (начиная с 1).
  - Возвращает `PaginatedMovieResult`, содержащий:
    - `items`: Массив экземпляров класса `Movie`.
    - `page`, `totalPages`, `totalResults`: Информация о пагинации.

- **`getNowPlaying(page: number): Promise<PaginatedMediaResult>`**

  - Получает список фильмов и сериалов, которые сейчас актуальны (например, "Сейчас смотрят"). Возвращает фильмы и сериалы.
  - `page`: Номер страницы (начиная с 1).
  - Возвращает `PaginatedMediaResult`, содержащий:
    - `items`: Массив экземпляров `Movie` или `TVShow`.
    - `page`, `totalPages`, `totalResults`.

- **`getMovieDetails(movieId: number, options?: MediaDetailsOptions): Promise<Movie>`**

  - Получает детальную информацию о фильме.
  - `movieId`: ID фильма в TMDB.
  - `options`: Необязательный объект с параметрами:
    - `language`: Строка языка (например, 'ru', 'en-US').
    - `appendToResponse`: Массив строк для запроса дополнительных данных (см. ниже).
  - Возвращает экземпляр класса `Movie` со всеми доступными полями.

  **Пример использования `appendToResponse`:**

  ```typescript
  const movieWithOptions = await client.media.getMovieDetails(movieId, {
    language: "ru",
    // Запрашиваем только кредиты и видео
    appendToResponse: ["credits", "videos"],
  });
  // Теперь movieWithOptions.credits и movieWithOptions.videos будут доступны
  console.log(movieWithOptions.getDirectors());
  ```

- **`getTVShowDetails(tvShowId: number, options?: MediaDetailsOptions): Promise<TVShow>`**

  - Получает детальную информацию о сериале.
  - `tvShowId`: ID сериала в TMDB.
  - `options`: Аналогичны `getMovieDetails`.
  - Возвращает экземпляр класса `TVShow` со всеми доступными полями.

  **Пример использования `appendToResponse`:**

  ```typescript
  const tvShowWithOptions = await client.media.getTVShowDetails(tvShowId, {
    language: "en-US",
    // Запрашиваем внешние ID и ключевые слова
    appendToResponse: ["external_ids", "keywords"],
  });
  // Теперь tvShowWithOptions.externalIds и tvShowWithOptions.keywords будут доступны
  console.log(tvShowWithOptions.externalIds?.imdb_id);
  ```

- **`MediaDetailsOptions` (Тип)**
  - `language?: string`
  - `appendToResponse?: string[]`: Позволяет добавить связанные данные к основному ответу одним запросом. Возможные значения включают:
    - `'keywords'`
    - `'alternative_titles'`
    - `'content_ratings'`
    - `'release_dates'` (для фильмов)
    - `'credits'` (актеры и съемочная группа)
    - `'videos'` (трейлеры, тизеры и т.д.)
    - `'external_ids'` (ID на других платформах: IMDb, Wikidata и т.д.)
    - `'watch/providers'` (где посмотреть онлайн)
    - `'recommendations'` (рекомендуемые фильмы/сериалы)
    - `'similar'` (похожие фильмы/сериалы)
    - `'reviews'` (обзоры пользователей)
    - `'images'` (дополнительные постеры, фоны, логотипы)

## Сущности Медиа (`Movie`, `TVShow`)

Экземпляры этих классов возвращаются методами сервиса. Они предоставляют удобный доступ к данным через геттеры и методы.

#### Общие Поля и Методы (для `Movie` и `TVShow` из `MediaItem`)

- `id: number`: Уникальный ID TMDB.
- `overview: string`: Краткое описание.
- `popularity: number`: Показатель популярности.
- `voteAverage: number`: Средний рейтинг (0-10).
- `voteCount: number`: Количество голосов.
- `posterPath: string | null`: Путь к файлу постера (без базового URL).
- `backdropPath: string | null`: Путь к файлу фона (без базового URL).
- `adult: boolean`: Является ли контент для взрослых.
- `originalLanguage: string`: Оригинальный язык (код, например 'en').
- `status: string`: Текущий статус ('Released', 'Returning Series', 'Ended' и т.д.).
- `getPosterUrl(size: string = 'w500'): string | null`: Возвращает полный URL постера указанного размера (например, 'w185', 'w342', 'w500', 'original'). Размеры можно получить из `ImageConfig`.
- `getBackdropUrl(size: string = 'w780'): string | null`: Возвращает полный URL фона указанного размера (например, 'w300', 'w780', 'w1280', 'original').
- `names`, `PG`, `release_quality`, `kinopoisk_id`, `kp_rating`, `imdb_id`, `imdb_rating`, `last_air_date` (доступны через соответствующие геттеры).

#### Специфичные Поля `Movie`

- `title: string`: Название фильма (локализованное, если запрошено).
- `originalTitle: string`: Оригинальное название фильма.
- `releaseDate: string`: Дата релиза (строка 'YYYY-MM-DD').
- `video: boolean`: Связан ли с фильмом видеофайл (обычно для трейлеров на TMDB).
- `belongsToCollection: object | null | undefined`: Информация о коллекции, к которой принадлежит фильм (если есть).
- `budget: number | undefined`: Бюджет фильма (если известен).
- `revenue: number | undefined`: Сборы фильма (если известны).
- `runtime: number | null | undefined`: Продолжительность в минутах.
- `tagline: string | null | undefined`: Слоган фильма.

#### Специфичные Методы `Movie`

- `getDirectors(): CrewMember[]`: Возвращает массив режиссеров (требует `'credits'` в `appendToResponse`).
- `getCast(): CastMember[]`: Возвращает массив актеров (требует `'credits'` в `appendToResponse`).

#### Специфичные Поля `TVShow`

- `name: string`: Название сериала (локализованное).
- `originalName: string`: Оригинальное название сериала.
- `firstAirDate: string`: Дата выхода первого эпизода ('YYYY-MM-DD').
- `originCountry: string[]`: Массив кодов стран-производителей.
- `numberOfEpisodes: number | undefined`: Общее количество эпизодов.
- `numberOfSeasons: number | undefined`: Общее количество сезонов.
- `inProduction: boolean | undefined`: Находится ли сериал еще в производстве.
- `languages: string[] | undefined`: Массив кодов языков сериала.
- `lastEpisodeToAir: Episode | null | undefined`: Объект с информацией о последнем вышедшем эпизоде.
- `nextEpisodeToAir: Episode | null | undefined`: Объект с информацией о следующем эпизоде (если анонсирован).
- `networks: ProductionCompany[] | undefined`: Массив телеканалов/сетей, где выходил сериал.
- `type: string | undefined`: Тип сериала ('Scripted', 'Reality' и т.д.).
- `seasons: Season[] | undefined`: Массив объектов с информацией о сезонах (ID, название, дата выхода, количество эпизодов и т.д.).
- `createdBy: CastMember[] | undefined`: Массив создателей сериала.
- `episodeRunTime: number[] | undefined`: Массив с возможными длительностями эпизодов в минутах.

#### Поля из `appendToResponse` (Доступны через геттеры на `Movie` и `TVShow`, если запрошены)

- `genres: Genre[] | undefined`: Массив объектов жанров.
- `productionCompanies: ProductionCompany[] | undefined`: Массив компаний-производителей.
- `productionCountries: ProductionCountry[] | undefined`: Массив стран-производителей.
- `spokenLanguages: SpokenLanguage[] | undefined`: Массив языков озвучки.
- `keywords: KeywordsResponse | undefined`: Объект с массивом ключевых слов (`keywords.keywords`).
- `alternativeTitles: AlternativeTitlesResponse | undefined`: Объект с массивом альтернативных названий для разных стран (`alternativeTitles.titles`).
- `contentRatings: ContentRatingsResponse | undefined`: Объект с массивом возрастных рейтингов для разных стран (`contentRatings.results`).
- `releaseDates: ReleaseDatesResponse | undefined`: (Только для `Movie`) Объект с массивом дат релиза и сертификаций для разных стран (`releaseDates.results`).
- `credits: CreditsResponse | undefined`: Объект с массивами актеров (`credits.cast`) и съемочной группы (`credits.crew`).
- `videos: VideosResponse | undefined`: Объект с массивом видео (`videos.results`), включая трейлеры, тизеры и т.д. Содержит ключи для YouTube/Vimeo.
- `externalIds: ExternalIdsResponse | undefined`: Объект с ID на внешних ресурсах (`externalIds.imdb_id`, `externalIds.wikidata_id` и т.д.).
- `watchProviders: WatchProviderResponse | undefined`: Объект с информацией о доступности на стриминговых платформах по странам (`watchProviders.results['RU']`, `watchProviders.results['US']` и т.д.). Содержит ссылки и списки сервисов для подписки (`flatrate`), аренды (`rent`) и покупки (`buy`).
- `recommendations: RecommendationsResponse | undefined`: Объект с пагинированным списком рекомендуемых фильмов/сериалов (`recommendations.results`).
- `similar: SimilarResponse | undefined`: Объект с пагинированным списком похожих фильмов/сериалов (`similar.results`).
- `reviews: ReviewsResponse | undefined`: Объект с пагинированным списком обзоров пользователей (`reviews.results`).
- `images: ImagesResponse | undefined`: Объект с дополнительными массивами постеров (`images.posters`), фонов (`images.backdrops`) и логотипов (`images.logos`).

## Обработка Ошибок

Библиотека использует кастомный класс ошибки `ApiError`.

- `message: string`: Общее сообщение об ошибке (например, "Network request failed", "API request failed...").
- `statusCode?: number`: HTTP статус-код ответа, если ошибка произошла на стороне API (4xx, 5xx).
- `apiMessage?: string`: Сообщение об ошибке, извлеченное из тела ответа API (если доступно).

Используйте `try...catch` и проверяйте `instanceof ApiError` для корректной обработки.

```typescript
try {
  // ... вызов метода API ...
} catch (error) {
  if (error instanceof ApiError) {
    // Обработка ошибки API
  } else {
    // Обработка других ошибок
  }
}
```

## Экспортируемые Типы

Библиотека также экспортирует большинство интерфейсов TypeScript, описывающих структуры данных (например, `Genre`, `CastMember`, `CrewMember`, `Video`, `Episode`, `Season`, `PaginatedMovieResult`, `MovieMedia` и т.д.), чтобы вы могли использовать их для типизации в своем коде.
