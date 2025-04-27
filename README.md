# xhzloba TMDB Proxy Client

Типизированная клиентская библиотека на TypeScript для взаимодействия с прокси-API TMDB Предоставляет классы-сущности (Movie, TVShow), методы для получения списков (Now Playing, Popular) с пагинацией и утилиты для работы с URL изображений.

## Возможности

- Получение списков популярных, "сейчас смотрят" фильмов и сериалов с пагинацией.
- Получение детальной информации о фильмах и сериалах с возможностью запроса дополнительных данных (`appendToResponse`).
- Типизированные классы `Movie` и `TVShow` с удобными геттерами и методами.
- Вспомогательный класс `ImageConfig` для работы с URL изображений.
- Обработка кастомных полей, добавляемых прокси (`kinopoiskId`, `kpRating`, `releaseQuality` и т.д.), даже если они приходят в `camelCase`.
- Обработка ошибок API с кастомным классом `ApiError`.
- Поддержка UMD и ESM модулей для использования в различных окружениях.

## Установка

```bash
npm install tmdb-xhzloba
# или
yarn add tmdb-xhzloba
```

## Начало Работы (Пример с ESM)

```typescript
import { createXhZlobaClient, ApiError, Movie, TVShow } from "tmdb-xhzloba";

const API_KEY = "YOUR_TMDB_API_KEY"; // Твой API ключ

// Создаем клиент (URL прокси используется по умолчанию)
const client = createXhZlobaClient(API_KEY);

async function fetchMedia() {
  try {
    // Получаем популярные фильмы и сериалы (первая страница)
    const popularMedia = await client.media.getPopular(1);

    console.log(`Всего найдено: ${popularMedia.totalResults}`);

    popularMedia.items.forEach((item) => {
      if (item instanceof Movie) {
        console.log(
          `- [Фильм] ${item.title} (${item.releaseDate?.substring(0, 4)})`
        );
      } else if (item instanceof TVShow) {
        console.log(
          `- [Сериал] ${item.name} (${item.firstAirDate?.substring(0, 4)})`
        );
      }
      // Доступ к данным прокси:
      console.log(
        `  KP ID: ${item.kinopoiskId || "N/A"}, Рейтинг: ${
          item.kpRating || "N/A"
        }`
      );
      // Получаем URL постера
      console.log(`  Постер (w342): ${item.getPosterUrl("w342")}`);
    });

    // Получаем детали конкретного фильма
    const movieId = 414906; // Пример ID
    const movieDetails = await client.media.getMovieDetails(movieId, {
      language: "ru",
      appendToResponse: ["credits", "videos", "images"],
    });

    console.log(`\nДетали фильма: ${movieDetails.title}`);
    console.log(
      `Режиссеры: ${movieDetails
        .getDirectors()
        .map((d) => d.name)
        .join(", ")}`
    );
    const logo =
      movieDetails.images?.logos?.find((l) => l.iso_639_1 === "ru") ||
      movieDetails.images?.logos?.[0];
    if (logo) {
      console.log(
        `Лого URL: ${movieDetails.getLogoUrl(logo.file_path, "w154")}`
      );
    }
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(
        `Ошибка API (${error.statusCode || "N/A"}): ${error.message}`
      );
    } else {
      console.error("Произошла неожиданная ошибка:", error);
    }
  }
}

fetchMedia();
```

## Использование в Браузере

Библиотеку можно использовать напрямую в браузере двумя способами:

### 1. UMD через `<script>`

Подключите UMD-бандл (например, из папки `dist` или CDN) и обращайтесь к библиотеке через глобальный объект `window.tmdbXhzloba`.

```html
<script src="путь/к/dist/tmdb-xhzloba.umd.js"></script>
<script>
  if (window.tmdbXhzloba) {
    const { createXhZlobaClient, ApiError, Movie, TVShow } = window.tmdbXhzloba;

    const API_KEY = "YOUR_API_KEY";
    const client = createXhZlobaClient(API_KEY); // URL по умолчанию

    client.media
      .getPopular(1)
      .then((data) => {
        console.log("Популярные медиа (UMD):", data.items);
        data.items.forEach((item) => {
          // Проверяем тип и выводим данные
          if (item instanceof Movie) {
            console.log(`Фильм: ${item.title}`);
          } else if (item instanceof TVShow) {
            console.log(`Сериал: ${item.name}`);
          }
          console.log(`  KP ID: ${item.kinopoiskId}`); // Доступ к полям прокси
        });
      })
      .catch((error) => {
        if (error instanceof ApiError)
          console.error("API Error:", error.message);
        else console.error("Error:", error);
      });
  } else {
    console.error("Библиотека tmdbXhzloba не загружена!");
  }
</script>
```

_(Смотрите `examples/vanilla-js-example.js` для более полного примера)_

### 2. ESM через `<script type="module">`

Используйте нативные ES-модули браузера для импорта из ESM-бандла. Прямая ссылка на последнюю версию:
`https://unpkg.com/tmdb-xhzloba@latest/dist/index.esm.js`

```html
<script type="module">
  // Импорт из CDN (замените @latest на конкретную версию для стабильности)
  import {
    createXhZlobaClient,
    ApiError,
    Movie,
    TVShow,
  } from "https://unpkg.com/tmdb-xhzloba@latest/dist/index.esm.js";

  const API_KEY = "YOUR_API_KEY";
  const client = createXhZlobaClient(API_KEY); // URL по умолчанию

  async function loadPopular() {
    try {
      const popular = await client.media.getPopular(1);
      console.log("Популярные медиа (ESM):", popular.items);
      // ... дальнейшая обработка ...
    } catch (error) {
      if (error instanceof ApiError) console.error("API Error:", error.message);
      else console.error("Error:", error);
    }
  }
  loadPopular();
</script>
```

_(Смотрите `examples/vanilla-esm-example.html` для более полного примера)_

## Конфигурация

#### `createXhZlobaClient(apiKey: string, baseURL?: string)`

- `apiKey`: (Обязательный) Твой API ключ для доступа к TMDB (или к твоему прокси).
- `baseURL`: (Необязательный) Базовый URL твоего прокси API. **По умолчанию используется `'https://tmdb.kurwa-bober.ninja/'`**.
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

- **`getPopular(page: number): Promise<PaginatedMediaResult>`**

  - Получает СМЕШАННЫЙ список популярных фильмов и сериалов (сортировка `top` в API).
  - `page`: Номер страницы (начиная с 1).
  - Возвращает `PaginatedMediaResult`, содержащий:
    - `items`: Массив экземпляров `Movie` или `TVShow`.
    - `page`, `totalPages`, `totalResults`.

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

## Сущности Медиа (`MediaItem`, `Movie`, `TVShow`)

Экземпляры этих классов возвращаются методами сервиса. Они предоставляют удобный доступ к данным через геттеры и методы.

#### Общие Поля и Методы (`MediaItem`)

- `id: number`, `overview: string`, `popularity: number`, `voteAverage: number`, `voteCount: number`, `posterPath: string | null`, `backdropPath: string | null`, `adult: boolean`, `originalLanguage: string`, `status: string`.
- **Поля прокси**: `names: string[]`, `pgRating: number`, `releaseQuality?: string`, `kinopoiskId?: string`, `kpRating?: string`, `imdbId?: string`, `imdbRating?: string`, `lastAirDate?: string` (доступны через соответствующие геттеры, например `item.kinopoiskId`). _Библиотека корректно обрабатывает эти поля, даже если прокси возвращает их в camelCase._
- **Детальные поля (если запрошены через `appendToResponse`)**: `genres: Genre[]`, `homepage: string | null`, `productionCompanies: ProductionCompany[]`, `productionCountries: ProductionCountry[]`, `spokenLanguages: SpokenLanguage[]`, `keywords: KeywordsResponse`, `alternativeTitles: AlternativeTitlesResponse`, `contentRatings: ContentRatingsResponse`, `credits: CreditsResponse`, `videos: VideosResponse`, `externalIds: ExternalIdsResponse`, `watchProviders: WatchProviderResponse`, `recommendations: RecommendationsResponse`, `similar: SimilarResponse`, `reviews: ReviewsResponse`, `images: ImagesResponse` (доступны через геттеры, например `item.genres`, `item.credits`, `item.images`).
- **Методы изображений**:
  - `getPosterUrl(size: string = 'w500'): string | null`
  - `getBackdropUrl(size: string = 'w780'): string | null`
  - `getLogoUrl(filePath: string | null, size: string = 'original'): string | null`: Формирует URL для логотипа (используйте `filePath` из `item.images.logos`).
  - `getProfileUrl(filePath: string | null, size: string = 'original'): string | null`: Формирует URL для аватара (используйте `profile_path` из `item.credits`).
- **Методы команды (требуют `appendToResponse: ['credits']`)**:
  - `getDirectors(): CrewMember[]`: Возвращает режиссеров.
  - `getCast(): CastMember[]`: Возвращает актеров.
  - `getCrewByDepartment(department: string): CrewMember[]`: Возвращает команду по департаменту (e.g., 'Writing').

#### Специфичные Поля `Movie` (в дополнение к `MediaItem`)

- `title: string`, `originalTitle: string`, `releaseDate: string`, `video: boolean`.
- **Детальные поля**: `belongsToCollection: object | null`, `budget: number`, `revenue: number`, `runtime: number | null`, `tagline: string | null`, `releaseDates: ReleaseDatesResponse` (также доступно через `item.releaseDates`).

#### Специфичные Методы `Movie`

- `getFormattedReleaseDate(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string | null`:
  - Возвращает дату релиза в локализованном, читаемом формате.
  - Использует `Intl.DateTimeFormat`. По умолчанию выводит дату в формате "день месяц год" для локали браузера.
  - Пример: `movie.getFormattedReleaseDate('ru-RU')` -> `"15 июня 2024 г."`
  - Пример: `movie.getFormattedReleaseDate('en-US', { dateStyle: 'short' })` -> `"6/15/24"`

#### Получение локализованных изображений (Постеры, Фоны, Логотипы)

Стандартные методы `getPosterUrl()` и `getBackdropUrl()` используют основные пути `poster_path` и `backdrop_path` из ответа API. TMDB обычно возвращает в этих полях оригинальное или наиболее популярное изображение, независимо от параметра `language`.

Чтобы получить доступ к **локализованным версиям** изображений (если они существуют), используйте следующий подход:

1.  **Запросите детали с `appendToResponse: ['images']`:**
    ```typescript
    const details = await client.media.getMovieDetails(movieId, {
      language: "ru",
      appendToResponse: ["images", "credits"], // Важно добавить 'images'
    });
    ```
2.  **Найдите нужное изображение в массиве `details.images`:**
    Поле `images` будет содержать массивы `posters`, `backdrops` и `logos`. Каждый объект изображения в этих массивах имеет поле `iso_639_1` с кодом языка (`'ru'`, `'en'`, `null` и т.д.).

    ```typescript
    // Ищем русский постер
    const russianPoster = details.images?.posters?.find(
      (p) => p.iso_639_1 === "ru"
    );
    const russianPosterPath = russianPoster?.file_path;

    // Ищем русский логотип
    const russianLogo = details.images?.logos?.find(
      (l) => l.iso_639_1 === "ru"
    );
    const russianLogoPath = russianLogo?.file_path;

    // Ищем "нейтральный" постер (без языка), если русского нет
    const neutralPosterPath = !russianPosterPath
      ? details.images?.posters?.find((p) => p.iso_639_1 === null)?.file_path
      : null;

    // Если не нашли специфичный, можно взять основной
    const posterPathToUse =
      russianPosterPath || neutralPosterPath || details.posterPath;
    ```

3.  **Сформируйте URL:**

    - Для логотипов: Используйте метод `getLogoUrl`, передав найденный `filePath`.
      ```typescript
      const logoUrl = details.getLogoUrl(russianLogoPath, "w154");
      ```
    - Для постеров/фонов (т.к. `getPosterUrl`/`getBackdropUrl` используют основной путь): Используйте `ImageConfig.buildImageUrl` напрямую или также методы `getPosterUrl`/`getBackdropUrl`, но передав им `filePath` в качестве _первого_ аргумента (это недокументированное поведение, лучше использовать `ImageConfig.buildImageUrl`).

      ```typescript
      import { ImageConfig } from "tmdb-xhzloba";

      const posterUrl = ImageConfig.buildImageUrl(posterPathToUse, "w500");
      ```

**Примечание для прокси `tmdb.kurwa-bober.ninja`:**
_Теоретически, этот конкретный прокси-сервер **может быть** настроен так, чтобы он самостоятельно подставлял путь к локализованному изображению в основные поля `poster_path` и `backdrop_path`, если был передан соответствующий `language` в запросе. Если прокси это делает, то вызов `details.getPosterUrl()` или `details.getBackdropUrl()` может вернуть локализованный URL. Однако, это **нестандартное поведение**, и данная библиотека на него не полагается. Стандартный и надежный способ получения локализованных версий описан выше через `appendToResponse=images`._

#### Специфичные Поля `TVShow` (в дополнение к `MediaItem`)

- `name: string`, `originalName: string`, `firstAirDate: string`.
- **Детальные поля**: `originCountry: string[]`, `numberOfEpisodes: number`, `numberOfSeasons: number`, `inProduction: boolean`, `languages: string[]`, `lastEpisodeToAir: Episode | null`, `nextEpisodeToAir: Episode | null`, `networks: ProductionCompany[]`, `type: string`, `seasons: Season[]`, `createdBy: CastMember[]`, `episodeRunTime: number[]` (доступны через геттеры).

#### Специфичные Методы `TVShow`

- `getFormattedFirstAirDate(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string | null`:
  - Возвращает дату первого эфира в локализованном, читаемом формате.
  - Аналогичен `getFormattedReleaseDate` для фильмов.
  - Пример: `tvShow.getFormattedFirstAirDate('ru-RU')` -> `"4 декабря 2011 г."`

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

// В примере для Vanilla JS / CDN:
// ...

<script>
// Проверяем доступность глобальной переменной пакета (tmdbXhzloba)
if (tmdbXhzloba) {
// Достаем функцию createXhZlobaClient из глобального объекта
const { createXhZlobaClient } = tmdbXhzloba;
const client = createXhZlobaClient('https://tmdb.kurwa-bober.ninja/', 'YOUR_API_KEY');
// ... дальше используем client ...
client.media.getPopularMovies(1).then(data => console.log(data.items));
} else {
console.error("Библиотека не загрузилась!");
}
</script>

// ... остальной код ...
