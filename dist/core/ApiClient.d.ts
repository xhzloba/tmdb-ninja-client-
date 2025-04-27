/**
 * Ошибка, возникающая при взаимодействии с API.
 * Содержит статус-код и сообщение от сервера, если они доступны.
 */
export declare class ApiError extends Error {
    statusCode?: number;
    apiMessage?: string;
    constructor(message: string, statusCode?: number, apiMessage?: string);
}
/**
 * Базовый клиент для взаимодействия с API.
 * Инкапсулирует логику отправки запросов и обработки базовых ошибок.
 * Предназначен для использования внутри сервисов.
 * Приватные методы и детали реализации скрыты ("ниндзя"-стайл).
 */
export declare class ApiClient {
    #private;
    /**
     * Создает экземпляр ApiClient.
     * @param baseURL - Базовый URL API, к которому будут выполняться запросы.
     */
    constructor(baseURL: string);
    /**
     * Публичный метод для выполнения GET-запросов.
     * Является оберткой над приватным #request, чтобы скрыть детали.
     * @param endpoint Путь к эндпоинту.
     * @param params Query параметры.
     * @returns Промис с результатом типа T.
     */
    get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T>;
}
