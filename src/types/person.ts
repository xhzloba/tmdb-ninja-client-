import { BaseMedia } from "./media";

// --- Тип для детальной информации о персоне --- //

/**
 * Структура ответа API для GET /person/{person_id}
 */
export interface PersonDetailsResponse {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number; // 0: Not set, 1: Female, 2: Male, 3: Non-binary
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  known_for_department: string;
  name: string;
  place_of_birth: string | null;
  popularity: number;
  profile_path: string | null;
  // Поле добавляется через append_to_response=combined_credits
  combined_credits?: PersonCombinedCreditsResponse;
  // Могут быть и другие поля через append_to_response
}

// --- Типы для кредитов (фильмографии) персоны --- //

// Базовые поля медиа элемента, как они приходят в кредитах
// Отличаются от BaseMedia - нет прокси-полей, есть media_type
interface PersonCreditMediaBase {
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
}

// Базовые поля для фильма в кредитах
interface PersonCreditMovieBase extends PersonCreditMediaBase {
  media_type: "movie";
  original_title: string;
  release_date: string;
  title: string;
  video: boolean;
}

// Базовые поля для сериала в кредитах
interface PersonCreditTVBase extends PersonCreditMediaBase {
  media_type: "tv";
  original_name: string;
  first_air_date: string;
  name: string;
  origin_country: string[];
  episode_count?: number; // Не всегда присутствует
}

// --- Типы для ролей (cast) --- //

/**
 * Роль актера в фильме
 */
export interface PersonCastCreditMovieResponse extends PersonCreditMovieBase {
  character: string;
  credit_id: string;
  order?: number; // Порядок в титрах
}

/**
 * Роль актера в сериале
 */
export interface PersonCastCreditTVResponse extends PersonCreditTVBase {
  character: string;
  credit_id: string;
  episode_count: number; // В кредитах сериала обычно есть
}

// --- Типы для команды (crew) --- //

/**
 * Работа члена команды в фильме
 */
export interface PersonCrewCreditMovieResponse extends PersonCreditMovieBase {
  credit_id: string;
  department: string;
  job: string;
}

/**
 * Работа члена команды в сериале
 */
export interface PersonCrewCreditTVResponse extends PersonCreditTVBase {
  credit_id: string;
  department: string;
  job: string;
  episode_count?: number; // Может присутствовать для создателей/продюсеров
}

// --- Объединенный тип для кредитов --- //

/**
 * Структура ответа API для GET /person/{person_id}/combined_credits
 */
export interface PersonCombinedCreditsResponse {
  cast: (PersonCastCreditMovieResponse | PersonCastCreditTVResponse)[];
  crew: (PersonCrewCreditMovieResponse | PersonCrewCreditTVResponse)[];
  id: number; // ID персоны, к которой относятся кредиты
}

// --- Функции-предикаты для различения типов кредитов --- //

export function isPersonCastCreditMovie(
  item: any
): item is PersonCastCreditMovieResponse {
  return item?.media_type === "movie" && typeof item?.character !== "undefined";
}

export function isPersonCastCreditTV(
  item: any
): item is PersonCastCreditTVResponse {
  return item?.media_type === "tv" && typeof item?.character !== "undefined";
}

export function isPersonCrewCreditMovie(
  item: any
): item is PersonCrewCreditMovieResponse {
  return item?.media_type === "movie" && typeof item?.job !== "undefined";
}

export function isPersonCrewCreditTV(
  item: any
): item is PersonCrewCreditTVResponse {
  return item?.media_type === "tv" && typeof item?.job !== "undefined";
}
