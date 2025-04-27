import { BaseMedia } from "../types";
import { ImageConfig } from "../config";

/**
 * Базовый класс для представления элемента медиа (фильма или сериала).
 * Инкапсулирует общие данные, полученные из API.
 * Доступ к данным осуществляется через геттеры.
 */
export abstract class MediaItem {
  // Используем # для объявления приватных полей (hard private)
  readonly #id: number;
  readonly #adult: boolean;
  readonly #backdropPath: string | null;
  readonly #genreIds: number[];
  readonly #originalLanguage: string;
  readonly #overview: string;
  readonly #popularity: number;
  readonly #posterPath: string | null;
  readonly #voteAverage: number;
  readonly #voteCount: number;
  readonly #names: string[]; // Массив имен (может включать локализованное)
  readonly #pgRating: number; // Возрастной рейтинг
  readonly #releaseQuality?: string;
  readonly #kinopoiskId?: string;
  readonly #kpRating?: string;
  readonly #imdbId?: string;
  readonly #imdbRating?: string;
  readonly #status: string;
  readonly #lastAirDate?: string; // Заметь, это поле есть и у фильмов в твоем API

  /**
   * Защищенный конструктор, вызывается из дочерних классов.
   * @param data - Данные из API типа BaseMedia.
   */
  protected constructor(data: BaseMedia) {
    // Комментарий для "себя": Прямое присваивание данных из API.
    // Можно добавить валидацию или трансформацию при необходимости.
    this.#id = data.id;
    this.#adult = data.adult;
    this.#backdropPath = data.backdrop_path;
    this.#genreIds = data.genre_ids;
    this.#originalLanguage = data.original_language;
    this.#overview = data.overview;
    this.#popularity = data.popularity;
    this.#posterPath = data.poster_path;
    this.#voteAverage = data.vote_average;
    this.#voteCount = data.vote_count;
    this.#names = data.names;
    this.#pgRating = data.PG;
    this.#releaseQuality = data.release_quality;
    this.#kinopoiskId = data.kinopoisk_id;
    this.#kpRating = data.kp_rating;
    this.#imdbId = data.imdb_id;
    this.#imdbRating = data.imdb_rating;
    this.#status = data.status;
    this.#lastAirDate = data.last_air_date;
  }

  // --- Геттеры для доступа к приватным полям ---

  get id(): number {
    return this.#id;
  }
  get adult(): boolean {
    return this.#adult;
  }
  get backdropPath(): string | null {
    return this.#backdropPath;
  }
  get genreIds(): number[] {
    return [...this.#genreIds];
  } // Возвращаем копию массива
  get originalLanguage(): string {
    return this.#originalLanguage;
  }
  get overview(): string {
    return this.#overview;
  }
  get popularity(): number {
    return this.#popularity;
  }
  get posterPath(): string | null {
    return this.#posterPath;
  }
  get voteAverage(): number {
    return this.#voteAverage;
  }
  get voteCount(): number {
    return this.#voteCount;
  }
  get names(): string[] {
    return [...this.#names];
  } // Возвращаем копию
  get pgRating(): number {
    return this.#pgRating;
  }
  get releaseQuality(): string | undefined {
    return this.#releaseQuality;
  }
  get kinopoiskId(): string | undefined {
    return this.#kinopoiskId;
  }
  get kpRating(): string | undefined {
    return this.#kpRating;
  }
  get imdbId(): string | undefined {
    return this.#imdbId;
  }
  get imdbRating(): string | undefined {
    return this.#imdbRating;
  }
  get status(): string {
    return this.#status;
  }
  get lastAirDate(): string | undefined {
    return this.#lastAirDate;
  }

  /**
   * Формирует полный URL для постера.
   * Использует базовый URL из ImageConfig.
   * @param size - Желаемый размер постера (например, 'w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'). По умолчанию 'w500'.
   * @returns Полный URL постера или null, если путь к постеру отсутствует.
   */
  getPosterUrl(size: string = "w500"): string | null {
    if (!this.#posterPath) {
      return null;
    }
    // Комментарий для "себя": Убираем возможный слеш в начале пути из API
    const path = this.#posterPath.startsWith("/")
      ? this.#posterPath.substring(1)
      : this.#posterPath;
    return `${ImageConfig.getBaseUrl()}${size}/${path}`;
  }

  /**
   * Формирует полный URL для фонового изображения (backdrop).
   * Использует базовый URL из ImageConfig.
   * @param size - Желаемый размер (например, 'w300', 'w780', 'w1280', 'original'). По умолчанию 'original'.
   * @returns Полный URL фонового изображения или null, если путь к нему отсутствует.
   */
  getBackdropUrl(size: string = "original"): string | null {
    if (!this.#backdropPath) {
      return null;
    }
    // Комментарий для "себя": Аналогично убираем слеш
    const path = this.#backdropPath.startsWith("/")
      ? this.#backdropPath.substring(1)
      : this.#backdropPath;
    return `${ImageConfig.getBaseUrl()}${size}/${path}`;
  }

  // Комментарий для "себя": Можно добавить общие методы,
  // например, для получения полного URL постера или бэкдропа.
  // getPosterUrl(size: string = 'w500'): string | null { ... }
  // getBackdropUrl(size: string = 'original'): string | null { ... }
}
