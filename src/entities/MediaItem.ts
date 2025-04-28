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
  MediaDataFromApi,
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
  protected constructor(data: MediaDataFromApi) {
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
    this.#releaseQuality = data.release_quality ?? data.releaseQuality;
    this.#kinopoiskId = data.kinopoisk_id ?? data.kinopoiskId;
    this.#kpRating = data.kp_rating ?? data.kpRating;
    this.#imdbId = data.imdb_id ?? data.imdbId;
    this.#imdbRating = data.imdb_rating ?? data.imdbRating;
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
    // Проверяем, что #genreIds - это массив, прежде чем копировать
    return Array.isArray(this.#genreIds) ? [...this.#genreIds] : [];
  } // Возвращаем копию массива или пустой массив
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
    // Проверяем, что #names - это массив, прежде чем копировать
    return Array.isArray(this.#names) ? [...this.#names] : [];
  } // Возвращаем копию или пустой массив
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
  get genres(): Genre[] {
    // Возвращаем копию для предотвращения мутаций или пустой массив
    return Array.isArray(this.#genres) ? [...this.#genres] : [];
  }
  get homepage(): string | null | undefined {
    return this.#homepage;
  }
  get productionCompanies(): ProductionCompany[] {
    return Array.isArray(this.#productionCompanies)
      ? [...this.#productionCompanies]
      : [];
  }
  get productionCountries(): ProductionCountry[] {
    return Array.isArray(this.#productionCountries)
      ? [...this.#productionCountries]
      : [];
  }
  get spokenLanguages(): SpokenLanguage[] {
    return Array.isArray(this.#spokenLanguages)
      ? [...this.#spokenLanguages]
      : [];
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
   * Форматирует количество голосов для читаемого отображения.
   * До 1000 возвращает точное число.
   * 1000 и выше - сокращает с суффиксом 'K' (1K, 1.1K, 2K, 10.5K и т.д.).
   * @returns Отформатированная строка или null, если voteCount не определен или отрицательный.
   */
  getFormattedVoteCount(): string | null {
    const count = this.voteCount;

    if (count === null || count === undefined || count < 0) {
      return null; // Или можно вернуть 'N/A' или '-'
    }
    if (count === 0) {
      return "0";
    }
    if (count < 1000) {
      return count.toString();
    }

    const thousands = count / 1000;
    // Проверяем, целое ли число тысяч (чтобы не писать 1.0K)
    if (thousands % 1 === 0) {
      return `${thousands}K`;
    } else {
      // Оставляем один знак после запятой
      return `${thousands.toFixed(1)}K`;
    }
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

  /**
   * Возвращает объект, представляющий MediaItem для JSON-сериализации.
   * Вызывается автоматически `JSON.stringify()`.
   * Включает все доступные поля (базовые и детальные, если загружены).
   */
  toJSON() {
    const obj: Record<string, any> = {
      // --- Базовые поля ---
      id: this.id,
      adult: this.adult,
      backdropPath: this.backdropPath,
      genreIds: this.genreIds,
      originalLanguage: this.originalLanguage,
      overview: this.overview,
      popularity: this.popularity,
      posterPath: this.posterPath,
      voteAverage: this.voteAverage,
      voteCount: this.voteCount,
      names: this.names,
      pgRating: this.pgRating,
      releaseQuality: this.releaseQuality,
      kinopoiskId: this.kinopoiskId,
      kpRating: this.kpRating,
      imdbId: this.imdbId,
      imdbRating: this.imdbRating,
      status: this.status,
      lastAirDate: this.lastAirDate,
      // --- Детальные поля (если есть) ---
      genres: this.genres,
      homepage: this.homepage,
      productionCompanies: this.productionCompanies,
      productionCountries: this.productionCountries,
      spokenLanguages: this.spokenLanguages,
      tagline: this.tagline,
      releaseDates: this.releaseDates,
      keywords: this.keywords,
      alternativeTitles: this.alternativeTitles,
      contentRatings: this.contentRatings,
      credits: this.credits,
      images: this.images,
      // --- Добавим результаты некоторых полезных методов ---
      _posterUrl_w500: this.getPosterUrl("w500"),
      _backdropUrl_w780: this.getBackdropUrl("w780"),
      _directors: this.getDirectors(),
      _cast_first10: this.getCast().slice(0, 10), // Пример: первые 10 актеров
    };

    // Удаляем ключи со значением undefined, чтобы JSON был чище
    for (const key in obj) {
      if (obj[key] === undefined) {
        delete obj[key];
      }
    }
    return obj;
  }
}
