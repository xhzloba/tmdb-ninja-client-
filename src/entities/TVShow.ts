import {
  TVShowMedia,
  ProductionCompany,
  Episode,
  Season,
  ContentRatingsResponse,
} from "../types";
import { MediaItem } from "./MediaItem";

/**
 * Представляет сущность "Сериал".
 * Наследует общие свойства от MediaItem и добавляет специфичные для сериала.
 */
export class TVShow extends MediaItem {
  readonly #name: string;
  readonly #originalName: string;
  readonly #firstAirDate: string;
  readonly #originCountry: string[];

  // Новые детальные поля сериала (опциональные)
  readonly #createdBy?: {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }[];
  readonly #episodeRunTime?: number[];
  readonly #inProduction?: boolean;
  readonly #languages?: string[];
  readonly #networks?: ProductionCompany[];
  readonly #numberOfEpisodes?: number;
  readonly #numberOfSeasons?: number;
  readonly #type?: string;

  // Новые/обновленные детальные поля
  readonly #lastEpisodeToAir?: Episode | null;
  readonly #nextEpisodeToAir?: Episode | null;
  readonly #seasons?: Season[];
  readonly #contentRatings?: ContentRatingsResponse;

  /**
   * Создает экземпляр класса TVShow.
   * @param data - Данные сериала из API (тип TVShowMedia).
   */
  constructor(data: TVShowMedia) {
    super(data);
    // Инициализация специфичных для сериала полей.
    this.#name = data.name;
    this.#originalName = data.original_name;
    this.#firstAirDate = data.first_air_date;
    this.#originCountry = data.origin_country;

    // Инициализация детальных полей сериала (если они есть)
    this.#createdBy = data.created_by;
    this.#episodeRunTime = data.episode_run_time;
    this.#inProduction = data.in_production;
    this.#languages = data.languages;
    this.#networks = data.networks;
    this.#numberOfEpisodes = data.number_of_episodes;
    this.#numberOfSeasons = data.number_of_seasons;
    this.#type = data.type;
    this.#lastEpisodeToAir = data.last_episode_to_air;
    this.#nextEpisodeToAir = data.next_episode_to_air;
    this.#seasons = data.seasons;
    this.#contentRatings = data.content_ratings;
  }

  // --- Геттеры для специфичных полей сериала ---

  get name(): string {
    return this.#name;
  }
  get originalName(): string {
    return this.#originalName;
  }
  get firstAirDate(): string {
    return this.#firstAirDate;
  }
  get originCountry(): string[] {
    return [...this.#originCountry];
  } // Возвращаем копию

  // --- Геттеры для новых детальных полей сериала ---
  get createdBy():
    | {
        id: number;
        credit_id: string;
        name: string;
        gender: number;
        profile_path: string | null;
      }[]
    | undefined {
    return this.#createdBy ? [...this.#createdBy] : undefined;
  }
  get episodeRunTime(): number[] | undefined {
    return this.#episodeRunTime ? [...this.#episodeRunTime] : undefined;
  }
  get inProduction(): boolean | undefined {
    return this.#inProduction;
  }
  get languages(): string[] | undefined {
    return this.#languages ? [...this.#languages] : undefined;
  }
  get networks(): ProductionCompany[] | undefined {
    return this.#networks ? [...this.#networks] : undefined;
  }
  get numberOfEpisodes(): number | undefined {
    return this.#numberOfEpisodes;
  }
  get numberOfSeasons(): number | undefined {
    return this.#numberOfSeasons;
  }
  get type(): string | undefined {
    return this.#type;
  }

  // --- Геттеры для новых/обновленных детальных полей ---
  get lastEpisodeToAir(): Episode | null | undefined {
    return this.#lastEpisodeToAir;
  }
  get nextEpisodeToAir(): Episode | null | undefined {
    return this.#nextEpisodeToAir;
  }
  get seasons(): Season[] | undefined {
    return this.#seasons ? [...this.#seasons] : undefined;
  }
  get contentRatings(): ContentRatingsResponse | undefined {
    return this.#contentRatings;
  }

  // Комментарий для "себя": Можно добавить методы для работы с сезонами,
  // например, getNumberOfSeasons(): number | undefined { ... }
}
