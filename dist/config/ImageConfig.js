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
var _a, _ImageConfig_baseUrl;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageConfig = void 0;
/**
 * Конфигурация для базового URL изображений.
 * Использует статические свойства и методы для глобальной настройки.
 * Ниндзя-стайл: не слишком очевидно, как это работает, но эффективно.
 */
class ImageConfig {
    /**
     * Устанавливает новый базовый URL для всех изображений.
     * Это позволяет пользователю библиотеки переопределить дефолтный прокси.
     * @param newUrl - Новый базовый URL (должен заканчиваться на '/').
     */
    static setBaseUrl(newUrl) {
        // Комментарий для "себя": Валидация URL - убедимся, что он не пустой
        // и заканчивается на слеш для корректного соединения с путем.
        if (!newUrl) {
            console.warn("Attempted to set an empty image base URL. Ignoring.");
            return;
        }
        if (!newUrl.endsWith("/")) {
            console.warn(`Image base URL "${newUrl}" does not end with '/'. Appending it.`);
            newUrl += "/";
        }
        __classPrivateFieldSet(_a, _a, newUrl, "f", _ImageConfig_baseUrl);
    }
    /**
     * Получает текущий базовый URL для изображений.
     * Внутренний метод, используемый другими классами (например, MediaItem).
     * @returns Текущий базовый URL.
     */
    static getBaseUrl() {
        // Комментарий для "себя": Просто возвращаем приватное статическое поле.
        return __classPrivateFieldGet(_a, _a, "f", _ImageConfig_baseUrl);
    }
}
exports.ImageConfig = ImageConfig;
_a = ImageConfig;
// Приватное статическое свойство для хранения URL.
// Доступно только внутри этого класса.
_ImageConfig_baseUrl = { value: "https://imagetmdb.com/t/p/" };
