import { ApiClient } from "../core/ApiClient";
import {
  MediaListResponse,
  MediaItemResponse,
  isMovieMedia,
  isTVShowMedia,
  MovieMedia,
  TVShowMedia,
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
 * Опции для запроса деталей медиа.
 */
export interface MediaDetailsOptions {
  language?: string;
  appendToResponse?: string[]; // Массив строк для append_to_response
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
   * Получает список ТОЛЬКО сериалов, которые "сейчас смотрят".
   * Поддерживает пагинацию.
   * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
   * @returns Промис, который разрешается объектом PaginatedTVShowResult.
   * @throws {ApiError} В случае ошибки API.
   */
  async getNowPlayingTvShows(page: number = 1): Promise<PaginatedTVShowResult> {
    const endpoint = "";
    const params = {
      cat: "tv",
      sort: "now_playing",
      page: page,
    };

    try {
      const response = await this.#apiClient.get<MediaListResponse>(
        endpoint,
        params
      );
      // Ожидаем только сериалы, фильтруем и маппим
      const items = response.results
        .filter(isTVShowMedia)
        .map((tvData) => new TVShow(tvData));

      return {
        items: items,
        page: response.page,
        totalPages: response.total_pages,
        totalResults: response.total_results,
      };
    } catch (error) {
      console.error(
        `Error fetching now playing TV shows (page ${page}):`,
        error
      );
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

  /**
   * Получает детальную информацию о фильме по его ID.
   * @param movieId - ID фильма.
   * @param options - Опциональные параметры запроса (language, appendToResponse).
   * @returns Промис, который разрешается экземпляром Movie с детальной информацией.
   * @throws {ApiError} В случае ошибки API.
   */
  async getMovieDetails(
    movieId: number,
    options?: MediaDetailsOptions
  ): Promise<Movie> {
    const endpoint = `3/movie/${movieId}`; // Путь к API v3
    const params: Record<string, string | number> = {};

    if (options?.language) {
      params.language = options.language;
    }
    if (options?.appendToResponse && options.appendToResponse.length > 0) {
      params.append_to_response = options.appendToResponse.join(",");
    }

    try {
      // Запрашиваем ДЕТАЛИ фильма, ожидаем тип MovieMedia
      const movieData = await this.#apiClient.get<MovieMedia>(endpoint, params);
      // Создаем экземпляр Movie из полученных данных
      return new Movie(movieData);
    } catch (error) {
      console.error(`Error fetching details for movie ID ${movieId}:`, error);
      throw error;
    }
  }

  /**
   * Получает детальную информацию о сериале по его ID.
   * @param tvShowId - ID сериала.
   * @param options - Опциональные параметры запроса (language, appendToResponse).
   * @returns Промис, который разрешается экземпляром TVShow с детальной информацией.
   * @throws {ApiError} В случае ошибки API.
   */
  async getTVShowDetails(
    tvShowId: number,
    options?: MediaDetailsOptions
  ): Promise<TVShow> {
    const endpoint = `3/tv/${tvShowId}`; // Путь к API v3 для сериалов
    const params: Record<string, string | number> = {};

    if (options?.language) {
      params.language = options.language;
    }
    if (options?.appendToResponse && options.appendToResponse.length > 0) {
      params.append_to_response = options.appendToResponse.join(",");
    }

    try {
      // Запрашиваем ДЕТАЛИ сериала, ожидаем тип TVShowMedia
      const tvShowData = await this.#apiClient.get<TVShowMedia>(
        endpoint,
        params
      );
      // Создаем экземпляр TVShow из полученных данных
      return new TVShow(tvShowData);
    } catch (error) {
      console.error(
        `Error fetching details for TV show ID ${tvShowId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Получает список последних добавленных фильмов и сериалов.
   * @param page Номер страницы для пагинации (по умолчанию 1).
   * @returns Промис с пагинированным списком фильмов и сериалов.
   */
  async getLatest(page: number = 1): Promise<PaginatedMediaResult> {
    // Используем корневой путь "/", как и для popular/now_playing,
    // но с параметром sort=latest
    const endpoint = "";
    const params = {
      sort: "latest",
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
        .map(this.#createMediaItem)
        .filter((item): item is Movie | TVShow => item !== null);

      return {
        items: items,
        page: response.page,
        totalPages: response.total_pages,
        totalResults: response.total_results,
      };
    } catch (error) {
      console.error(`Error fetching latest media (page ${page}):`, error);
      throw error;
    }
  }

  /**
   * Получает список ТОЛЬКО последних добавленных фильмов.
   * Использует параметры: cat=movie, sort=latest.
   * @param page Номер страницы для пагинации (по умолчанию 1).
   * @returns Промис с пагинированным списком ТОЛЬКО фильмов (PaginatedMovieResult).
   * @throws {ApiError} В случае ошибки API.
   */
  async getLatestMovies(page: number = 1): Promise<PaginatedMovieResult> {
    const endpoint = "";
    const params = {
      cat: "movie", // Запрашиваем только фильмы
      sort: "latest",
      page: page,
    };

    try {
      const response = await this.#apiClient.get<MediaListResponse>(
        endpoint,
        params
      );
      // Ожидаем только фильмы, фильтруем и маппим
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
      console.error(`Error fetching latest movies (page ${page}):`, error);
      throw error;
    }
  }

  /**
   * Получает список ТОЛЬКО последних добавленных сериалов.
   * Использует параметры: cat=tv, sort=latest.
   * @param page Номер страницы для пагинации (по умолчанию 1).
   * @returns Промис с пагинированным списком ТОЛЬКО сериалов (PaginatedTVShowResult).
   * @throws {ApiError} В случае ошибки API.
   */
  async getLatestTvShows(page: number = 1): Promise<PaginatedTVShowResult> {
    const endpoint = "";
    const params = {
      cat: "tv",
      sort: "latest",
      page: page,
    };

    try {
      const response = await this.#apiClient.get<MediaListResponse>(
        endpoint,
        params
      );
      const items = response.results
        .filter(isTVShowMedia)
        .map((tvData) => new TVShow(tvData));

      return {
        items: items,
        page: response.page,
        totalPages: response.total_pages,
        totalResults: response.total_results,
      };
    } catch (error) {
      console.error(`Error fetching latest TV shows (page ${page}):`, error);
      throw error;
    }
  }

  /**
   * Ищет фильмы по текстовому запросу.
   * Поддерживает пагинацию.
   * @param query - Поисковый запрос.
   * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
   * @returns Промис, который разрешается объектом PaginatedMovieResult.
   * @throws {ApiError} В случае ошибки API.
   */
  async searchMovies(
    query: string,
    page: number = 1
  ): Promise<PaginatedMovieResult> {
    // Комментарий для "себя": Используем специальный эндпоинт /search/movie
    const endpoint = "/search/movie";
    const params = {
      query: query,
      page: page,
    };

    try {
      const response = await this.#apiClient.get<MediaListResponse>(
        endpoint,
        params
      );

      // Ожидаем только фильмы в результатах поиска
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
      console.error(
        `Error searching movies (query: "${query}", page ${page}):`,
        error
      );
      throw error;
    }
  }

  /**
   * Ищет сериалы по текстовому запросу.
   * Поддерживает пагинацию.
   * @param query - Поисковый запрос.
   * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
   * @returns Промис, который разрешается объектом PaginatedTVShowResult.
   * @throws {ApiError} В случае ошибки API.
   */
  async searchTVShows(
    query: string,
    page: number = 1
  ): Promise<PaginatedTVShowResult> {
    // Комментарий для "себя": Используем специальный эндпоинт /search/tv
    const endpoint = "/search/tv";
    const params = {
      query: query,
      page: page,
    };

    try {
      const response = await this.#apiClient.get<MediaListResponse>(
        endpoint,
        params
      );

      // Ожидаем только сериалы в результатах поиска
      const items = response.results
        .filter(isTVShowMedia)
        .map((tvData) => new TVShow(tvData));

      return {
        items: items,
        page: response.page,
        totalPages: response.total_pages,
        totalResults: response.total_results,
      };
    } catch (error) {
      console.error(
        `Error searching TV shows (query: "${query}", page ${page}):`,
        error
      );
      throw error;
    }
  }

  // Комментарий для "себя": Здесь можно добавить другие методы:
  // async searchMedia(query: string, page: number = 1): Promise<PaginatedMediaResult> { ... }
}
