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
var _Movie_title, _Movie_originalTitle, _Movie_releaseDate, _Movie_video;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = void 0;
const MediaItem_1 = require("./MediaItem");
/**
 * Представляет сущность "Фильм".
 * Наследует общие свойства от MediaItem и добавляет специфичные для фильма.
 */
class Movie extends MediaItem_1.MediaItem {
    /**
     * Создает экземпляр класса Movie.
     * @param data - Данные фильма из API (тип MovieMedia).
     */
    constructor(data) {
        // Вызываем конструктор базового класса
        super(data);
        _Movie_title.set(this, void 0);
        _Movie_originalTitle.set(this, void 0);
        _Movie_releaseDate.set(this, void 0);
        _Movie_video.set(this, void 0);
        // Комментарий для "себя": Инициализация специфичных для фильма полей.
        __classPrivateFieldSet(this, _Movie_title, data.title, "f");
        __classPrivateFieldSet(this, _Movie_originalTitle, data.original_title, "f");
        __classPrivateFieldSet(this, _Movie_releaseDate, data.release_date, "f");
        __classPrivateFieldSet(this, _Movie_video, data.video, "f");
    }
    // --- Геттеры для специфичных полей фильма ---
    get title() {
        return __classPrivateFieldGet(this, _Movie_title, "f");
    }
    get originalTitle() {
        return __classPrivateFieldGet(this, _Movie_originalTitle, "f");
    }
    get releaseDate() {
        return __classPrivateFieldGet(this, _Movie_releaseDate, "f");
    }
    get video() {
        return __classPrivateFieldGet(this, _Movie_video, "f");
    }
}
exports.Movie = Movie;
_Movie_title = new WeakMap(), _Movie_originalTitle = new WeakMap(), _Movie_releaseDate = new WeakMap(), _Movie_video = new WeakMap();
