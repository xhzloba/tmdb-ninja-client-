import {
  MovieMedia,
  // Импортируем все нужные типы для appendToResponse
  ReleaseDatesResponse,
  KeywordsResponse,
  AlternativeTitlesResponse,
  ContentRatingsResponse,
  CreditsResponse,
  VideosResponse,
  ExternalIdsResponse,
  WatchProviderResponse,
  RecommendationsResponse,
  SimilarResponse,
  ReviewsResponse,
  ImagesResponse,
  // Добавляем типы для методов getDirectors/getCast
  CrewMember,
  CastMember,
} from "../types";
import { MediaItem } from "./MediaItem";

/**
 * Представляет сущность "Фильм".
 * Наследует общие свойства от MediaItem и добавляет специфичные для фильма.
 */
export class Movie extends MediaItem {
  readonly #title: string;
  readonly #originalTitle: string;
  readonly #releaseDate: string;
  readonly #video: boolean;

  // Новые детальные поля фильма (опциональные)
  readonly #belongsToCollection?: object | null;
  readonly #budget?: number;
  readonly #revenue?: number;
  readonly #runtime?: number | null;

  // Новые поля из appendToResponse (опциональные)
  readonly #release_dates?: ReleaseDatesResponse;
  readonly #keywords?: KeywordsResponse;
  readonly #alternative_titles?: AlternativeTitlesResponse;
  readonly #content_ratings?: ContentRatingsResponse;
  readonly #credits?: CreditsResponse;
  readonly #videos?: VideosResponse;
  readonly #external_ids?: ExternalIdsResponse;
  readonly #watchProviders?: WatchProviderResponse; // Имя поля без слеша
  readonly #recommendations?: RecommendationsResponse;
  readonly #similar?: SimilarResponse;
  readonly #reviews?: ReviewsResponse;
  readonly #images?: ImagesResponse;

  /**
   * Создает экземпляр класса Movie.
   * @param data - Данные фильма из API (тип MovieMedia).
   */
  constructor(data: MovieMedia) {
    // Вызываем конструктор базового класса
    super(data);
    // Инициализация специфичных для фильма полей.
    this.#title = data.title;
    this.#originalTitle = data.original_title;
    this.#releaseDate = data.release_date;
    this.#video = data.video;

    // Инициализация детальных полей фильма (если они есть)
    this.#belongsToCollection = data.belongs_to_collection;
    this.#budget = data.budget;
    this.#revenue = data.revenue;
    this.#runtime = data.runtime;

    // Инициализация полей из appendToResponse (если они есть)
    this.#release_dates = data.release_dates;
    this.#keywords = data.keywords;
    this.#alternative_titles = data.alternative_titles;
    this.#content_ratings = data.content_ratings;
    this.#credits = data.credits;
    this.#videos = data.videos;
    this.#external_ids = data.external_ids;
    this.#watchProviders = data["watch/providers"]; // Доступ по ключу со слешем
    this.#recommendations = data.recommendations;
    this.#similar = data.similar;
    this.#reviews = data.reviews;
    this.#images = data.images;
  }

  // --- Геттеры для специфичных полей фильма ---

  get title(): string {
    return this.#title;
  }
  get originalTitle(): string {
    return this.#originalTitle;
  }
  get releaseDate(): string {
    return this.#releaseDate;
  }
  get video(): boolean {
    return this.#video;
  }

  // --- Геттеры для новых детальных полей фильма ---

  get belongsToCollection(): object | null | undefined {
    return this.#belongsToCollection;
  }
  get budget(): number | undefined {
    return this.#budget;
  }
  get revenue(): number | undefined {
    return this.#revenue;
  }
  get runtime(): number | null | undefined {
    return this.#runtime;
  }

  // --- Геттеры для полей из appendToResponse ---

  get releaseDates(): ReleaseDatesResponse | undefined {
    return this.#release_dates;
  }
  get keywords(): KeywordsResponse | undefined {
    return this.#keywords;
  }
  get alternativeTitles(): AlternativeTitlesResponse | undefined {
    return this.#alternative_titles;
  }
  get contentRatings(): ContentRatingsResponse | undefined {
    return this.#content_ratings;
  }
  get credits(): CreditsResponse | undefined {
    return this.#credits;
  }
  get videos(): VideosResponse | undefined {
    return this.#videos;
  }
  get externalIds(): ExternalIdsResponse | undefined {
    return this.#external_ids;
  }
  get watchProviders(): WatchProviderResponse | undefined {
    return this.#watchProviders;
  }
  get recommendations(): RecommendationsResponse | undefined {
    return this.#recommendations;
  }
  get similar(): SimilarResponse | undefined {
    return this.#similar;
  }
  get reviews(): ReviewsResponse | undefined {
    return this.#reviews;
  }
  get images(): ImagesResponse | undefined {
    return this.#images;
  }

  // Комментарий для "себя": Переопределение метода или добавление
  // специфичной для фильма логики, если потребуется.
  // Например, getFormattedReleaseDate(): string { ... }
}
