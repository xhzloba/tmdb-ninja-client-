// src/index.ts

// Импорты для использования внутри createNinjaClient
import { ApiClient } from "./core/ApiClient";
import { MediaService } from "./services/MediaService";

// Экспортируем классы конфигурации
export { ImageConfig } from "./config";

// Экспортируем основные классы (ApiClient теперь тоже экспортируется)
export { ApiClient } from "./core/ApiClient";
export { MediaItem } from "./entities/MediaItem";
export { Movie } from "./entities/Movie";
export { TVShow } from "./entities/TVShow";

// Экспортируем важные типы и интерфейсы
export type {
  PaginatedMediaResult,
  PaginatedMovieResult,
  PaginatedTVShowResult,
  // Можно добавить другие типы/интерфейсы, которые могут быть полезны пользователю
  // BaseMedia, MovieMedia, TVShowMedia, // Экспортировать ли сырые типы API - вопрос
} from "./services/MediaService"; // PaginatedMediaResult экспортируется из сервиса

export { ApiError } from "./core/ApiClient";

// --- Фабричная функция для создания клиента ---

const DEFAULT_API_URL = "https://tmdb.kurwa-bober.ninja/";

/**
 * Создает и конфигурирует клиент для взаимодействия с Ninja TMDB API.
 * Это рекомендуемый способ инициализации библиотеки.
 *
 * @param baseURL - Необязательный параметр. Базовый URL API. По умолчанию используется 'https://tmdb.kurwa-bober.ninja/'.
 * @returns Объект, содержащий готовые к использованию сервисы (например, `media`).
 */
export function createNinjaClient(baseURL: string = DEFAULT_API_URL) {
  // Комментарий для "себя": Внутреннее создание зависимостей.
  // Пользователю не нужно знать про ApiClient.
  const apiClient = new ApiClient(baseURL);
  return {
    /**
     * Сервис для работы с фильмами и сериалами.
     */
    media: new MediaService(apiClient),
    // Комментарий для "себя": Сюда можно добавить другие сервисы,
    // если библиотека будет расширяться (например, auth, genres и т.д.).
    // genres: new GenreService(apiClient),
  };
}

// Комментарий для "себя": Прямые экспорты ApiClient и MediaService оставлены
// для продвинутых сценариев или тестирования, но основной путь - createNinjaClient.

/* Пример использования:
import { createNinjaClient, ImageConfig, ApiError } from 'tmdb-ninja-client';

// Опционально: настроить URL для картинок
// ImageConfig.setBaseUrl('...');

const client = createNinjaClient(); // Используем URL по умолчанию
// const client = createNinjaClient('https://my-proxy.com/'); // Указываем свой URL

try {
    const nowPlayingMovies = await client.media.getNowPlayingMovies();
    nowPlayingMovies.items.forEach(movie => {
        console.log(`${movie.title} (${movie.releaseDate})`);
        console.log(`  Poster: ${movie.getPosterUrl('w342')}`);
    });
} catch (error) {
    if (error instanceof ApiError) {
        console.error(`API Error: ${error.message}`);
    }
}
*/
