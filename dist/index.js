"use strict";
// src/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.TVShow = exports.Movie = exports.MediaItem = exports.ImageConfig = void 0;
exports.createNinjaClient = createNinjaClient;
// Импорты для использования внутри createNinjaClient
const ApiClient_1 = require("./core/ApiClient");
const MediaService_1 = require("./services/MediaService");
// Экспортируем классы конфигурации
var config_1 = require("./config");
Object.defineProperty(exports, "ImageConfig", { enumerable: true, get: function () { return config_1.ImageConfig; } });
// Экспортируем основные классы
var MediaItem_1 = require("./entities/MediaItem");
Object.defineProperty(exports, "MediaItem", { enumerable: true, get: function () { return MediaItem_1.MediaItem; } });
var Movie_1 = require("./entities/Movie");
Object.defineProperty(exports, "Movie", { enumerable: true, get: function () { return Movie_1.Movie; } });
var TVShow_1 = require("./entities/TVShow");
Object.defineProperty(exports, "TVShow", { enumerable: true, get: function () { return TVShow_1.TVShow; } });
var ApiClient_2 = require("./core/ApiClient");
Object.defineProperty(exports, "ApiError", { enumerable: true, get: function () { return ApiClient_2.ApiError; } });
// --- Фабричная функция для создания клиента ---
const DEFAULT_API_URL = "https://tmdb.kurwa-bober.ninja/";
/**
 * Создает и конфигурирует клиент для взаимодействия с Ninja TMDB API.
 * Это рекомендуемый способ инициализации библиотеки.
 *
 * @param baseURL - Необязательный параметр. Базовый URL API. По умолчанию используется 'https://tmdb.kurwa-bober.ninja/'.
 * @returns Объект, содержащий готовые к использованию сервисы (например, `media`).
 */
function createNinjaClient(baseURL = DEFAULT_API_URL) {
    // Комментарий для "себя": Внутреннее создание зависимостей.
    // Пользователю не нужно знать про ApiClient.
    const apiClient = new ApiClient_1.ApiClient(baseURL);
    return {
        /**
         * Сервис для работы с фильмами и сериалами.
         */
        media: new MediaService_1.MediaService(apiClient),
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
