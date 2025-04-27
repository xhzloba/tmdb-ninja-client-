import { TVShowMedia } from "../types";
import { MediaItem } from "./MediaItem";
/**
 * Представляет сущность "Сериал".
 * Наследует общие свойства от MediaItem и добавляет специфичные для сериала.
 */
export declare class TVShow extends MediaItem {
    #private;
    /**
     * Создает экземпляр класса TVShow.
     * @param data - Данные сериала из API (тип TVShowMedia).
     */
    constructor(data: TVShowMedia);
    get name(): string;
    get originalName(): string;
    get firstAirDate(): string;
    get originCountry(): string[];
    get seasons(): {
        [season_number: string]: number;
    } | undefined;
}
