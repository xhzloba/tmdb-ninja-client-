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
var _TVShow_name, _TVShow_originalName, _TVShow_firstAirDate, _TVShow_originCountry, _TVShow_seasons;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TVShow = void 0;
const MediaItem_1 = require("./MediaItem");
/**
 * Представляет сущность "Сериал".
 * Наследует общие свойства от MediaItem и добавляет специфичные для сериала.
 */
class TVShow extends MediaItem_1.MediaItem {
    /**
     * Создает экземпляр класса TVShow.
     * @param data - Данные сериала из API (тип TVShowMedia).
     */
    constructor(data) {
        super(data);
        _TVShow_name.set(this, void 0);
        _TVShow_originalName.set(this, void 0);
        _TVShow_firstAirDate.set(this, void 0);
        _TVShow_originCountry.set(this, void 0);
        _TVShow_seasons.set(this, void 0);
        // Комментарий для "себя": Инициализация специфичных для сериала полей.
        __classPrivateFieldSet(this, _TVShow_name, data.name, "f");
        __classPrivateFieldSet(this, _TVShow_originalName, data.original_name, "f");
        __classPrivateFieldSet(this, _TVShow_firstAirDate, data.first_air_date, "f");
        __classPrivateFieldSet(this, _TVShow_originCountry, data.origin_country, "f");
        __classPrivateFieldSet(this, _TVShow_seasons, data.seasons, "f");
    }
    // --- Геттеры для специфичных полей сериала ---
    get name() {
        return __classPrivateFieldGet(this, _TVShow_name, "f");
    }
    get originalName() {
        return __classPrivateFieldGet(this, _TVShow_originalName, "f");
    }
    get firstAirDate() {
        return __classPrivateFieldGet(this, _TVShow_firstAirDate, "f");
    }
    get originCountry() {
        return [...__classPrivateFieldGet(this, _TVShow_originCountry, "f")];
    } // Возвращаем копию
    get seasons() {
        // Комментарий для "себя": Возвращаем копию объекта сезонов, если он есть,
        // чтобы предотвратить внешнее изменение.
        return __classPrivateFieldGet(this, _TVShow_seasons, "f") ? Object.assign({}, __classPrivateFieldGet(this, _TVShow_seasons, "f")) : undefined;
    }
}
exports.TVShow = TVShow;
_TVShow_name = new WeakMap(), _TVShow_originalName = new WeakMap(), _TVShow_firstAirDate = new WeakMap(), _TVShow_originCountry = new WeakMap(), _TVShow_seasons = new WeakMap();
