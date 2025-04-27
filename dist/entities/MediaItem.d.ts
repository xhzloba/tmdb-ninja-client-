import { BaseMedia } from "../types";
/**
 * Базовый класс для представления элемента медиа (фильма или сериала).
 * Инкапсулирует общие данные, полученные из API.
 * Доступ к данным осуществляется через геттеры.
 */
export declare abstract class MediaItem {
    #private;
    /**
     * Защищенный конструктор, вызывается из дочерних классов.
     * @param data - Данные из API типа BaseMedia.
     */
    protected constructor(data: BaseMedia);
    get id(): number;
    get adult(): boolean;
    get backdropPath(): string | null;
    get genreIds(): number[];
    get originalLanguage(): string;
    get overview(): string;
    get popularity(): number;
    get posterPath(): string | null;
    get voteAverage(): number;
    get voteCount(): number;
    get names(): string[];
    get pgRating(): number;
    get releaseQuality(): string | undefined;
    get kinopoiskId(): string | undefined;
    get kpRating(): string | undefined;
    get imdbId(): string | undefined;
    get imdbRating(): string | undefined;
    get status(): string;
    get lastAirDate(): string | undefined;
    /**
     * Формирует полный URL для постера.
     * Использует базовый URL из ImageConfig.
     * @param size - Желаемый размер постера (например, 'w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'). По умолчанию 'w500'.
     * @returns Полный URL постера или null, если путь к постеру отсутствует.
     */
    getPosterUrl(size?: string): string | null;
    /**
     * Формирует полный URL для фонового изображения (backdrop).
     * Использует базовый URL из ImageConfig.
     * @param size - Желаемый размер (например, 'w300', 'w780', 'w1280', 'original'). По умолчанию 'original'.
     * @returns Полный URL фонового изображения или null, если путь к нему отсутствует.
     */
    getBackdropUrl(size?: string): string | null;
}
