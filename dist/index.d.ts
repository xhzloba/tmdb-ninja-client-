import { MediaService } from "./services/MediaService";
export { ImageConfig } from "./config";
export { MediaItem } from "./entities/MediaItem";
export { Movie } from "./entities/Movie";
export { TVShow } from "./entities/TVShow";
export type { PaginatedMediaResult, PaginatedMovieResult, PaginatedTVShowResult, } from "./services/MediaService";
export { ApiError } from "./core/ApiClient";
/**
 * Создает и конфигурирует клиент для взаимодействия с Ninja TMDB API.
 * Это рекомендуемый способ инициализации библиотеки.
 *
 * @param baseURL - Необязательный параметр. Базовый URL API. По умолчанию используется 'https://tmdb.kurwa-bober.ninja/'.
 * @returns Объект, содержащий готовые к использованию сервисы (например, `media`).
 */
export declare function createNinjaClient(baseURL?: string): {
    /**
     * Сервис для работы с фильмами и сериалами.
     */
    media: MediaService;
};
