import { ApiClient } from "./core/ApiClient";
import { MediaService } from "./services/MediaService";
import { PersonService } from "./services/PersonService";
// Предполагаем, что process.env.PACKAGE_VERSION будет заменен Rollup
declare var process: {
  env: {
    PACKAGE_VERSION?: string;
    PACKAGE_HOMEPAGE?: string;
  };
};

const DEFAULT_API_URL = "https://tmdb.kurwa-bober.ninja/";

/**
 * Создает и конфигурирует клиент для взаимодействия с TMDB API через прокси.
 * @param baseURLOrApiKey - Либо базовый URL прокси (если передан и apiKey), либо API ключ (если baseURL не передан).
 * @param apiKeyOrUndefined - API ключ, если baseURL передан первым аргументом.
 * @returns Объект, содержащий готовые к использованию сервисы (`media`, `person`).
 * @throws {Error} Если API ключ не предоставлен.
 */
export function createTMDBProxyClient(
  baseURLOrApiKey: string = DEFAULT_API_URL,
  apiKeyOrUndefined?: string
) {
  let baseURL: string;
  let apiKey: string;

  // Определяем аргументы: или (apiKey) или (baseURL, apiKey)
  if (apiKeyOrUndefined === undefined) {
    // Передан только один аргумент - это apiKey, используем baseURL по умолчанию
    apiKey = baseURLOrApiKey;
    baseURL = DEFAULT_API_URL;
  } else {
    // Передано два аргумента - это baseURL и apiKey
    baseURL = baseURLOrApiKey;
    apiKey = apiKeyOrUndefined;
  }

  if (!apiKey) {
    throw new Error("API key must be provided to createTMDBProxyClient.");
  }

  const apiClient = new ApiClient(baseURL, apiKey);

  // Выводим сообщение в консоль
  try {
    const version = process.env.PACKAGE_VERSION || "dev";
    const homepage = process.env.PACKAGE_HOMEPAGE || "N/A";

    // Основная информация
    console.log(
      `%c tmdb-xhzloba %c v${version} %c by xhzloba %c->%c ${homepage}`,
      "background: #023047; color: #ffb703; padding: 3px; border-radius: 3px 0 0 3px; font-weight: bold;",
      "background: #ffb703; color: #023047; padding: 3px; border-radius: 0 3px 3px 0; font-weight: bold;",
      "background: #8ecae6; color: #023047; padding: 3px; border-radius: 3px; margin-left: 5px; font-weight: bold;",
      "color: #fb8500; font-weight: bold; margin-left: 5px;",
      "color: #219ebc; text-decoration: underline; font-weight: bold;"
    );

    // Дополнительная полезная информация
    console.log(
      `%c Base URL: %c${baseURL}`,
      "color: #fb8500; font-weight: bold;",
      "color: #023047;"
    );
    console.log(
      `%c Available Services: %c client.media, client.person`,
      "color: #fb8500; font-weight: bold;",
      "color: #023047;"
    );
    console.log(
      `%c Quick Start: %c Use await client.media.getPopular() to fetch popular items.`,
      "color: #219ebc; font-weight: bold;",
      "color: #023047;"
    );
    console.log(
      `%c Docs: %c See README for details: ${homepage}`,
      "color: #219ebc; font-weight: bold;",
      "color: #023047; text-decoration: underline;"
    );
  } catch (e) {
    /* Игнорируем ошибку, если process недоступен */
  }

  const personService = new PersonService(apiClient);
  const mediaService = new MediaService(apiClient);

  return {
    /**
     * Сервис для работы с фильмами, сериалами и коллекциями.
     */
    media: mediaService,
    /**
     * Сервис для работы с данными персон.
     */
    person: personService,
    /**
     * Низкоуровневый API клиент (для продвинутых сценариев).
     */
    _apiClient: apiClient, // Доступ к базовому клиенту для расширенных случаев
  };
}
