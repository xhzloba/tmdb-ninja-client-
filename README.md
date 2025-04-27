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

### `createNinjaClient(baseURL?: string)`

- Фабричная функция для создания экземпляра клиента.
- `baseURL` (опционально): Строка с базовым URL API. По умолчанию `https://tmdb.kurwa-bober.ninja/`.
- Возвращает объект:
  - `media`: Экземпляр `MediaService` для работы с фильмами и сериалами.

### `client.media` (Экземпляр `MediaService`)

- `getNowPlaying(page?: number): Promise<PaginatedMediaResult>`: Получает смешанный список фильмов и сериалов ("Сейчас смотрят") с пагинацией.
- `getNowPlayingMovies(page?: number): Promise<PaginatedMovieResult>`: Получает список только фильмов ("Сейчас смотрят") с пагинацией.
- `getPopular(page?: number): Promise<PaginatedMediaResult>`: Получает смешанный список популярных фильмов и сериалов (сортировка API 'top'), с пагинацией.
- `getPopularMovies(page?: number): Promise<PaginatedMovieResult>`: Получает список только популярных фильмов (сортировка API 'top'), с пагинацией.
- `getPopularTVShows(page?: number): Promise<PaginatedTVShowResult>`: Получает список только популярных сериалов (сортировка API 'top'), с пагинацией.
- _(В будущем здесь могут появиться другие методы: `search`, `getDetails` и т.д.)_

### `ImageConfig`

- `setBaseUrl(baseUrl: string)`: Устанавливает базовый URL для изображений.

### Типы

- `PaginatedMediaResult`: Интерфейс для ответа с пагинацией (смешанный контент).
  - `items: (Movie | TVShow)[]`
  - `page: number`
  - `totalPages: number`
  - `totalResults: number`
- `PaginatedMovieResult`: Интерфейс для ответа с пагинацией (только фильмы).
  - `items: Movie[]`
  - `page: number`
  - `totalPages: number`
  - `totalResults: number`
- `PaginatedTVShowResult`: Интерфейс для ответа с пагинацией (только сериалы).
  - `items: TVShow[]`
  - `page: number`
  - `totalPages: number`
  - `totalResults: number`

### Ошибки

- `ApiError`: Класс для обработки ошибок API.
  - `statusCode?: number`: Код статуса ответа API.
  - `message: string`: Сообщение об ошибке.
  - `apiMessage?: string`: Сообщение от сервера (если доступно).
