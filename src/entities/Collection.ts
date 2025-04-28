import { CollectionDetailsResponse } from "../types";
import { Movie } from "./Movie";
import { ImageConfig } from "../config";

/**
 * Представляет сущность "Коллекция Фильмов".
 * Инкапсулирует данные, полученные из API, включая список фильмов,
 * входящих в коллекцию.
 */
export class Collection {
  readonly id: number;
  readonly name: string;
  readonly overview: string | null;
  readonly posterPath: string | null;
  readonly backdropPath: string | null;
  readonly parts: Movie[]; // Массив экземпляров Movie

  /**
   * Создает экземпляр класса Collection.
   * @param data - Данные коллекции из API (тип CollectionDetailsResponse).
   */
  constructor(data: CollectionDetailsResponse) {
    this.id = data.id;
    this.name = data.name;
    this.overview = data.overview;
    this.posterPath = data.poster_path;
    this.backdropPath = data.backdrop_path;

    // Преобразуем данные частей коллекции в экземпляры Movie
    this.parts = data.parts?.map((partData) => new Movie(partData)) ?? [];
  }

  /**
   * Формирует полный URL для постера коллекции.
   * @param size - Желаемый размер постера (по умолчанию 'w500').
   * @returns Полный URL постера или null.
   */
  getPosterUrl(size: string = "w500"): string | null {
    return ImageConfig.buildImageUrl(this.posterPath, size);
  }

  /**
   * Формирует полный URL для фона коллекции.
   * @param size - Желаемый размер фона (по умолчанию 'original').
   * @returns Полный URL фона или null.
   */
  getBackdropUrl(size: string = "original"): string | null {
    return ImageConfig.buildImageUrl(this.backdropPath, size);
  }

  /**
   * Возвращает объект, представляющий Collection для JSON-сериализации.
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      overview: this.overview,
      posterPath: this.posterPath,
      backdropPath: this.backdropPath,
      // Сериализуем каждую часть (фильм) в коллекции
      parts: this.parts.map((part) => (part.toJSON ? part.toJSON() : part)),
      _posterUrl_w500: this.getPosterUrl("w500"),
      _backdropUrl_w780: this.getBackdropUrl("w780"),
    };
  }
}
