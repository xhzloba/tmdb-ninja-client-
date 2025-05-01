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

// --- Обфускация Base64 URL по умолчанию (перемешанные части) ---
const urlObfuscatedParts = [
  "t1cndhLWJ",
  "bmphLw==",
  "aHR0cHM6L",
  "vYmVyLm5p",
  "y90bWRiLm",
];
const urlPartOrder = [2, 4, 0, 3, 1];
const DEFAULT_API_URL = urlPartOrder
  .map((index) => urlObfuscatedParts[index])
  .join("");
// -----------------------------------------------------------

/**
 * Создает и конфигурирует клиент для взаимодействия с TMDB API через прокси.
 * @param baseURLOrApiKey - Либо базовый URL прокси (если передан и apiKey), либо API ключ (если baseURL не передан).
 * @param apiKeyOrUndefined - API ключ, если baseURL передан первым аргументом.
 * @returns Объект, содержащий готовые к использованию сервисы (`media`, `person`).
 * @throws {Error} Если API ключ не предоставлен.
 */
export function createTMDBProxyClient(
  baseURLOrApiKey: string = DEFAULT_API_URL, // Используем Base64 URL по умолчанию
  apiKeyOrUndefined?: string
) {
  let baseURL: string;
  let apiKey: string;

  // Определяем аргументы: или (apiKey) или (baseURL, apiKey)
  if (apiKeyOrUndefined === undefined) {
    // Передан только один аргумент - это apiKey, используем baseURL по умолчанию
    apiKey = baseURLOrApiKey;
    try {
      // Снова добавляем декодирование
      baseURL =
        typeof window !== "undefined"
          ? window.atob(DEFAULT_API_URL)
          : Buffer.from(DEFAULT_API_URL, "base64").toString("utf-8");
      // Можно временно оставить лог для проверки
      console.log(`[DEBUG] Decoded baseURL from (new) Base64: ${baseURL}`);
    } catch (e) {
      console.error(
        "Failed to decode Base64 URL, using fallback or throwing error."
      );
      throw new Error("Could not decode the default Base64 API URL.");
    }
  } else {
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

    // Выносим ссылку на NPM из группы с новым текстом
    const npmLink = `https://www.npmjs.com/package/${libName}`;
    const npmNameStyle =
      "background: #CB3837; color: #ffffff; padding: 3px; border-radius: 3px 0 0 3px; font-weight: bold;"; // Красный NPM фон
    const npmLinkStyle =
      "background: #FCCECB; color: #CB3837; padding: 3px; border-radius: 0 3px 3px 0; font-weight: bold; text-decoration: underline;"; // Светло-красный NPM фон
    console.log(
      `%c Установить пакет - NPM %c ${npmLink}`,
      npmNameStyle,
      npmLinkStyle
    );
  } catch (e) {
    /* Игнорируем */
  }

  const personService = new PersonService(apiClient);
  const mediaService = new MediaService(apiClient);

  // --- Функция помощи ---
  const help = () => {
    console.group("--- TMDB Client Help ---");

    // --- Media Service ---
    console.group(
      "%c client.media: %cСервис для работы с фильмами, сериалами и коллекциями.",
      "font-weight: bold; color: #0366d6;",
      ""
    );
    console.log(
      "  .getPopular(page?) - Получить список популярных фильмов и сериалов (смешанный). -> Promise<PaginatedMediaResult>"
    );
    console.log(
      "  .getPopularMovies(page?) - Получить список ТОЛЬКО популярных фильмов. -> Promise<PaginatedMovieResult>"
    );
    console.log(
      "  .getPopularTVShows(page?) - Получить список ТОЛЬКО популярных сериалов. -> Promise<PaginatedTVShowResult>"
    );
    console.log(
      "  .getLatest(page?) - Получить список последних добавленных фильмов и сериалов (смешанный). -> Promise<PaginatedMediaResult>"
    );
    console.log(
      "  .getLatestMovies(page?) - Получить список ТОЛЬКО последних добавленных фильмов. -> Promise<PaginatedMovieResult>"
    );
    console.log(
      "  .getLatestTvShows(page?) - Получить список ТОЛЬКО последних добавленных сериалов. -> Promise<PaginatedTVShowResult>"
    );
    console.log(
      "  .getNowPlaying(page?) - Получить список актуальных (в прокате/эфире) фильмов и сериалов (смешанный). -> Promise<PaginatedMediaResult>"
    );
    console.log(
      "  .getNowPlayingMovies(page?) - Получить список ТОЛЬКО актуальных фильмов. -> Promise<PaginatedMovieResult>"
    );
    console.log(
      "  .getNowPlayingTvShows(page?) - Получить список ТОЛЬКО актуальных сериалов. -> Promise<PaginatedTVShowResult>"
    );
    console.log(
      "  .searchMovies(query, page?) - Искать фильмы по текстовому запросу. -> Promise<PaginatedMovieResult>"
    );
    console.log(
      "  .searchTVShows(query, page?) - Искать сериалы по текстовому запросу. -> Promise<PaginatedTVShowResult>"
    );
    console.log(
      "  .getMovieDetails(movieId, options?) - Получить детальную информацию о фильме. options: { language?, appendToResponse? }. -> Promise<Movie>"
    );
    console.log(
      "  .getTVShowDetails(tvShowId, options?) - Получить детальную информацию о сериале. options: { language?, appendToResponse? }. -> Promise<TVShow>"
    );
    console.log(
      "  .getCollectionDetails(collectionId, options?) - Получить детали коллекции фильмов. options: { language? }. -> Promise<Collection>"
    );
    console.log("  (См. также классы Movie, TVShow, Collection ниже)");
    console.groupEnd(); // End Media Service

    // --- Person Service ---
    console.group(
      "%c client.person: %cСервис для работы с данными персон.",
      "font-weight: bold; color: #d73a49;",
      ""
    );
    console.log(
      "  .getPersonDetails(personId, options?) - Получить детальную информацию о персоне. options: { language?, appendToResponse? ['combined_credits'] }. -> Promise<Person>"
    );
    console.log("  (См. также класс Person ниже)");
    console.groupEnd(); // End Person Service

    // --- Entities (Классы) ---
    console.group(
      "%c Entities (Классы, возвращаемые сервисами): %c",
      "font-weight: bold; color: #6f42c1;",
      ""
    );
    console.log("    Movie: Детали фильма.");
    console.log("      .title, .releaseDate, .runtime, .tagline, ... (поля)");
    console.log(
      "      .getPosterUrl(size?), .getBackdropUrl(size?), .getDirectors(), .getCast(), ... (методы)"
    );
    console.log(
      "      .getFormattedReleaseDate(locale?), .getFormattedRuntime()"
    );
    console.log("    TVShow: Детали сериала.");
    console.log(
      "      .name, .firstAirDate, .numberOfSeasons, .numberOfEpisodes, .seasons, ... (поля)"
    );
    console.log(
      "      .getPosterUrl(size?), .getBackdropUrl(size?), .getDirectors(), .getCast(), ... (методы)"
    );
    console.log("      .getFormattedFirstAirDate(locale?)");
    console.log("    Person: Детали персоны.");
    console.log(
      "      .name, .biography, .birthday, .profilePath, .castCredits, .crewCredits, ... (поля)"
    );
    console.log(
      "      .getProfileUrl(size?), .getMoviesActedIn(), .getTvShowsActedIn(), .getVoicedWorks(), .getKnownForWorks(limit?), ... (методы)"
    );
    console.log("    Collection: Детали коллекции.");
    console.log(
      "      .name, .overview, .posterPath, .backdropPath, .parts (Movie[]), ... (поля)"
    );
    console.log("      .getPosterUrl(size?), .getBackdropUrl(size?)");
    console.log(
      "    (Используйте console.dir(entity) для просмотра всех полей/методов)"
    );
    console.groupEnd(); // End Entities

    // --- Utilities ---
    console.group(
      "%c Utilities (импортируются отдельно): %c",
      "font-weight: bold; color: #2da44e;",
      ""
    );
    console.log(
      "    ImageConfig: Управление URL изображений (import { ImageConfig } from 'tmdb-xhzloba')"
    );
    console.log(
      "      .setBaseUrl(newUrl), .getBaseUrl(), .getAvailablePosterSizes(), .getAvailableBackdropSizes(), ... (статические методы)"
    );
    console.log(
      "    ApiError: Класс ошибки API (import { ApiError } from 'tmdb-xhzloba')"
    );
    console.log(
      "      error.statusCode, error.apiMessage, error.message (свойства при catch)"
    );
    console.groupEnd(); // End Utilities

    console.log("Для подробностей см. документацию или исходный код.");
    console.groupEnd(); // End TMDB Client Help
  };
  // ---------------------

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
    /**
     * Выводит список доступных методов в консоль.
     */
    help: help,
  };
}
