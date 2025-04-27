/**
 * Базовые поля, общие для фильмов и сериалов.
 * Используется как основа для конкретных типов медиа.
 */
export interface BaseMedia {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    original_language: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    vote_average: number;
    vote_count: number;
    names: string[];
    PG: number;
    release_quality?: string;
    kinopoisk_id?: string;
    kp_rating?: string;
    imdb_id?: string;
    imdb_rating?: string;
    status: string;
    last_air_date?: string;
}
/**
 * Представление фильма из API.
 * Наследует BaseMedia и добавляет специфичные для фильма поля.
 */
export interface MovieMedia extends BaseMedia {
    title: string;
    original_title: string;
    release_date: string;
    video: boolean;
}
/**
 * Представление сериала из API.
 * Наследует BaseMedia и добавляет специфичные для сериала поля.
 */
export interface TVShowMedia extends BaseMedia {
    name: string;
    original_name: string;
    first_air_date: string;
    origin_country: string[];
    seasons?: {
        [season_number: string]: number;
    };
}
/**
 * Объединенный тип для элемента медиа, может быть фильмом или сериалом.
 * Полезен для списков, где могут быть смешанные типы.
 */
export type MediaItemResponse = MovieMedia | TVShowMedia;
/**
 * Структура ответа API для списков медиа.
 */
export interface MediaListResponse {
    page: number;
    results: MediaItemResponse[];
    total_pages: number;
    total_results: number;
}
/**
 * Проверяет, является ли объект медиа фильмом.
 * Основывается на наличии поля 'title'.
 * @param item - Объект для проверки.
 * @returns true, если это фильм, иначе false.
 */
export declare function isMovieMedia(item: MediaItemResponse): item is MovieMedia;
/**
 * Проверяет, является ли объект медиа сериалом.
 * Основывается на наличии поля 'name'.
 * @param item - Объект для проверки.
 * @returns true, если это сериал, иначе false.
 */
export declare function isTVShowMedia(item: MediaItemResponse): item is TVShowMedia;
