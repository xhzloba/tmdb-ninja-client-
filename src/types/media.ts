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
  // Дополнительные поля из прокси
  names: string[];
  PG: number; // Возрастной рейтинг? Судя по значению 17, похоже на то.
  release_quality?: string; // Качество релиза (опционально)
  kinopoisk_id?: string; // ID Кинопоиска (опционально)
  kp_rating?: string; // Рейтинг Кинопоиска (опционально, строка?)
  imdb_id?: string; // ID IMDB (опционально)
  imdb_rating?: string; // Рейтинг IMDB (опционально, строка?)
  status: string; // Статус ('released', 'returning series', 'planned', 'ended', etc.)
  last_air_date?: string; // Используется и для фильмов ('0001-01-01'), и для сериалов
}

/**
 * Представление фильма из API.
 * Наследует BaseMedia и добавляет специфичные для фильма поля.
 */
export interface MovieMedia extends BaseMedia {
  title: string; // У фильма есть 'title'
  original_title: string;
  release_date: string; // Дата релиза фильма
  video: boolean;
}

/**
 * Представление сериала из API.
 * Наследует BaseMedia и добавляет специфичные для сериала поля.
 */
export interface TVShowMedia extends BaseMedia {
  name: string; // У сериала есть 'name'
  original_name: string;
  first_air_date: string; // Дата первого выхода в эфир
  origin_country: string[];
  seasons?: { [season_number: string]: number }; // Информация о сезонах (опционально)
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

// Функции-предикаты для сужения типа

/**
 * Проверяет, является ли объект медиа фильмом.
 * Основывается на наличии поля 'title'.
 * @param item - Объект для проверки.
 * @returns true, если это фильм, иначе false.
 */
export function isMovieMedia(item: MediaItemResponse): item is MovieMedia {
  return (item as MovieMedia).title !== undefined;
}

/**
 * Проверяет, является ли объект медиа сериалом.
 * Основывается на наличии поля 'name'.
 * @param item - Объект для проверки.
 * @returns true, если это сериал, иначе false.
 */
export function isTVShowMedia(item: MediaItemResponse): item is TVShowMedia {
  return (item as TVShowMedia).name !== undefined;
}
