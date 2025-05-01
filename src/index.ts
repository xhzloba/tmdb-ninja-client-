// --- Основные экспорты --- //
export { createTMDBProxyClient } from "./client";
export { ApiClient, ApiError } from "./core/ApiClient";
export { ImageConfig } from "./config";

// --- Экспорт Сущностей --- //
export { MediaItem, Movie, TVShow, Person, Collection } from "./entities";

// --- Экспорт Основных Типов --- //
export type {
  // Основные типы данных
  Genre,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
  // Типы для деталей (оставляем только те, что НЕ в сервисах)
  CollectionDetailsResponse,
  // Доп. типы для appendToResponse
  CreditsResponse,
  CastMember,
  CrewMember,
  VideosResponse,
  Video,
  ImagesResponse,
  ImageDetails,
  KeywordsResponse,
  Keyword,
  ExternalIdsResponse,
  WatchProviderResponse,
  // ... можно добавить другие по мере необходимости
} from "./types";

// Основные сервисы
export { MediaService } from "./services/MediaService";
export { PersonService } from "./services/PersonService";

// Типы, специфичные для сервисов (опции методов, результаты с пагинацией)
export type {
  PaginatedMediaResult,
  PaginatedMovieResult,
  PaginatedTVShowResult,
  MediaDetailsOptions, // Объединенный тип для опций Movie/TV
} from "./services/MediaService";
export type { PersonDetailsOptions } from "./services/PersonService";
export * from "./types";
