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
    this.#watchProviders = data["watch/providers"];
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

  // --- Методы для удобного доступа к данным ---

  /**
   * Возвращает дату релиза в локализованном, читаемом формате.
   * @param locales - Строка или массив строк с языковыми тегами BCP 47 (например, 'ru-RU', 'en-US'). По умолчанию используется локаль браузера.
   * @param options - Объект с опциями форматирования для Intl.DateTimeFormat (например, { year: 'numeric', month: 'long', day: 'numeric' }).
   * @returns Отформатированная строка даты или null, если дата релиза отсутствует.
   */
  getFormattedReleaseDate(
    locales?: string | string[],
    options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ): string | null {
    if (!this.releaseDate) {
      return null;
    }
    try {
      const date = new Date(this.releaseDate);
      if (isNaN(date.getTime())) {
        return null;
      }
      // Корректируем дату, чтобы избежать смещения часовых поясов при парсинге YYYY-MM-DD
      // Создаем дату в UTC, чтобы toLocaleDateString использовала правильную дату
      const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      return utcDate.toLocaleDateString(locales, options);
    } catch (error) {
      console.error("Error formatting release date:", this.releaseDate, error);
      return this.releaseDate; // Fallback
    }
  }

  /**
   * Возвращает длительность фильма в читаемом формате "X ч Y мин".
   * Требует, чтобы у объекта Movie было установлено свойство `runtime` (обычно из getMovieDetails).
   * @returns Отформатированная строка длительности (например, "2 ч 56 мин") или null, если runtime не определен или равен 0.
   */
  getFormattedRuntime(): string | null {
    const runtimeMinutes = this.runtime;
    if (!runtimeMinutes || runtimeMinutes <= 0) {
      return null;
    }

    const hours = Math.floor(runtimeMinutes / 60);
    const minutes = runtimeMinutes % 60;

    let result = "";
    if (hours > 0) {
      result += `${hours} ч `;
    }
    if (minutes > 0) {
      result += `${minutes} мин`;
    }

    return result.trim() || null; // Возвращаем null, если результат пустой (маловероятно, но на всякий случай)
  }

  get tagline(): string | null | undefined {
    return super.tagline;
  }

  /**
   * Возвращает объект, представляющий Movie для JSON-сериализации.
   * Расширяет toJSON из MediaItem, добавляя специфичные для фильма поля.
   */
  toJSON() {
    const mediaItemJSON = super.toJSON(); // Получаем базовый JSON
    const movieJSON: Record<string, any> = {
      ...mediaItemJSON, // Копируем все поля из MediaItem
      // --- Специфичные поля Movie ---
      title: this.title,
      originalTitle: this.originalTitle,
      releaseDate: this.releaseDate,
      runtime: this.runtime,
      budget: this.budget,
      revenue: this.revenue,

      _formattedReleaseDate_RU: this.getFormattedReleaseDate("ru-RU"),
      _mediaType: "movie",
    };

    for (const key in movieJSON) {
      if (movieJSON[key] === undefined) {
        delete movieJSON[key];
      }
    }
    return movieJSON;
  }
}
