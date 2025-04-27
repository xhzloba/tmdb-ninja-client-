import { MovieMedia } from "../types";
import { MediaItem } from "./MediaItem";
/**
 * Представляет сущность "Фильм".
 * Наследует общие свойства от MediaItem и добавляет специфичные для фильма.
 */
export declare class Movie extends MediaItem {
    #private;
    /**
     * Создает экземпляр класса Movie.
     * @param data - Данные фильма из API (тип MovieMedia).
     */
    constructor(data: MovieMedia);
    get title(): string;
    get originalTitle(): string;
    get releaseDate(): string;
    get video(): boolean;
}
