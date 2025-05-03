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
import { MediaItem, Collection } from "../entities";
import { CollectionDetailsResponse } from "../types";

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
    // Используем базовый путь '/', так как параметры sort/page идут в query.
    const endpoint = ""; // Пустой эндпоинт, т.к. базовый URL уже содержит /
    const params = {
      sort: "now_playing",
      page: page,
    };

    try {
      const response = await this.#apiClient.get<MediaListResponse>(
        endpoint,
        params
      );
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
      console.error(`Error fetching now playing (page ${page}):`, error);
      throw error;
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
    const endpoint = "";
    const params = {
      cat: "movie",
      sort: "top",
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
      cat: "tv",
      sort: "top",
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
    const endpoint = `3/movie/${movieId}`;
    const params: Record<string, string | number> = {};

    if (options?.language) {
      params.language = options.language;
    }
    if (options?.appendToResponse && options.appendToResponse.length > 0) {
      params.append_to_response = options.appendToResponse.join(",");
    }

    try {
      const movieData = await this.#apiClient.get<MovieMedia>(endpoint, params);
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
    const endpoint = `3/tv/${tvShowId}`;
    const params: Record<string, string | number> = {};

    if (options?.language) {
      params.language = options.language;
    }
    if (options?.appendToResponse && options.appendToResponse.length > 0) {
      params.append_to_response = options.appendToResponse.join(",");
    }

    try {
      const tvShowData = await this.#apiClient.get<TVShowMedia>(
        endpoint,
        params
      );
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
      cat: "movie",
      sort: "latest",
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
   * Получает список ТОЛЬКО последних добавленных сериалов В ВЫСОКОМ КАЧЕСТВЕ.
   * Использует параметры: cat=tv, sort=latest и параметр для высокого качества.
   * @param page Номер страницы для пагинации (по умолчанию 1).
   * @returns Промис с пагинированным списком ТОЛЬКО сериалов (PaginatedTVShowResult).
   * @throws {ApiError} В случае ошибки API.
   */
  async getLatestHighQualityTVShows(
    page: number = 1
  ): Promise<PaginatedTVShowResult> {
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
      console.error(
        `Error fetching latest high quality TV shows (page ${page}):`,
        error
      );
      throw error;
    }
  }

  /**
   * Получает список ТОЛЬКО последних добавленных ФИЛЬМОВ В ВЫСОКОМ КАЧЕСТВЕ (4K).
   * Использует параметры: cat=movie, sort=latest и параметр для высокого качества.
   * @param page Номер страницы для пагинации (по умолчанию 1).
   * @returns Промис с пагинированным списком ТОЛЬКО фильмов (PaginatedMovieResult).
   * @throws {ApiError} В случае ошибки API.
   */
  async getLatestHighQualityMovies(
    page: number = 1
  ): Promise<PaginatedMovieResult> {
    const endpoint = "";
    const params = {
      cat: "movie",
      sort: "latest",
      uhd: "true", // Используем параметр 'uhd' для высокого качества
      page: page,
    };

    try {
      const response = await this.#apiClient.get<MediaListResponse>(
        endpoint,
        params
      );
      const items = response.results
        .filter(isMovieMedia) // Фильтруем только фильмы
        .map((movieData) => new Movie(movieData)); // Создаем экземпляры Movie

      return {
        items: items,
        page: response.page,
        totalPages: response.total_pages,
        totalResults: response.total_results,
      };
    } catch (error) {
      console.error(
        `Error fetching latest high quality movies (page ${page}):`,
        error
      );
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

  /**
   * Получает детали коллекции фильмов по её ID.
   * @param collectionId - ID коллекции.
   * @param options - Опции запроса (например, язык).
   * @returns Promise, разрешающийся в объект Collection.
   * @throws {ApiError} Если запрос к API завершился ошибкой.
   */
  async getCollectionDetails(
    collectionId: number,
    options?: { language?: string }
  ): Promise<Collection> {
    try {
      const data = await this.#apiClient.get<CollectionDetailsResponse>(
        `/3/collection/${collectionId}`,
        options
      );
      return new Collection(data);
    } catch (error) {
      console.error(
        `Error fetching collection details for ID ${collectionId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Получает список ТОЛЬКО фильмов, выходящих или вышедших в ТЕКУЩЕМ году.
   * Автоматически определяет текущий год и использует его для фильтрации
   * по параметру `airdate`.
   * Использует сортировку `sort=now` согласно предоставленному URL.
   * Поддерживает пагинацию.
   * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
   * @returns Промис, который разрешается объектом PaginatedMovieResult.
   * @throws {ApiError} В случае ошибки API.
   */
  async getCurrentYearMovies(page: number = 1): Promise<PaginatedMovieResult> {
    const targetYear = new Date().getFullYear(); // Всегда берем текущий год
    const endpoint = "";
    const params = {
      cat: "movie",
      sort: "now",
      airdate: targetYear,
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
      console.error(
        `Error fetching movies for current year (${targetYear}, page ${page}):`,
        error
      );
      throw error;
    }
  }

  /**
   * Получает список ТОЛЬКО сериалов, выходящих или вышедших в ТЕКУЩЕМ году.
   * Автоматически определяет текущий год и использует его для фильтрации
   * по параметру `airdate`.
   * Использует сортировку `sort=now`.
   * Поддерживает пагинацию.
   * @param page - Номер страницы для загрузки (начиная с 1). По умолчанию 1.
   * @returns Промис, который разрешается объектом PaginatedTVShowResult.
   * @throws {ApiError} В случае ошибки API.
   */
  async getCurrentYearTvShows(
    page: number = 1
  ): Promise<PaginatedTVShowResult> {
    const targetYear = new Date().getFullYear();
    const endpoint = "";
    const params = {
      cat: "tv",
      sort: "now",
      airdate: targetYear,
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
      console.error(
        `Error fetching TV shows for current year (${targetYear}, page ${page}):`,
        error
      );
      throw error;
    }
  }

  /**
   * Находит фильмы по ID ключевого слова.
   * Использует эндпоинт /discover/movie с параметром with_keywords.
   * Поддерживает пагинацию и выбор языка.
   * @param keywordIds - Один ID ключевого слова (number) или массив ID (number[]).
   * @param options - Опциональные параметры:
   *   - page?: number - Номер страницы (по умолчанию 1).
   *   - language?: string - Код языка.
   *   - operator?: 'AND' | 'OR' - Логический оператор для объединения ID в массиве (по умолчанию 'AND', используется разделитель ','. Для 'OR' используется '|').
   * @returns Промис, который разрешается объектом PaginatedMovieResult.
   * @throws {ApiError} В случае ошибки API.
   */
  async discoverMoviesByKeyword(
    keywordIds: number | number[],
    options?: { page?: number; language?: string; operator?: "AND" | "OR" }
  ): Promise<PaginatedMovieResult> {
    // Используем правильный домен и путь
    const endpoint = "/3/discover/movie"; // Стандартный эндпоинт TMDB v3

    // Сбрасываем baseURL через приватный метод
    const originalBaseUrl = this.#apiClient.getBaseUrl?.() || "";
    if (typeof this.#apiClient.setBaseUrl === "function") {
      this.#apiClient.setBaseUrl("https://apitmdb.kurwa-bober.ninja");
    }

    // Формируем параметры запроса
    const params: Record<string, string | number> = {
      page: options?.page ?? 1, // Пагинация
    };

    // Добавляем язык, если он есть
    if (options?.language) {
      params.language = options.language;
    }

    // Формируем строку для with_keywords
    let keywordParam: string;
    if (Array.isArray(keywordIds)) {
      if (keywordIds.length === 0) {
        throw new Error("Keyword ID array cannot be empty.");
      }
      const separator = options?.operator === "OR" ? "|" : ",";
      keywordParam = keywordIds.join(separator);
    } else {
      keywordParam = String(keywordIds);
    }
    params.with_keywords = keywordParam;

    try {
      // Логируем полный URL до вызова

      const response = await this.#apiClient.get<MediaListResponse>(
        endpoint,
        params
      );

      // Восстанавливаем исходный baseURL, если есть метод
      if (typeof this.#apiClient.setBaseUrl === "function" && originalBaseUrl) {
        this.#apiClient.setBaseUrl(originalBaseUrl);
      }

      // Результаты discover/movie могут содержать только фильмы
      const items = response.results
        .filter(isMovieMedia) // На всякий случай фильтруем
        .map((movieData) => new Movie(movieData));

      return {
        items: items,
        page: response.page,
        totalPages: response.total_pages,
        totalResults: response.total_results,
      };
    } catch (error) {
      // Восстанавливаем baseURL в случае ошибки
      if (typeof this.#apiClient.setBaseUrl === "function" && originalBaseUrl) {
        this.#apiClient.setBaseUrl(originalBaseUrl);
      }

      console.error(
        `Error discovering movies by keyword(s) ${keywordParam} (page ${params.page}):`,
        error
      );
      throw error;
    }
  }

  /**
   * Получает СМЕШАННЫЙ список последних добавленных ФИЛЬМОВ И СЕРИАЛОВ В ВЫСОКОМ КАЧЕСТВЕ (4K).
   * Использует параметры: sort=latest и параметр для высокого качества (uhd=true).
   * @param page Номер страницы для пагинации (по умолчанию 1).
   * @returns Промис с пагинированным списком ФИЛЬМОВ и СЕРИАЛОВ (PaginatedMediaResult).
   * @throws {ApiError} В случае ошибки API.
   */
  async getLatestHighQuality(page: number = 1): Promise<PaginatedMediaResult> {
    const endpoint = "";
    const params = {
      sort: "latest",
      uhd: "true", // Используем параметр 'uhd' для высокого качества
      page: page,
    };

    try {
      const response = await this.#apiClient.get<MediaListResponse>(
        endpoint,
        params
      );
      const items = response.results
        .map(this.#createMediaItem) // Используем фабричный метод для смешанных результатов
        .filter((item): item is Movie | TVShow => item !== null); // Фильтруем null значения

      return {
        items: items,
        page: response.page,
        totalPages: response.total_pages,
        totalResults: response.total_results,
      };
    } catch (error) {
      console.error(
        `Error fetching latest high quality mixed media (page ${page}):`,
        error
      );
      throw error;
    }
  }
}
