import { ApiClient } from "../core/ApiClient";
import {
  MediaListResponse,
  MediaItemResponse,
  isMovieMedia,
  isTVShowMedia,
} from "../types";
import { Movie, TVShow } from "../entities";

/**
 * Тип возвращаемого значения для методов, возвращающих списки ТОЛЬКО фильмов с пагинацией.
 */
export interface PaginatedMovieResult {
  items: Movie[]; // Массив экземпляров Movie
  page: number;
  totalPages: number;
  totalResults: number;
}

/**
 * Тип возвращаемого значения для методов, возвращающих списки ТОЛЬКО сериалов с пагинацией.
 */
export interface PaginatedTVShowResult {
  items: TVShow[]; // Массив экземпляров TVShow
  page: number;
  totalPages: number;
  totalResults: number;
}

/**
 * Тип возвращаемого значения для методов, возвращающих списки медиа с пагинацией.
 */
export interface PaginatedMediaResult {
  items: (Movie | TVShow)[]; // Массив экземпляров Movie или TVShow
  page: number;
  totalPages: number;
  totalResults: number;
}

/**
 * Сервис для получения данных о фильмах и сериалах из API.
 * Использует ApiClient для выполнения запросов и преобразует
 * "сырые" данные API в типизированные сущности (Movie, TVShow).
 * Внутренняя реализация скрыта, наружу торчат только публичные методы.
 */
export class MediaService {
  // Приватный экземпляр ApiClient, недоступный извне.
  // Инъекция зависимости через конструктор.
  readonly #apiClient: ApiClient;

  /**
   * Создает экземпляр MediaService.
   * @param apiClient - Экземпляр ApiClient для выполнения запросов.
   */
  constructor(apiClient: ApiClient) {
    // Комментарий для "себя": Сохраняем переданный клиент.
    // Убедимся, что он не undefined.
    if (!apiClient) {
      throw new Error("ApiClient instance is required for MediaService.");
    }
    this.#apiClient = apiClient;
  }

  /**
   * Приватный фабричный метод для создания экземпляров Movie или TVShow.
   * Инкапсулирует логику определения типа и создания объекта.
   * @param itemData - Данные одного элемента из ответа API.
   * @returns Экземпляр Movie или TVShow, или null если тип не распознан.
   */
  #createMediaItem(itemData: MediaItemResponse): Movie | TVShow | null {
    // Комментарий для "себя": Используем type guards для определения,
    // какой класс инстанциировать. Это "ниндзя"-способ скрыть детали.
    if (isMovieMedia(itemData)) {
      return new Movie(itemData);
    }
    if (isTVShowMedia(itemData)) {
      return new TVShow(itemData);
    }
    // Комментарий для "себя": Логируем, если пришел неизвестный тип.
    // В идеале, такого быть не должно, если типы API описаны верно.
    console.warn("Unknown media item type received:", itemData);
    return null;
  }

  /**
   * Получает список фильмов и сериалов, которые "сейчас смотрят".
   * Поддерживает пагинацию.
   * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
   * @returns Промис, который разрешается объектом PaginatedMediaResult.
   * @throws {ApiError} В случае ошибки API.
   */
  async getNowPlaying(page: number = 1): Promise<PaginatedMediaResult> {
    // Комментарий для "себя": Эндпоинт и параметры согласно документации/примерам.
    // Используем базовый путь '/', так как параметры sort/page идут в query.
    const endpoint = ""; // Пустой эндпоинт, т.к. базовый URL уже содержит /
    const params = {
      sort: "now_playing",
      page: page,
    };

    try {
      // Вызываем приватный метод get из ApiClient
      const response = await this.#apiClient.get<MediaListResponse>(
        endpoint,
        params
      );

      // Комментарий для "себя": Маппим сырые данные в наши классы сущностей,
      // используя приватный фабричный метод. Фильтруем null значения.
      const items = response.results
        .map(this.#createMediaItem)
        .filter((item): item is Movie | TVShow => item !== null);

      return {
        items: items,
        page: response.page,
        totalPages: response.total_pages,
        totalResults: response.total_results,
      };
    } catch (error) {
      // Комментарий для "себя": Ловим и пробрасываем ошибку ApiError выше.
      // Можно добавить специфичную обработку ошибок сервисного уровня здесь.
      console.error(`Error fetching now playing (page ${page}):`, error);
      throw error; // Пробрасываем оригинальную ошибку (вероятно, ApiError)
    }
  }

  /**
   * Получает список ТОЛЬКО фильмов, которые "сейчас смотрят".
   * Поддерживает пагинацию.
   * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
   * @returns Промис, который разрешается объектом PaginatedMovieResult.
   * @throws {ApiError} В случае ошибки API.
   */
  async getNowPlayingMovies(page: number = 1): Promise<PaginatedMovieResult> {
    // Комментарий для "себя": Используем параметр cat=movie для фильтрации.
    const endpoint = "";
    const params = {
      cat: "movie",
      sort: "now_playing",
      page: page,
    };

    try {
      const response = await this.#apiClient.get<MediaListResponse>(
        endpoint,
        params
      );

      // Комментарий для "себя": Так как мы запросили cat=movie,
      // ожидаем, что все элементы - фильмы. Преобразуем их в Movie.
      // Добавим проверку isMovieMedia для надежности, хотя она тут избыточна.
      const items = response.results
        .filter(isMovieMedia) // Убедимся, что это точно фильмы
        .map((movieData) => new Movie(movieData)); // Создаем экземпляры Movie

      return {
        items: items,
        page: response.page,
        totalPages: response.total_pages,
        totalResults: response.total_results,
      };
    } catch (error) {
      console.error(`Error fetching now playing movies (page ${page}):`, error);
      throw error;
    }
  }

  /**
   * Получает список ТОЛЬКО популярных фильмов (сортировка 'top' в API).
   * Поддерживает пагинацию.
   * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
   * @returns Промис, который разрешается объектом PaginatedMovieResult.
   * @throws {ApiError} В случае ошибки API.
   */
  async getPopularMovies(page: number = 1): Promise<PaginatedMovieResult> {
    // Комментарий для "себя": API использует sort=top для этого списка.
    // Название метода getPopularMovies выбрано для ясности на стороне клиента.
    const endpoint = "";
    const params = {
      cat: "movie",
      sort: "top", // Параметр API остается 'top' согласно URL
      page: page,
    };

    try {
      const response = await this.#apiClient.get<MediaListResponse>(
        endpoint,
        params
      );

      const items = response.results
        .filter(isMovieMedia)
        .map((movieData) => new Movie(movieData));

      return {
        items: items,
        page: response.page,
        totalPages: response.total_pages,
        totalResults: response.total_results,
      };
    } catch (error) {
      // Комментарий для "себя": Обновляем сообщение об ошибке для консистентности
      console.error(`Error fetching popular movies (page ${page}):`, error);
      throw error;
    }
  }

  /**
   * Получает список ТОЛЬКО популярных сериалов (сортировка 'top' в API).
   * Поддерживает пагинацию.
   * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
   * @returns Промис, который разрешается объектом PaginatedTVShowResult.
   * @throws {ApiError} В случае ошибки API.
   */
  async getPopularTVShows(page: number = 1): Promise<PaginatedTVShowResult> {
    // Комментарий для "себя": Используем cat=tv и sort=top.
    const endpoint = "";
    const params = {
      cat: "tv", // Фильтруем по сериалам
      sort: "top",
      page: page,
    };

    try {
      const response = await this.#apiClient.get<MediaListResponse>(
        endpoint,
        params
      );

      // Комментарий для "себя": Ожидаем только сериалы.
      const items = response.results
        .filter(isTVShowMedia) // Убедимся, что это точно сериалы
        .map((tvData) => new TVShow(tvData)); // Создаем экземпляры TVShow

      return {
        items: items,
        page: response.page,
        totalPages: response.total_pages,
        totalResults: response.total_results,
      };
    } catch (error) {
      console.error(`Error fetching popular TV shows (page ${page}):`, error);
      throw error;
    }
  }

  /**
   * Получает СМЕШАННЫЙ список популярных фильмов и сериалов (сортировка 'top' в API).
   * Поддерживает пагинацию.
   * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
   * @returns Промис, который разрешается объектом PaginatedMediaResult.
   * @throws {ApiError} В случае ошибки API.
   */
  async getPopular(page: number = 1): Promise<PaginatedMediaResult> {
    // Комментарий для "себя": Используем только sort=top, без cat.
    const endpoint = "";
    const params = {
      sort: "top",
      page: page,
    };

    try {
      const response = await this.#apiClient.get<MediaListResponse>(
        endpoint,
        params
      );

      // Комментарий для "себя": Маппим сырые данные в наши классы сущностей,
      // используя приватный фабричный метод. Фильтруем null значения.
      const items = response.results
        .map(this.#createMediaItem) // Используем фабричный метод
        .filter((item): item is Movie | TVShow => item !== null);

      return {
        items: items,
        page: response.page,
        totalPages: response.total_pages,
        totalResults: response.total_results,
      };
    } catch (error) {
      console.error(
        `Error fetching popular mixed media (page ${page}):`,
        error
      );
      throw error;
    }
  }

  // Комментарий для "себя": Здесь можно добавить другие методы:
  // async searchMedia(query: string, page: number = 1): Promise<PaginatedMediaResult> { ... }
  // async getMovieDetails(movieId: number): Promise<Movie> { ... }
  // async getTVShowDetails(tvShowId: number): Promise<TVShow> { ... }
}
