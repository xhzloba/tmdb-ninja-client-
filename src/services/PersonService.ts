import { ApiClient, ApiError } from "../core/ApiClient";
import { Person } from "../entities/Person";
import { PersonDetailsResponse } from "../types";

/**
 * Опции для запроса деталей персоны.
 */
export interface PersonDetailsOptions {
  language?: string; // Язык ответа (например, 'ru-RU')
  appendToResponse?: string[]; // Дополнительные данные (например, ['combined_credits'])
}

/**
 * Сервис для работы с данными персон (актеров, съемочной группы).
 */
export class PersonService {
  #apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.#apiClient = apiClient;
  }

  /**
   * Получает детальную информацию о персоне по её ID.
   *
   * @param personId - ID персоны.
   * @param options - Опции запроса (язык, appendToResponse).
   * @returns Промис, который разрешается экземпляром Person.
   * @throws {ApiError} В случае ошибки API.
   */
  async getPersonDetails(
    personId: number,
    options: PersonDetailsOptions = {}
  ): Promise<Person> {
    if (!personId) {
      throw new Error("Person ID must be provided.");
    }

    const params: Record<string, string | number> = {};
    if (options.language) {
      params.language = options.language;
    }
    if (options.appendToResponse && options.appendToResponse.length > 0) {
      params.append_to_response = options.appendToResponse.join(",");
    }

    try {
      const data = await this.#apiClient.get<PersonDetailsResponse>(
        `3/person/${personId}`,
        params
      );
      return new Person(data);
    } catch (error) {
      // Перехватываем ошибку ApiClient и пробрасываем дальше или обрабатываем
      console.error(`Error fetching details for person ${personId}:`, error);
      throw error; // Пробрасываем оригинальную ошибку (может быть ApiError)
    }
  }
}
