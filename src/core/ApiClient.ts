/**
 * Ошибка, возникающая при взаимодействии с API.
 * Содержит статус-код и сообщение от сервера, если они доступны.
 */
export class ApiError extends Error {
  public statusCode?: number;
  public apiMessage?: string;

  constructor(message: string, statusCode?: number, apiMessage?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.apiMessage = apiMessage;
    // Важно для корректной работы instanceof в TypeScript
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Базовый клиент для взаимодействия с API.
 * Инкапсулирует логику отправки запросов и обработки базовых ошибок.
 * Предназначен для использования внутри сервисов.
 * Приватные методы и детали реализации скрыты ("ниндзя"-стайл).
 */
export class ApiClient {
  // Базовый URL API - приватное свойство, недоступное извне
  #baseURL: string;
  // API ключ - приватное свойство
  #apiKey: string;

  /**
   * Создает экземпляр ApiClient.
   * @param baseURL - Базовый URL API, к которому будут выполняться запросы.
   * @param apiKey - API ключ для доступа к API.
   */
  constructor(baseURL: string, apiKey: string) {
    // Проверяем, что URL не пустой
    if (!baseURL) {
      throw new Error("Base URL cannot be empty.");
    }
    // Проверяем, что ключ не пустой
    if (!apiKey) {
      throw new Error("API key cannot be empty.");
    }
    this.#baseURL = baseURL;
    this.#apiKey = apiKey; // Сохраняем ключ
    // Комментарий для "себя": Убедиться, что baseURL всегда заканчивается на слеш
    // для корректного соединения с путями эндпоинтов.
    if (!this.#baseURL.endsWith("/")) {
      this.#baseURL += "/";
    }
  }

  /**
   * Выполняет GET-запрос к API.
   * Приватный метод, используется другими методами сервисов.
   * @param endpoint - Путь к эндпоинту (относительно baseURL).
   * @param params - Параметры запроса (query parameters).
   * @returns Промис с распарсенным JSON-ответом.
   * @throws {ApiError} В случае ошибки сети или ответа с кодом >= 400.
   */
  async #request<T>(
    endpoint: string,
    params?: Record<string, string | number>
  ): Promise<T> {
    const url = new URL(endpoint, this.#baseURL);

    // Сначала добавляем все остальные параметры, если они есть
    if (params) {
      Object.entries(params).forEach(
        ([key, value]: [string, string | number]) => {
          if (key.toLowerCase() !== "api_key") {
            url.searchParams.append(key, String(value));
          }
        }
      );
    }

    // Затем добавляем API ключ
    url.searchParams.append("api_key", this.#apiKey);

    // Комментарий для "себя": Используем fetch. Можно добавить опции,
    // типа заголовков (Authorization и т.д.), если API потребует.
    try {
      // Показываем полный URL с реальным API ключом
      console.log(`🔍 Запрос к API (полный): ${url.toString()}`);

      // --- Улучшенный лог запроса ---
      console.log(
        `%c✅ Connection Successful %c| %c📦 Package: %chttps://www.npmjs.com/package/tmdb-xhzloba`,
        "color: green; font-weight: bold;", // Стиль для "✅ Connection Successful"
        "color: #ccc;", // Стиль для разделителя
        "color: #CB3837; font-weight: bold;", // Стиль для "📦 Package:" (красный NPM)
        "color: #CB3837; text-decoration: underline;" // Стиль для ссылки NPM
      );
      // --->>> END DEBUGGING
      const response = await fetch(url.toString());

      if (!response.ok) {
        // Попытаться извлечь сообщение об ошибке из тела ответа
        let apiMessage: string | undefined;
        try {
          const errorData = await response.json();
          apiMessage =
            errorData?.message ||
            errorData?.status_message ||
            JSON.stringify(errorData);
        } catch (e) {
          // Не удалось распарсить JSON ошибки, используем текстовый ответ
          try {
            apiMessage = await response.text();
          } catch (textErr) {
            // Если и текст не получили
            apiMessage = "Could not retrieve error details.";
          }
        }
        throw new ApiError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
          apiMessage
        );
      }

      // Комментарий для "себя": Ожидаем JSON в ответе.
      // Если API может вернуть что-то другое, нужна доп. обработка.
      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ApiError) {
        // Просто пробрасываем нашу кастомную ошибку дальше
        throw error;
      }
      // Обработка сетевых ошибок или других проблем с fetch
      console.error("Network or fetch error:", error);
      throw new ApiError(
        "Network request failed",
        undefined,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * Публичный метод для выполнения GET-запросов.
   * Является оберткой над приватным #request, чтобы скрыть детали.
   * @param endpoint Путь к эндпоинту.
   * @param params Query параметры.
   * @returns Промис с результатом типа T.
   */
  public async get<T>(
    endpoint: string,
    params?: Record<string, string | number>
  ): Promise<T> {
    // Комментарий для "себя": Это фасадный метод.
    // Вся логика внутри #request.
    return this.#request<T>(endpoint, params);
  }

  /**
   * Получает текущий базовый URL API.
   * @returns Текущий базовый URL.
   */
  public getBaseUrl(): string {
    return this.#baseURL;
  }

  /**
   * Устанавливает новый базовый URL API.
   * @param newBaseUrl Новый базовый URL для установки.
   */
  public setBaseUrl(newBaseUrl: string): void {
    if (!newBaseUrl) {
      throw new Error("Base URL cannot be empty.");
    }
    this.#baseURL = newBaseUrl;
    // Убедимся, что baseURL всегда заканчивается на слеш
    if (!this.#baseURL.endsWith("/")) {
      this.#baseURL += "/";
    }
  }
}
