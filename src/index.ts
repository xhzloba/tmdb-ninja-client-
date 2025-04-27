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

// Экспортируем типы пагинации и опций из сервиса
export type {
  PaginatedMediaResult,
  PaginatedMovieResult,
  PaginatedTVShowResult,
  MediaDetailsOptions,
} from "./services/MediaService";

// Экспортируем типы сущностей и деталей из types
export type {
  Genre,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
  ReleaseDate,
  CountryReleaseDates,
  ReleaseDatesResponse,
  Keyword,
  KeywordsResponse,
  AlternativeTitle,
  AlternativeTitlesResponse,
  Episode,
  Season,
  ContentRating,
  ContentRatingsResponse,
} from "./types";

// Экспортируем класс ошибки
export { ApiError } from "./core/ApiClient";

// --- Фабричная функция для создания клиента ---

const DEFAULT_API_URL = "https://tmdb.kurwa-bober.ninja/";

/**
 * Создает и конфигурирует клиент для взаимодействия с Ninja TMDB API.
 * Это рекомендуемый способ инициализации библиотеки.
 *
 * @param baseURL - Необязательный параметр. Базовый URL API. По умолчанию используется 'https://tmdb.kurwa-bober.ninja/'.
 * @param apiKey - API ключ для доступа к API.
 * @returns Объект, содержащий готовые к использованию сервисы (например, `media`).
 */
export function createNinjaClient(
  baseURL: string = DEFAULT_API_URL,
  apiKey: string
) {
  // Комментарий для "себя": Внутреннее создание зависимостей.
  // Пользователю не нужно знать про ApiClient.
  // Проверяем, что ключ не пустой
  if (!apiKey) {
    throw new Error("API key must be provided to createNinjaClient.");
  }
  const apiClient = new ApiClient(baseURL, apiKey);
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
