import {
  BaseMedia,
  DetailedMediaBase,
  Genre,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
  ReleaseDatesResponse,
  KeywordsResponse,
  AlternativeTitlesResponse,
  ContentRatingsResponse,
  CreditsResponse,
  CrewMember,
  CastMember,
  ImagesResponse,
} from "../types";
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

  // --- Новые детальные поля (опциональные) ---
  readonly #genres?: Genre[];
  readonly #homepage?: string | null;
  readonly #productionCompanies?: ProductionCompany[];
  readonly #productionCountries?: ProductionCountry[];
  readonly #spokenLanguages?: SpokenLanguage[];
  readonly #tagline?: string | null;
  readonly #releaseDates?: ReleaseDatesResponse;
  readonly #keywords?: KeywordsResponse;
  readonly #alternativeTitles?: AlternativeTitlesResponse;
  readonly #contentRatings?: ContentRatingsResponse;
  readonly #credits?: CreditsResponse;
  readonly #images?: ImagesResponse;

  // --- Методы для работы с командой (требуют append_to_response: ["credits"]) ---

  /**
   * Возвращает массив режиссеров.
   * Требует, чтобы данные были загружены с `appendToResponse: ["credits"]`.
   * @returns Массив объектов CrewMember или пустой массив.
   */
  getDirectors(): CrewMember[] {
    return (
      this.credits?.crew?.filter((member) => member.job === "Director") ?? []
    );
  }

  /**
   * Возвращает массив основного актерского состава.
   * Требует, чтобы данные были загружены с `appendToResponse: ["credits"]`.
   * @returns Массив объектов CastMember или пустой массив.
   */
  getCast(): CastMember[] {
    // Можно добавить сортировку по order, если нужно
    return this.credits?.cast ? [...this.credits.cast] : [];
  }

  /**
   * Возвращает членов съемочной группы по указанному департаменту.
   * Требует, чтобы данные были загружены с `appendToResponse: ["credits"]`.
   * @param department - Название департамента (например, 'Writing', 'Production', 'Sound').
   * @returns Массив объектов CrewMember или пустой массив.
   */
  getCrewByDepartment(department: string): CrewMember[] {
    return (
      this.credits?.crew?.filter(
        (member) => member.department === department
      ) ?? []
    );
  }

  /**
   * Защищенный конструктор, вызывается из дочерних классов.
   * @param data - Данные из API (могут быть BaseMedia или расширенные MovieMedia/TVShowMedia).
   */
  protected constructor(data: BaseMedia & Partial<DetailedMediaBase>) {
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
    // Проверяем оба варианта написания (snake_case и camelCase) для полей прокси
    this.#releaseQuality = data.release_quality ?? (data as any).releaseQuality;
    this.#kinopoiskId = data.kinopoisk_id ?? (data as any).kinopoiskId;
    this.#kpRating = data.kp_rating ?? (data as any).kpRating;
    this.#imdbId = data.imdb_id ?? (data as any).imdbId;
    this.#imdbRating = data.imdb_rating ?? (data as any).imdbRating;
    this.#status = data.status;
    this.#lastAirDate = data.last_air_date;

    // Присваивание новых детальных полей (если они есть в data)
    this.#genres = data.genres;
    this.#homepage = data.homepage;
    this.#productionCompanies = data.production_companies;
    this.#productionCountries = data.production_countries;
    this.#spokenLanguages = data.spoken_languages;
    this.#tagline = data.tagline;
    this.#releaseDates = data.release_dates;
    this.#keywords = data.keywords;
    this.#alternativeTitles = data.alternative_titles;
    this.#contentRatings = data.content_ratings;
    this.#credits = data.credits;
    this.#images = data.images;
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

  // --- Геттеры для новых детальных полей ---
  get genres(): Genre[] | undefined {
    // Возвращаем копию для предотвращения мутаций
    return this.#genres ? [...this.#genres] : undefined;
  }
  get homepage(): string | null | undefined {
    return this.#homepage;
  }
  get productionCompanies(): ProductionCompany[] | undefined {
    return this.#productionCompanies
      ? [...this.#productionCompanies]
      : undefined;
  }
  get productionCountries(): ProductionCountry[] | undefined {
    return this.#productionCountries
      ? [...this.#productionCountries]
      : undefined;
  }
  get spokenLanguages(): SpokenLanguage[] | undefined {
    return this.#spokenLanguages ? [...this.#spokenLanguages] : undefined;
  }
  get tagline(): string | null | undefined {
    return this.#tagline;
  }
  get releaseDates(): ReleaseDatesResponse | undefined {
    return this.#releaseDates;
  } // Можно сделать deep copy, если нужна полная иммутабельность
  get keywords(): KeywordsResponse | undefined {
    return this.#keywords;
  }
  get alternativeTitles(): AlternativeTitlesResponse | undefined {
    return this.#alternativeTitles;
  }
  get contentRatings(): ContentRatingsResponse | undefined {
    return this.#contentRatings;
  }
  get credits(): CreditsResponse | undefined {
    return this.#credits;
  }
  get images(): ImagesResponse | undefined {
    return this.#images;
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

  /**
   * Формирует полный URL для логотипа.
   * Использует базовый URL из ImageConfig.
   * @param filePath - Путь к файлу логотипа (из поля images.logos).
   * @param size - Желаемый размер логотипа (например, 'w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original'). По умолчанию 'original'.
   * @returns Полный URL логотипа или null, если путь не предоставлен.
   */
  getLogoUrl(
    filePath: string | null,
    size: string = "original"
  ): string | null {
    return ImageConfig.buildImageUrl(filePath, size);
  }

  /**
   * Формирует полный URL для изображения профиля (актера/команды).
   * Использует базовый URL из ImageConfig.
   * @param filePath - Путь к файлу изображения профиля (profile_path).
   * @param size - Желаемый размер (например, 'w45', 'w185', 'h632', 'original'). По умолчанию 'original'.
   * @returns Полный URL изображения профиля или null, если путь не предоставлен.
   */
  getProfileUrl(
    filePath: string | null,
    size: string = "original"
  ): string | null {
    return ImageConfig.buildImageUrl(filePath, size);
  }

  // Комментарий для "себя": Можно добавить общие методы,
  // например, для получения полного URL постера или бэкдропа.
  // getPosterUrl(size: string = 'w500'): string | null { ... }
  // getBackdropUrl(size: string = 'original'): string | null { ... }
}
