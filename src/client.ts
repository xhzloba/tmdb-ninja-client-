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
    const libName = "tmdb-xhzloba";

    console.groupCollapsed(
      // Используем groupCollapsed, чтобы было свернуто по умолчанию
      `%c ${libName} %c v${version} %c Initialized`,
      "background: #023047; color: #ffb703; padding: 3px; border-radius: 3px 0 0 3px; font-weight: bold;",
      "background: #ffb703; color: #023047; padding: 3px; border-radius: 0 3px 3px 0; font-weight: bold;",
      "color: green; font-weight: bold; margin-left: 5px;"
    );

    // Дополнительная полезная информация внутри группы
    console.log(
      `%cServices:%c client.media, client.person`,
      "font-weight: bold; color: #fb8500;",
      ""
    );
    // Ссылка на документацию (GitHub)
    const docsNameStyle =
      "background: #2da44e; color: #ffffff; padding: 3px; border-radius: 3px 0 0 3px; font-weight: bold;"; // Зеленый GitHub
    const docsLinkStyle =
      "background: #e6ffed; color: #2da44e; padding: 3px; border-radius: 0 3px 3px 0; font-weight: bold; text-decoration: underline;"; // Светлый зеленый GitHub
    console.log(`%c Docs %c ${homepage}`, docsNameStyle, docsLinkStyle);

    console.groupEnd(); // Закрываем основную группу

    // Выносим ссылку на NPM из группы
    const npmLink = `https://www.npmjs.com/package/${libName}`;
    const npmNameStyle =
      "background: #CB3837; color: #ffffff; padding: 3px; border-radius: 3px 0 0 3px; font-weight: bold;"; // Красный NPM фон
    const npmLinkStyle =
      "background: #FCCECB; color: #CB3837; padding: 3px; border-radius: 0 3px 3px 0; font-weight: bold; text-decoration: underline;"; // Светло-красный NPM фон
    console.log(`%c NPM %c ${npmLink}`, npmNameStyle, npmLinkStyle);
  } catch (e) {
    /* Игнорируем */
  }

  const personService = new PersonService(apiClient);
  const mediaService = new MediaService(apiClient);

  // --- Вывод методов сервисов (в правильном месте) ---
  try {
    const getMethods = (service: any): string[] => {
      return Object.getOwnPropertyNames(Object.getPrototypeOf(service)).filter(
        (prop) =>
          typeof service[prop] === "function" &&
          prop !== "constructor" &&
          !prop.startsWith("_") &&
          !prop.startsWith("#")
      );
    };

    const mediaMethods = getMethods(mediaService);
    if (mediaMethods.length > 0) {
      console.groupCollapsed(
        "%c Media Service Methods",
        "color: #0366d6; font-weight: bold;"
      );
      console.log(mediaMethods.join(", "));
      console.groupEnd();
    }

    const personMethods = getMethods(personService);
    if (personMethods.length > 0) {
      console.groupCollapsed(
        "%c Person Service Methods",
        "color: #d73a49; font-weight: bold;"
      );
      console.log(personMethods.join(", "));
      console.groupEnd();
    }
  } catch (introspectionError) {
    console.warn("Could not list service methods.", introspectionError);
  }
  // -----------------------------------------------

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
