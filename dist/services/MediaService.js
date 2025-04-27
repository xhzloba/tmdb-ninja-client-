"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MediaService_instances, _MediaService_apiClient, _MediaService_createMediaItem;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const types_1 = require("../types");
const entities_1 = require("../entities");
/**
 * Сервис для получения данных о фильмах и сериалах из API.
 * Использует ApiClient для выполнения запросов и преобразует
 * "сырые" данные API в типизированные сущности (Movie, TVShow).
 * Внутренняя реализация скрыта, наружу торчат только публичные методы.
 */
class MediaService {
    /**
     * Создает экземпляр MediaService.
     * @param apiClient - Экземпляр ApiClient для выполнения запросов.
     */
    constructor(apiClient) {
        _MediaService_instances.add(this);
        // Приватный экземпляр ApiClient, недоступный извне.
        // Инъекция зависимости через конструктор.
        _MediaService_apiClient.set(this, void 0);
        // Комментарий для "себя": Сохраняем переданный клиент.
        // Убедимся, что он не undefined.
        if (!apiClient) {
            throw new Error("ApiClient instance is required for MediaService.");
        }
        __classPrivateFieldSet(this, _MediaService_apiClient, apiClient, "f");
    }
    /**
     * Получает список фильмов и сериалов, которые "сейчас смотрят".
     * Поддерживает пагинацию.
     * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
     * @returns Промис, который разрешается объектом PaginatedMediaResult.
     * @throws {ApiError} В случае ошибки API.
     */
    async getNowPlaying(page = 1) {
        // Комментарий для "себя": Эндпоинт и параметры согласно документации/примерам.
        // Используем базовый путь '/', так как параметры sort/page идут в query.
        const endpoint = ""; // Пустой эндпоинт, т.к. базовый URL уже содержит /
        const params = {
            sort: "now_playing",
            page: page,
        };
        try {
            // Вызываем приватный метод get из ApiClient
            const response = await __classPrivateFieldGet(this, _MediaService_apiClient, "f").get(endpoint, params);
            // Комментарий для "себя": Маппим сырые данные в наши классы сущностей,
            // используя приватный фабричный метод. Фильтруем null значения.
            const items = response.results
                .map(__classPrivateFieldGet(this, _MediaService_instances, "m", _MediaService_createMediaItem))
                .filter((item) => item !== null);
            return {
                items: items,
                page: response.page,
                totalPages: response.total_pages,
                totalResults: response.total_results,
            };
        }
        catch (error) {
            // Комментарий для "себя": Ловим и пробрасываем ошибку ApiError выше.
            // Можно добавить специфичную обработку ошибок сервисного уровня здесь.
            console.error(`Error fetching now playing (page ${page}):`, error);
            throw error; // Пробрасываем оригинальную ошибку (вероятно, ApiError)
        }
    }
    /**
     * Получает список ТОЛЬКО фильмов, которые "сейчас смотрят".
     * Поддерживает пагинацию.
     * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
     * @returns Промис, который разрешается объектом PaginatedMovieResult.
     * @throws {ApiError} В случае ошибки API.
     */
    async getNowPlayingMovies(page = 1) {
        // Комментарий для "себя": Используем параметр cat=movie для фильтрации.
        const endpoint = "";
        const params = {
            cat: "movie",
            sort: "now_playing",
            page: page,
        };
        try {
            const response = await __classPrivateFieldGet(this, _MediaService_apiClient, "f").get(endpoint, params);
            // Комментарий для "себя": Так как мы запросили cat=movie,
            // ожидаем, что все элементы - фильмы. Преобразуем их в Movie.
            // Добавим проверку isMovieMedia для надежности, хотя она тут избыточна.
            const items = response.results
                .filter(types_1.isMovieMedia) // Убедимся, что это точно фильмы
                .map((movieData) => new entities_1.Movie(movieData)); // Создаем экземпляры Movie
            return {
                items: items,
                page: response.page,
                totalPages: response.total_pages,
                totalResults: response.total_results,
            };
        }
        catch (error) {
            console.error(`Error fetching now playing movies (page ${page}):`, error);
            throw error;
        }
    }
    /**
     * Получает список ТОЛЬКО популярных фильмов (сортировка 'top' в API).
     * Поддерживает пагинацию.
     * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
     * @returns Промис, который разрешается объектом PaginatedMovieResult.
     * @throws {ApiError} В случае ошибки API.
     */
    async getPopularMovies(page = 1) {
        // Комментарий для "себя": API использует sort=top для этого списка.
        // Название метода getPopularMovies выбрано для ясности на стороне клиента.
        const endpoint = "";
        const params = {
            cat: "movie",
            sort: "top", // Параметр API остается 'top' согласно URL
            page: page,
        };
        try {
            const response = await __classPrivateFieldGet(this, _MediaService_apiClient, "f").get(endpoint, params);
            const items = response.results
                .filter(types_1.isMovieMedia)
                .map((movieData) => new entities_1.Movie(movieData));
            return {
                items: items,
                page: response.page,
                totalPages: response.total_pages,
                totalResults: response.total_results,
            };
        }
        catch (error) {
            // Комментарий для "себя": Обновляем сообщение об ошибке для консистентности
            console.error(`Error fetching popular movies (page ${page}):`, error);
            throw error;
        }
    }
    /**
     * Получает список ТОЛЬКО популярных сериалов (сортировка 'top' в API).
     * Поддерживает пагинацию.
     * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
     * @returns Промис, который разрешается объектом PaginatedTVShowResult.
     * @throws {ApiError} В случае ошибки API.
     */
    async getPopularTVShows(page = 1) {
        // Комментарий для "себя": Используем cat=tv и sort=top.
        const endpoint = "";
        const params = {
            cat: "tv", // Фильтруем по сериалам
            sort: "top",
            page: page,
        };
        try {
            const response = await __classPrivateFieldGet(this, _MediaService_apiClient, "f").get(endpoint, params);
            // Комментарий для "себя": Ожидаем только сериалы.
            const items = response.results
                .filter(types_1.isTVShowMedia) // Убедимся, что это точно сериалы
                .map((tvData) => new entities_1.TVShow(tvData)); // Создаем экземпляры TVShow
            return {
                items: items,
                page: response.page,
                totalPages: response.total_pages,
                totalResults: response.total_results,
            };
        }
        catch (error) {
            console.error(`Error fetching popular TV shows (page ${page}):`, error);
            throw error;
        }
    }
    /**
     * Получает СМЕШАННЫЙ список популярных фильмов и сериалов (сортировка 'top' в API).
     * Поддерживает пагинацию.
     * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
     * @returns Промис, который разрешается объектом PaginatedMediaResult.
     * @throws {ApiError} В случае ошибки API.
     */
    async getPopular(page = 1) {
        // Комментарий для "себя": Используем только sort=top, без cat.
        const endpoint = "";
        const params = {
            sort: "top",
            page: page,
        };
        try {
            const response = await __classPrivateFieldGet(this, _MediaService_apiClient, "f").get(endpoint, params);
            // Комментарий для "себя": Маппим сырые данные в наши классы сущностей,
            // используя приватный фабричный метод. Фильтруем null значения.
            const items = response.results
                .map(__classPrivateFieldGet(this, _MediaService_instances, "m", _MediaService_createMediaItem)) // Используем фабричный метод
                .filter((item) => item !== null);
            return {
                items: items,
                page: response.page,
                totalPages: response.total_pages,
                totalResults: response.total_results,
            };
        }
        catch (error) {
            console.error(`Error fetching popular mixed media (page ${page}):`, error);
            throw error;
        }
    }
}
exports.MediaService = MediaService;
_MediaService_apiClient = new WeakMap(), _MediaService_instances = new WeakSet(), _MediaService_createMediaItem = function _MediaService_createMediaItem(itemData) {
    // Комментарий для "себя": Используем type guards для определения,
    // какой класс инстанциировать. Это "ниндзя"-способ скрыть детали.
    if ((0, types_1.isMovieMedia)(itemData)) {
        return new entities_1.Movie(itemData);
    }
    if ((0, types_1.isTVShowMedia)(itemData)) {
        return new entities_1.TVShow(itemData);
    }
    // Комментарий для "себя": Логируем, если пришел неизвестный тип.
    // В идеале, такого быть не должно, если типы API описаны верно.
    console.warn("Unknown media item type received:", itemData);
    return null;
};
