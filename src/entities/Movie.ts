import { MovieMedia } from "../types";
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

  /**
   * Создает экземпляр класса Movie.
   * @param data - Данные фильма из API (тип MovieMedia).
   */
  constructor(data: MovieMedia) {
    // Вызываем конструктор базового класса
    super(data);
    // Комментарий для "себя": Инициализация специфичных для фильма полей.
    this.#title = data.title;
    this.#originalTitle = data.original_title;
    this.#releaseDate = data.release_date;
    this.#video = data.video;
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

  // Комментарий для "себя": Переопределение метода или добавление
  // специфичной для фильма логики, если потребуется.
  // Например, getFormattedReleaseDate(): string { ... }
}
