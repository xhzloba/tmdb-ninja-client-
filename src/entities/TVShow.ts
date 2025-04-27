import { TVShowMedia } from "../types";
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
  readonly #seasons?: { [season_number: string]: number };

  /**
   * Создает экземпляр класса TVShow.
   * @param data - Данные сериала из API (тип TVShowMedia).
   */
  constructor(data: TVShowMedia) {
    super(data);
    // Комментарий для "себя": Инициализация специфичных для сериала полей.
    this.#name = data.name;
    this.#originalName = data.original_name;
    this.#firstAirDate = data.first_air_date;
    this.#originCountry = data.origin_country;
    this.#seasons = data.seasons;
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
  get seasons(): { [season_number: string]: number } | undefined {
    // Комментарий для "себя": Возвращаем копию объекта сезонов, если он есть,
    // чтобы предотвратить внешнее изменение.
    return this.#seasons ? { ...this.#seasons } : undefined;
  }

  // Комментарий для "себя": Можно добавить методы для работы с сезонами,
  // например, getNumberOfSeasons(): number | undefined { ... }
}
