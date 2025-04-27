"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMovieMedia = isMovieMedia;
exports.isTVShowMedia = isTVShowMedia;
// Функции-предикаты для сужения типа
/**
 * Проверяет, является ли объект медиа фильмом.
 * Основывается на наличии поля 'title'.
 * @param item - Объект для проверки.
 * @returns true, если это фильм, иначе false.
 */
function isMovieMedia(item) {
    return item.title !== undefined;
}
/**
 * Проверяет, является ли объект медиа сериалом.
 * Основывается на наличии поля 'name'.
 * @param item - Объект для проверки.
 * @returns true, если это сериал, иначе false.
 */
function isTVShowMedia(item) {
    return item.name !== undefined;
}
