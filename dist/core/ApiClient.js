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
var _ApiClient_instances, _ApiClient_baseURL, _ApiClient_request;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = exports.ApiError = void 0;
/**
 * Ошибка, возникающая при взаимодействии с API.
 * Содержит статус-код и сообщение от сервера, если они доступны.
 */
class ApiError extends Error {
    constructor(message, statusCode, apiMessage) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.apiMessage = apiMessage;
        // Важно для корректной работы instanceof в TypeScript
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
exports.ApiError = ApiError;
/**
 * Базовый клиент для взаимодействия с API.
 * Инкапсулирует логику отправки запросов и обработки базовых ошибок.
 * Предназначен для использования внутри сервисов.
 * Приватные методы и детали реализации скрыты ("ниндзя"-стайл).
 */
class ApiClient {
    /**
     * Создает экземпляр ApiClient.
     * @param baseURL - Базовый URL API, к которому будут выполняться запросы.
     */
    constructor(baseURL) {
        _ApiClient_instances.add(this);
        // Базовый URL API - приватное свойство, недоступное извне
        _ApiClient_baseURL.set(this, void 0);
        // Проверяем, что URL не пустой
        if (!baseURL) {
            throw new Error("Base URL cannot be empty.");
        }
        __classPrivateFieldSet(this, _ApiClient_baseURL, baseURL, "f");
        // Комментарий для "себя": Убедиться, что baseURL всегда заканчивается на слеш
        // для корректного соединения с путями эндпоинтов.
        if (!__classPrivateFieldGet(this, _ApiClient_baseURL, "f").endsWith("/")) {
            __classPrivateFieldSet(this, _ApiClient_baseURL, __classPrivateFieldGet(this, _ApiClient_baseURL, "f") + "/", "f");
        }
    }
    /**
     * Публичный метод для выполнения GET-запросов.
     * Является оберткой над приватным #request, чтобы скрыть детали.
     * @param endpoint Путь к эндпоинту.
     * @param params Query параметры.
     * @returns Промис с результатом типа T.
     */
    async get(endpoint, params) {
        // Комментарий для "себя": Это фасадный метод.
        // Вся логика внутри #request.
        return __classPrivateFieldGet(this, _ApiClient_instances, "m", _ApiClient_request).call(this, endpoint, params);
    }
}
exports.ApiClient = ApiClient;
_ApiClient_baseURL = new WeakMap(), _ApiClient_instances = new WeakSet(), _ApiClient_request = 
/**
 * Выполняет GET-запрос к API.
 * Приватный метод, используется другими методами сервисов.
 * @param endpoint - Путь к эндпоинту (относительно baseURL).
 * @param params - Параметры запроса (query parameters).
 * @returns Промис с распарсенным JSON-ответом.
 * @throws {ApiError} В случае ошибки сети или ответа с кодом >= 400.
 */
async function _ApiClient_request(endpoint, params) {
    const url = new URL(endpoint, __classPrivateFieldGet(this, _ApiClient_baseURL, "f"));
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
        });
    }
    // Комментарий для "себя": Используем fetch. Можно добавить опции,
    // типа заголовков (Authorization и т.д.), если API потребует.
    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            // Попытаться извлечь сообщение об ошибке из тела ответа
            let apiMessage;
            try {
                const errorData = await response.json();
                apiMessage =
                    (errorData === null || errorData === void 0 ? void 0 : errorData.message) ||
                        (errorData === null || errorData === void 0 ? void 0 : errorData.status_message) ||
                        JSON.stringify(errorData);
            }
            catch (e) {
                // Не удалось распарсить JSON ошибки, используем текстовый ответ
                try {
                    apiMessage = await response.text();
                }
                catch (textErr) {
                    // Если и текст не получили
                    apiMessage = "Could not retrieve error details.";
                }
            }
            throw new ApiError(`API request failed: ${response.status} ${response.statusText}`, response.status, apiMessage);
        }
        // Комментарий для "себя": Ожидаем JSON в ответе.
        // Если API может вернуть что-то другое, нужна доп. обработка.
        return (await response.json());
    }
    catch (error) {
        if (error instanceof ApiError) {
            // Просто пробрасываем нашу кастомную ошибку дальше
            throw error;
        }
        // Обработка сетевых ошибок или других проблем с fetch
        console.error("Network or fetch error:", error);
        throw new ApiError("Network request failed", undefined, error instanceof Error ? error.message : String(error));
    }
};
