# Ninja TMDB API Client

Простая и типизированная клиентская библиотека на TypeScript для взаимодействия с прокси-API TMDB (`https://tmdb.kurwa-bober.ninja/`). Построена с использованием классов и инкапсуляции.

## Установка

**1. Через NPM (рекомендуется, после публикации):**

```bash
npm install tmdb-ninja-client
# или
yarn add tmdb-ninja-client
```

**2. Напрямую из Git-репозитория (например, GitHub):**

```bash
# Замените <юзернейм> и <репозиторий>
npm install git+https://github.com/<юзернейм>/<репозиторий>.git
# Или указав ветку/тег:
npm install <юзернейм>/<репозиторий>#<ветка-или-тег>

# Пример с Yarn:
yarn add <юзернейм>/<репозиторий>#<ветка-или-тег>
```

_При установке из Git, сборка проекта (`npm run build`) запустится автоматически._

**3. Из локальной папки (для локальной разработки):**

- Сначала убедитесь, что библиотека собрана (выполните `npm run build` в папке библиотеки).
- Затем в вашем проекте выполните:

```bash
# Замените /path/to/apimovies на реальный путь к папке библиотеки
npm install /path/to/apimovies

# Пример с Yarn:
yarn add file:/path/to/apimovies
```

## Быстрый старт

Основной способ использования библиотеки - через фабричную функцию `createNinjaClient`.

```typescript
import {
  createNinjaClient,
  ImageConfig,
  ApiError,
  Movie,
  TVShow,
} from "tmdb-ninja-client";

// --- Конфигурация (необязательно) ---

// 1. Установка своего базового URL для API (если отличается от дефолтного)
// const client = createNinjaClient('https://my-custom-api-proxy.com/');

// 2. Установка своего базового URL для изображений (если отличается от дефолтного)
// ImageConfig.setBaseUrl('https://my-custom-image-proxy.com/t/p/');

// --- Использование ---

// Создаем клиент (с URL API по умолчанию)
const client = createNinjaClient();

async function fetchAndLogMedia() {
  try {
    // Получаем первую страницу фильмов "Сейчас смотрят"
    const nowPlayingMovies = await client.media.getNowPlayingMovies(1);

    console.log(
      `Loaded ${nowPlayingMovies.items.length} movies (Page ${nowPlayingMovies.page}/${nowPlayingMovies.totalPages}, Total: ${nowPlayingMovies.totalResults})`
    );

    nowPlayingMovies.items.forEach((movie) => {
      // movie является экземпляром класса Movie
      console.log(`\n[${movie.id}] ${movie.title} (${movie.releaseDate})`);
      console.log(`  Rating: ${movie.voteAverage} (${movie.voteCount} votes)`);
      console.log(`  Overview: ${movie.overview.substring(0, 100)}...`);

      // Получаем URL постера (размер по умолчанию 'w500')
      const poster = movie.getPosterUrl();
      // Получаем URL постера другого размера
      const smallPoster = movie.getPosterUrl("w185");
      console.log(`  Poster (w185): ${smallPoster}`);

      // Получаем URL бэкдропа (размер по умолчанию 'original')
      const backdrop = movie.getBackdropUrl();
      console.log(`  Backdrop: ${backdrop}`);
    });

    // Получаем первую страницу смешанного контента (фильмы и сериалы) "Сейчас смотрят"
    const nowPlayingMixed = await client.media.getNowPlaying(1);
    console.log("\n--- Mixed Now Playing ---");
    nowPlayingMixed.items.forEach((item) => {
      if (item instanceof Movie) {
        console.log(` [Movie] ${item.title}`);
      } else if (item instanceof TVShow) {
        console.log(` [TV Show] ${item.name}`);
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      // Обработка ошибок API
      console.error(
        `API Error (${error.statusCode || "N/A"}): ${error.message}`
      );
      if (error.apiMessage) {
        console.error(`  -> Server message: ${error.apiMessage}`);
      }
    } else {
      // Обработка других ошибок (например, сетевых)
      console.error("An unexpected error occurred:", error);
    }
  }
}

fetchAndLogMedia();
```

## API

### Фабричная функция `createNinjaClient`

```typescript
createNinjaClient(baseURL?: string): { media: MediaService /*, ... potentially others */ }
```

- **Назначение:** Основной способ инициализации библиотеки.
- **Параметры:**
  - `baseURL` (опционально, `string`): Базовый URL API. По умолчанию: `https://tmdb.kurwa-bober.ninja/`.
- **Возвращает:** Объект с инстансами сервисов. На данный момент содержит только `media`.

### Сервис `client.media` (Экземпляр `MediaService`)

Этот сервис отвечает за получение списков фильмов и сериалов.

- **`getPopular(page?: number): Promise<PaginatedMediaResult>`**

  - **Назначение:** Получает смешанный список популярных фильмов и сериалов (сортировка API 'top').
  - **Параметры:** `page` (опционально, `number`, по умолчанию `1`) - номер запрашиваемой страницы.
  - **Возвращает:** `Promise`, который разрешается объектом `PaginatedMediaResult` (содержит `items: (Movie | TVShow)[]`, `page`, `totalPages`, `totalResults`).

- **`getPopularMovies(page?: number): Promise<PaginatedMovieResult>`**

  - **Назначение:** Получает список **только** популярных фильмов (сортировка API 'top').
  - **Параметры:** `page` (опционально, `number`, по умолчанию `1`).
  - **Возвращает:** `Promise`, который разрешается объектом `PaginatedMovieResult` (содержит `items: Movie[]`, `page`, `totalPages`, `totalResults`).

- **`getPopularTVShows(page?: number): Promise<PaginatedTVShowResult>`**

  - **Назначение:** Получает список **только** популярных сериалов (сортировка API 'top').
  - **Параметры:** `page` (опционально, `number`, по умолчанию `1`).
  - **Возвращает:** `Promise`, который разрешается объектом `PaginatedTVShowResult` (содержит `items: TVShow[]`, `page`, `totalPages`, `totalResults`).

- **`getNowPlaying(page?: number): Promise<PaginatedMediaResult>`**

  - **Назначение:** Получает смешанный список фильмов и сериалов, которые "сейчас смотрят" (сортировка API 'now_playing').
  - **Параметры:** `page` (опционально, `number`, по умолчанию `1`).
  - **Возвращает:** `Promise`, который разрешается объектом `PaginatedMediaResult`.

- **`getNowPlayingMovies(page?: number): Promise<PaginatedMovieResult>`**
  - **Назначение:** Получает список **только** фильмов, которые "сейчас смотрят" (сортировка API 'now_playing').
  - **Параметры:** `page` (опционально, `number`, по умолчанию `1`).
  - **Возвращает:** `Promise`, который разрешается объектом `PaginatedMovieResult`.

_\_(В будущем здесь могут появиться другие методы: поиск, получение деталей и т.д.)_\_

### Методы сущностей (`movie` или `tvShow`)

Экземпляры классов `Movie` и `TVShow`, которые возвращаются методами `client.media`, имеют следующие общие методы для получения URL изображений:

- **`getPosterUrl(size?: string): string | null`**

  - **Назначение:** Формирует полный URL для постера фильма или сериала.
  - **Параметры:** `size` (опционально, `string`). Строка, определяющая размер изображения (например, `'w92'`, `'w154'`, `'w185'`, `'w342'`, `'w500'`, `'w780'`, `'original'`). Список доступных размеров можно найти в документации TMDB. По умолчанию: `'w500'`.
  - **Возвращает:** Полный URL изображения (`string`) или `null`, если путь к постеру отсутствует в данных API.

- **`getBackdropUrl(size?: string): string | null`**
  - **Назначение:** Формирует полный URL для фонового изображения (backdrop).
  - **Параметры:** `size` (опционально, `string`). Строка, определяющая размер изображения (например, `'w300'`, `'w780'`, `'w1280'`, `'original'`). По умолчанию: `'original'`.
  - **Возвращает:** Полный URL изображения (`string`) или `null`, если путь к фону отсутствует.

_Помимо этих методов, у экземпляров `Movie` и `TVShow` есть геттеры для доступа ко всем полям, полученным из API (например, `movie.title`, `movie.voteAverage`, `tvShow.name`, `tvShow.numberOfSeasons`, и т.д.)._

### Конфигурация `ImageConfig`

Статический класс для настройки базового URL изображений.

- **`ImageConfig.setBaseUrl(newUrl: string): void`**
  - **Назначение:** Устанавливает новый глобальный базовый URL, который будет использоваться методами `getPosterUrl` и `getBackdropUrl`. Вызывать один раз при инициализации приложения, если стандартный URL (`https://imagetmdb.com/t/p/`) не подходит.
  - **Параметры:** `newUrl` (`string`) - новый базовый URL (должен заканчиваться на `/`).

### Типы

- **`PaginatedMediaResult`**: `{ items: (Movie | TVShow)[], page: number, totalPages: number, totalResults: number }` - Результат для смешанных списков.
- **`PaginatedMovieResult`**: `{ items: Movie[], page: number, totalPages: number, totalResults: number }` - Результат для списков фильмов.
- **`PaginatedTVShowResult`**: `{ items: TVShow[], page: number, totalPages: number, totalResults: number }` - Результат для списков сериалов.
- **`Movie`**: Класс, представляющий фильм.
- **`TVShow`**: Класс, представляющий сериал.
- **`ApiError`**: Класс ошибки API.

### Ошибки (`ApiError`)

- **Назначение:** Класс ошибки, выбрасываемый методами `MediaService` при неудачном запросе к API.
- **Свойства:**
  - `message` (`string`): Общее сообщение об ошибке.
  - `statusCode` (`number` | `undefined`): HTTP статус код ответа (если доступен).
  - `apiMessage` (`string` | `undefined`): Сообщение об ошибке из тела ответа API (если доступно).

## Сборка

_При установке из Git, сборка проекта (`npm run build`) запустится автоматически._
