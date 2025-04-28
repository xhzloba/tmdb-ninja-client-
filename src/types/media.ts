/**
 * Представление жанра
 */
export interface Genre {
  id: number;
  name: string;
}

/**
 * Представление кинокомпании
 */
export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

/**
 * Представление страны производства
 */
export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

/**
 * Представление языка
 */
export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

/**
 * Информация о дате релиза для конкретной страны
 */
export interface ReleaseDate {
  certification: string;
  descriptors: string[];
  iso_639_1: string; // Может быть пустым
  note: string; // Может быть пустым
  release_date: string; // Дата в формате ISO (e.g., "2025-04-24T00:00:00Z")
  type: number; // Тип релиза (1: Premiere, 2: Theatrical (limited), 3: Theatrical, 4: Digital, 5: Physical, 6: TV)
}

/**
 * Контейнер дат релиза для страны
 */
export interface CountryReleaseDates {
  iso_3166_1: string; // Код страны
  release_dates: ReleaseDate[];
}

/**
 * Полный объект дат релиза из append_to_response
 */
export interface ReleaseDatesResponse {
  results: CountryReleaseDates[];
}

/**
 * Ключевое слово
 */
export interface Keyword {
  id: number;
  name: string;
}

/**
 * Контейнер ключевых слов из append_to_response
 */
export interface KeywordsResponse {
  keywords: Keyword[];
}

/**
 * Альтернативное название
 */
export interface AlternativeTitle {
  iso_3166_1: string;
  title: string;
  type: string; // Может быть пустым
}

/**
 * Контейнер альтернативных названий из append_to_response
 */
export interface AlternativeTitlesResponse {
  titles: AlternativeTitle[];
}

/**
 * Представление эпизода (last_episode_to_air, next_episode_to_air)
 */
export interface Episode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string; // Дата выхода
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string | null; // Путь к кадру
}

/**
 * Представление сезона (детальное)
 */
export interface Season {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

/**
 * Представление возрастного рейтинга для страны
 * (структура может отличаться, это предположение)
 */
export interface ContentRating {
  iso_3166_1: string;
  rating: string;
}

/**
 * Полный объект возрастных рейтингов из append_to_response
 */
export interface ContentRatingsResponse {
  results: ContentRating[];
}

// --- Типы для append_to_response: Credits ---
export interface CastMember {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id?: number; // В фильме
  character?: string; // В фильме
  credit_id: string;
  order?: number; // В фильме
  department?: string; // В сериале (для created_by)
  job?: string; // В сериале (для created_by)
}

export interface CrewMember {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}

export interface CreditsResponse {
  cast: CastMember[];
  crew: CrewMember[];
}

// --- Типы для append_to_response: Videos ---
export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string; // Ключ для YouTube/Vimeo и т.д.
  site: string; // e.g., "YouTube"
  size: number; // e.g., 1080
  type: string; // e.g., "Trailer", "Teaser"
  official: boolean;
  published_at: string; // ISO дата
  id: string; // Уникальный ID видео
}

export interface VideosResponse {
  results: Video[];
}

// --- Типы для append_to_response: External IDs ---
export interface ExternalIdsResponse {
  imdb_id: string | null;
  wikidata_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
  // Могут быть и другие...
}

// --- Типы для append_to_response: Watch Providers ---
export interface WatchProviderInfo {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface WatchProviderCountryDetails {
  link: string;
  flatrate?: WatchProviderInfo[];
  rent?: WatchProviderInfo[];
  buy?: WatchProviderInfo[];
}

export interface WatchProviderResponse {
  results: { [countryCode: string]: WatchProviderCountryDetails };
}

// --- Типы для append_to_response: Recommendations/Similar ---
// Используем существующий MovieMedia или TVShowMedia, но урезанный
// TMDB возвращает тут неполные объекты
export interface BaseMediaRecommendation {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  title?: string; // Для фильмов
  name?: string; // Для сериалов
  original_language: string;
  original_title?: string; // Для фильмов
  original_name?: string; // Для сериалов
  overview: string;
  poster_path: string | null;
  media_type: "movie" | "tv";
  genre_ids: number[];
  popularity: number;
  release_date?: string; // Для фильмов
  first_air_date?: string; // Для сериалов
  video?: boolean; // Для фильмов
  vote_average: number;
  vote_count: number;
}

export interface RecommendationsResponse {
  page: number;
  results: BaseMediaRecommendation[];
  total_pages: number;
  total_results: number;
}

export interface SimilarResponse extends RecommendationsResponse {}

// --- Типы для append_to_response: Reviews ---
export interface ReviewAuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

export interface Review {
  author: string;
  author_details: ReviewAuthorDetails;
  content: string;
  created_at: string; // ISO дата
  id: string;
  updated_at: string; // ISO дата
  url: string;
}

export interface ReviewsResponse {
  page: number;
  results: Review[];
  total_pages: number;
  total_results: number;
}

// --- Типы для append_to_response: Images ---
export interface ImageDetails {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface ImagesResponse {
  backdrops: ImageDetails[];
  logos: ImageDetails[];
  posters: ImageDetails[];
}

/**
 * Базовые поля, общие для фильмов и сериалов В СПИСКАХ.
 * Используется как основа для конкретных типов медиа.
 */
export interface BaseMedia {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[]; // В списках приходят только ID
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  // Дополнительные поля из прокси (предполагаем, что они есть и в деталях)
  names: string[];
  PG: number;
  release_quality?: string;
  kinopoisk_id?: string;
  kp_rating?: string;
  imdb_id?: string;
  imdb_rating?: string;
  status: string; // Есть и в деталях, и в списках
  last_air_date?: string; // Используется и для фильмов, и для сериалов
}

/**
 * Расширенные поля, доступные в детальном ответе (общие для Movie и TV)
 */
export interface DetailedMediaBase {
  genres: Genre[]; // В деталях - массив объектов жанров
  homepage?: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  tagline?: string | null;
  // Поля из append_to_response (опциональные, т.к. зависят от запроса)
  release_dates?: ReleaseDatesResponse;
  keywords?: KeywordsResponse;
  alternative_titles?: AlternativeTitlesResponse;
  content_ratings?: ContentRatingsResponse;
  credits?: CreditsResponse;
  videos?: VideosResponse;
  external_ids?: ExternalIdsResponse;
  "watch/providers"?: WatchProviderResponse; // Ключ содержит слеш, используем кавычки
  recommendations?: RecommendationsResponse;
  similar?: SimilarResponse;
  reviews?: ReviewsResponse;
  images?: ImagesResponse;
}

/**
 * Интерфейс для описания НЕОБЯЗАТЕЛЬНЫХ полей в camelCase,
 * которые может добавлять прокси-сервер.
 */
export interface ProxySpecificFields {
  releaseQuality?: string;
  kinopoiskId?: string;
  kpRating?: string;
  imdbId?: string;
  imdbRating?: string;
  // При необходимости добавь сюда другие специфичные для прокси поля
}

/**
 * Объединенный тип данных, представляющий ВСЕ возможные поля,
 * которые могут прийти от API (стандартные + детальные + прокси).
 */
export type MediaDataFromApi = BaseMedia &
  Partial<DetailedMediaBase> &
  Partial<ProxySpecificFields>;

/**
 * Представление фильма из API (включая возможные детальные поля).
 */
export interface MovieMedia extends BaseMedia, Partial<DetailedMediaBase> {
  title: string;
  original_title: string;
  release_date: string; // Дата релиза фильма
  video: boolean;
  // Детальные поля, специфичные для фильма
  belongs_to_collection?: object | null; // Структура коллекции может быть сложной
  budget?: number;
  revenue?: number;
  runtime?: number | null;
}

/**
 * Представление сериала из API (включая возможные детальные поля).
 */
export interface TVShowMedia extends BaseMedia, Partial<DetailedMediaBase> {
  name: string;
  original_name: string;
  first_air_date: string; // Дата первого выхода в эфир
  origin_country: string[];
  // seasons?: { [season_number: string]: number }; // Удаляем представление из списков
  // Детальные поля, специфичные для сериала
  created_by?: {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }[];
  episode_run_time?: number[];
  in_production?: boolean;
  languages?: string[]; // Массив кодов языков
  last_episode_to_air?: Episode | null; // Используем новый тип
  next_episode_to_air?: Episode | null; // Используем новый тип
  networks?: ProductionCompany[];
  number_of_episodes?: number;
  number_of_seasons?: number;
  seasons?: Season[]; // Используем новый тип Season[] вместо object[] и старого имени
  type?: string;
}

/**
 * Объединенный тип для элемента медиа, может быть фильмом или сериалом.
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
