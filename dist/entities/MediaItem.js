"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MediaItem_id, _MediaItem_adult, _MediaItem_backdropPath, _MediaItem_genreIds, _MediaItem_originalLanguage, _MediaItem_overview, _MediaItem_popularity, _MediaItem_posterPath, _MediaItem_voteAverage, _MediaItem_voteCount, _MediaItem_names, _MediaItem_pgRating, _MediaItem_releaseQuality, _MediaItem_kinopoiskId, _MediaItem_kpRating, _MediaItem_imdbId, _MediaItem_imdbRating, _MediaItem_status, _MediaItem_lastAirDate;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaItem = void 0;
const config_1 = require("../config");
/**
 * Базовый класс для представления элемента медиа (фильма или сериала).
 * Инкапсулирует общие данные, полученные из API.
 * Доступ к данным осуществляется через геттеры.
 */
class MediaItem {
    /**
     * Защищенный конструктор, вызывается из дочерних классов.
     * @param data - Данные из API типа BaseMedia.
     */
    constructor(data) {
        // Используем # для объявления приватных полей (hard private)
        _MediaItem_id.set(this, void 0);
        _MediaItem_adult.set(this, void 0);
        _MediaItem_backdropPath.set(this, void 0);
        _MediaItem_genreIds.set(this, void 0);
        _MediaItem_originalLanguage.set(this, void 0);
        _MediaItem_overview.set(this, void 0);
        _MediaItem_popularity.set(this, void 0);
        _MediaItem_posterPath.set(this, void 0);
        _MediaItem_voteAverage.set(this, void 0);
        _MediaItem_voteCount.set(this, void 0);
        _MediaItem_names.set(this, void 0); // Массив имен (может включать локализованное)
        _MediaItem_pgRating.set(this, void 0); // Возрастной рейтинг
        _MediaItem_releaseQuality.set(this, void 0);
        _MediaItem_kinopoiskId.set(this, void 0);
        _MediaItem_kpRating.set(this, void 0);
        _MediaItem_imdbId.set(this, void 0);
        _MediaItem_imdbRating.set(this, void 0);
        _MediaItem_status.set(this, void 0);
        _MediaItem_lastAirDate.set(this, void 0); // Заметь, это поле есть и у фильмов в твоем API
        // Комментарий для "себя": Прямое присваивание данных из API.
        // Можно добавить валидацию или трансформацию при необходимости.
        __classPrivateFieldSet(this, _MediaItem_id, data.id, "f");
        __classPrivateFieldSet(this, _MediaItem_adult, data.adult, "f");
        __classPrivateFieldSet(this, _MediaItem_backdropPath, data.backdrop_path, "f");
        __classPrivateFieldSet(this, _MediaItem_genreIds, data.genre_ids, "f");
        __classPrivateFieldSet(this, _MediaItem_originalLanguage, data.original_language, "f");
        __classPrivateFieldSet(this, _MediaItem_overview, data.overview, "f");
        __classPrivateFieldSet(this, _MediaItem_popularity, data.popularity, "f");
        __classPrivateFieldSet(this, _MediaItem_posterPath, data.poster_path, "f");
        __classPrivateFieldSet(this, _MediaItem_voteAverage, data.vote_average, "f");
        __classPrivateFieldSet(this, _MediaItem_voteCount, data.vote_count, "f");
        __classPrivateFieldSet(this, _MediaItem_names, data.names, "f");
        __classPrivateFieldSet(this, _MediaItem_pgRating, data.PG, "f");
        __classPrivateFieldSet(this, _MediaItem_releaseQuality, data.release_quality, "f");
        __classPrivateFieldSet(this, _MediaItem_kinopoiskId, data.kinopoisk_id, "f");
        __classPrivateFieldSet(this, _MediaItem_kpRating, data.kp_rating, "f");
        __classPrivateFieldSet(this, _MediaItem_imdbId, data.imdb_id, "f");
        __classPrivateFieldSet(this, _MediaItem_imdbRating, data.imdb_rating, "f");
        __classPrivateFieldSet(this, _MediaItem_status, data.status, "f");
        __classPrivateFieldSet(this, _MediaItem_lastAirDate, data.last_air_date, "f");
    }
    // --- Геттеры для доступа к приватным полям ---
    get id() {
        return __classPrivateFieldGet(this, _MediaItem_id, "f");
    }
    get adult() {
        return __classPrivateFieldGet(this, _MediaItem_adult, "f");
    }
    get backdropPath() {
        return __classPrivateFieldGet(this, _MediaItem_backdropPath, "f");
    }
    get genreIds() {
        return [...__classPrivateFieldGet(this, _MediaItem_genreIds, "f")];
    } // Возвращаем копию массива
    get originalLanguage() {
        return __classPrivateFieldGet(this, _MediaItem_originalLanguage, "f");
    }
    get overview() {
        return __classPrivateFieldGet(this, _MediaItem_overview, "f");
    }
    get popularity() {
        return __classPrivateFieldGet(this, _MediaItem_popularity, "f");
    }
    get posterPath() {
        return __classPrivateFieldGet(this, _MediaItem_posterPath, "f");
    }
    get voteAverage() {
        return __classPrivateFieldGet(this, _MediaItem_voteAverage, "f");
    }
    get voteCount() {
        return __classPrivateFieldGet(this, _MediaItem_voteCount, "f");
    }
    get names() {
        return [...__classPrivateFieldGet(this, _MediaItem_names, "f")];
    } // Возвращаем копию
    get pgRating() {
        return __classPrivateFieldGet(this, _MediaItem_pgRating, "f");
    }
    get releaseQuality() {
        return __classPrivateFieldGet(this, _MediaItem_releaseQuality, "f");
    }
    get kinopoiskId() {
        return __classPrivateFieldGet(this, _MediaItem_kinopoiskId, "f");
    }
    get kpRating() {
        return __classPrivateFieldGet(this, _MediaItem_kpRating, "f");
    }
    get imdbId() {
        return __classPrivateFieldGet(this, _MediaItem_imdbId, "f");
    }
    get imdbRating() {
        return __classPrivateFieldGet(this, _MediaItem_imdbRating, "f");
    }
    get status() {
        return __classPrivateFieldGet(this, _MediaItem_status, "f");
    }
    get lastAirDate() {
        return __classPrivateFieldGet(this, _MediaItem_lastAirDate, "f");
    }
    /**
     * Формирует полный URL для постера.
     * Использует базовый URL из ImageConfig.
     * @param size - Желаемый размер постера (например, 'w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'). По умолчанию 'w500'.
     * @returns Полный URL постера или null, если путь к постеру отсутствует.
     */
    getPosterUrl(size = "w500") {
        if (!__classPrivateFieldGet(this, _MediaItem_posterPath, "f")) {
            return null;
        }
        // Комментарий для "себя": Убираем возможный слеш в начале пути из API
        const path = __classPrivateFieldGet(this, _MediaItem_posterPath, "f").startsWith("/")
            ? __classPrivateFieldGet(this, _MediaItem_posterPath, "f").substring(1)
            : __classPrivateFieldGet(this, _MediaItem_posterPath, "f");
        return `${config_1.ImageConfig.getBaseUrl()}${size}/${path}`;
    }
    /**
     * Формирует полный URL для фонового изображения (backdrop).
     * Использует базовый URL из ImageConfig.
     * @param size - Желаемый размер (например, 'w300', 'w780', 'w1280', 'original'). По умолчанию 'original'.
     * @returns Полный URL фонового изображения или null, если путь к нему отсутствует.
     */
    getBackdropUrl(size = "original") {
        if (!__classPrivateFieldGet(this, _MediaItem_backdropPath, "f")) {
            return null;
        }
        // Комментарий для "себя": Аналогично убираем слеш
        const path = __classPrivateFieldGet(this, _MediaItem_backdropPath, "f").startsWith("/")
            ? __classPrivateFieldGet(this, _MediaItem_backdropPath, "f").substring(1)
            : __classPrivateFieldGet(this, _MediaItem_backdropPath, "f");
        return `${config_1.ImageConfig.getBaseUrl()}${size}/${path}`;
    }
}
exports.MediaItem = MediaItem;
_MediaItem_id = new WeakMap(), _MediaItem_adult = new WeakMap(), _MediaItem_backdropPath = new WeakMap(), _MediaItem_genreIds = new WeakMap(), _MediaItem_originalLanguage = new WeakMap(), _MediaItem_overview = new WeakMap(), _MediaItem_popularity = new WeakMap(), _MediaItem_posterPath = new WeakMap(), _MediaItem_voteAverage = new WeakMap(), _MediaItem_voteCount = new WeakMap(), _MediaItem_names = new WeakMap(), _MediaItem_pgRating = new WeakMap(), _MediaItem_releaseQuality = new WeakMap(), _MediaItem_kinopoiskId = new WeakMap(), _MediaItem_kpRating = new WeakMap(), _MediaItem_imdbId = new WeakMap(), _MediaItem_imdbRating = new WeakMap(), _MediaItem_status = new WeakMap(), _MediaItem_lastAirDate = new WeakMap();
