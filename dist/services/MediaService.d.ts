import { ApiClient } from "../core/ApiClient";
import { Movie, TVShow } from "../entities";
/**
 * Тип возвращаемого значения для методов, возвращающих списки ТОЛЬКО фильмов с пагинацией.
 */
export interface PaginatedMovieResult {
    items: Movie[];
    page: number;
    totalPages: number;
    totalResults: number;
}
/**
 * Тип возвращаемого значения для методов, возвращающих списки ТОЛЬКО сериалов с пагинацией.
 */
export interface PaginatedTVShowResult {
    items: TVShow[];
    page: number;
    totalPages: number;
    totalResults: number;
}
/**
 * Тип возвращаемого значения для методов, возвращающих списки медиа с пагинацией.
 */
export interface PaginatedMediaResult {
    items: (Movie | TVShow)[];
    page: number;
    totalPages: number;
    totalResults: number;
}
/**
 * Сервис для получения данных о фильмах и сериалах из API.
 * Использует ApiClient для выполнения запросов и преобразует
 * "сырые" данные API в типизированные сущности (Movie, TVShow).
 * Внутренняя реализация скрыта, наружу торчат только публичные методы.
 */
export declare class MediaService {
    #private;
    /**
     * Создает экземпляр MediaService.
     * @param apiClient - Экземпляр ApiClient для выполнения запросов.
     */
    constructor(apiClient: ApiClient);
    /**
     * Получает список фильмов и сериалов, которые "сейчас смотрят".
     * Поддерживает пагинацию.
     * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
     * @returns Промис, который разрешается объектом PaginatedMediaResult.
     * @throws {ApiError} В случае ошибки API.
     */
    getNowPlaying(page?: number): Promise<PaginatedMediaResult>;
    /**
     * Получает список ТОЛЬКО фильмов, которые "сейчас смотрят".
     * Поддерживает пагинацию.
     * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
     * @returns Промис, который разрешается объектом PaginatedMovieResult.
     * @throws {ApiError} В случае ошибки API.
     */
    getNowPlayingMovies(page?: number): Promise<PaginatedMovieResult>;
    /**
     * Получает список ТОЛЬКО популярных фильмов (сортировка 'top' в API).
     * Поддерживает пагинацию.
     * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
     * @returns Промис, который разрешается объектом PaginatedMovieResult.
     * @throws {ApiError} В случае ошибки API.
     */
    getPopularMovies(page?: number): Promise<PaginatedMovieResult>;
    /**
     * Получает список ТОЛЬКО популярных сериалов (сортировка 'top' в API).
     * Поддерживает пагинацию.
     * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
     * @returns Промис, который разрешается объектом PaginatedTVShowResult.
     * @throws {ApiError} В случае ошибки API.
     */
    getPopularTVShows(page?: number): Promise<PaginatedTVShowResult>;
    /**
     * Получает СМЕШАННЫЙ список популярных фильмов и сериалов (сортировка 'top' в API).
     * Поддерживает пагинацию.
     * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
     * @returns Промис, который разрешается объектом PaginatedMediaResult.
     * @throws {ApiError} В случае ошибки API.
     */
    getPopular(page?: number): Promise<PaginatedMediaResult>;
}
