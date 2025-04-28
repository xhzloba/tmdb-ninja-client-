import { ApiClient } from "./core/ApiClient";
import { MediaService } from "./services/MediaService";
import { PersonService } from "./services/PersonService";
// Предполагаем, что process.env.PACKAGE_VERSION будет заменен Rollup
declare var process: {
  env: {
    PACKAGE_VERSION?: string;
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

  // Выводим сообщение в консоль (если доступен process)
  try {
    if (typeof process !== "undefined" && process?.env?.PACKAGE_VERSION) {
      console.log(
        `%c tmdb-xhzloba %c v${process.env.PACKAGE_VERSION} %c by xhzloba %c->%c https://www.npmjs.com/package/tmdb-xhzloba`,
        "background: #023047; color: #ffb703; padding: 3px; border-radius: 3px 0 0 3px; font-weight: bold;",
        "background: #ffb703; color: #023047; padding: 3px; border-radius: 0 3px 3px 0; font-weight: bold;",
        "background: #8ecae6; color: #023047; padding: 3px; border-radius: 3px; margin-left: 5px; font-weight: bold;",
        "color: #fb8500; font-weight: bold; margin-left: 5px;",
        "color: #219ebc; text-decoration: underline; font-weight: bold;"
      );
    } else {
      console.log(
        `%c tmdb-xhzloba %c vdev %c by xhzloba %c->%c https://www.npmjs.com/package/tmdb-xhzloba`,
        "background: #023047; color: #ffb703; padding: 3px; border-radius: 3px 0 0 3px; font-weight: bold;",
        "background: #ffb703; color: #023047; padding: 3px; border-radius: 0 3px 3px 0; font-weight: bold;",
        "background: #8ecae6; color: #023047; padding: 3px; border-radius: 3px; margin-left: 5px; font-weight: bold;",
        "color: #fb8500; font-weight: bold; margin-left: 5px;",
        "color: #219ebc; text-decoration: underline; font-weight: bold;"
      );
    }
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
