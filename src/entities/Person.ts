import { ImageConfig } from "../config";
import { PersonDetailsResponse } from "../types";
import { PersonCastCreditItem, PersonCrewCreditItem } from "./PersonCreditItem";

/**
 * Представляет детальную информацию о персоне (актере, члене команды и т.д.).
 * Инкапсулирует данные, полученные из API, включая фильмографию (credits).
 */
export class Person {
  readonly #data: PersonDetailsResponse;
  readonly #castCredits: PersonCastCreditItem[] = [];
  readonly #crewCredits: PersonCrewCreditItem[] = [];

  constructor(data: PersonDetailsResponse) {
    this.#data = data;

    // Обрабатываем кредиты, если они есть
    if (data.combined_credits) {
      if (Array.isArray(data.combined_credits.cast)) {
        this.#castCredits = data.combined_credits.cast.map(
          (creditData) => new PersonCastCreditItem(creditData)
        );
      }
      if (Array.isArray(data.combined_credits.crew)) {
        this.#crewCredits = data.combined_credits.crew.map(
          (creditData) => new PersonCrewCreditItem(creditData)
        );
      }
    }
  }

  // --- Геттеры для основных полей --- //

  get id(): number {
    return this.#data.id;
  }

  get name(): string {
    return this.#data.name;
  }

  get adult(): boolean {
    return this.#data.adult;
  }

  get alsoKnownAs(): string[] {
    return [...(this.#data.also_known_as || [])];
  }

  get biography(): string {
    return this.#data.biography;
  }

  get birthday(): string | null {
    return this.#data.birthday;
  }

  get deathday(): string | null {
    return this.#data.deathday;
  }

  get gender(): number {
    return this.#data.gender;
  }

  get homepage(): string | null {
    return this.#data.homepage;
  }

  get imdbId(): string | null {
    return this.#data.imdb_id;
  }

  get knownForDepartment(): string {
    return this.#data.known_for_department;
  }

  get placeOfBirth(): string | null {
    return this.#data.place_of_birth;
  }

  get popularity(): number {
    return this.#data.popularity;
  }

  get profilePath(): string | null {
    return this.#data.profile_path;
  }

  // --- Геттеры для кредитов --- //

  /**
   * Возвращает массив ролей персоны (cast).
   * Требует, чтобы данные были загружены с appendToResponse: ['combined_credits'].
   */
  get castCredits(): ReadonlyArray<PersonCastCreditItem> {
    return this.#castCredits;
  }

  /**
   * Возвращает массив работ персоны в съемочной группе (crew).
   * Требует, чтобы данные были загружены с appendToResponse: ['combined_credits'].
   */
  get crewCredits(): ReadonlyArray<PersonCrewCreditItem> {
    return this.#crewCredits;
  }

  /**
   * Возвращает все актерские роли персоны.
   * Это шорткат для `person.castCredits`.
   */
  getActingRoles(): ReadonlyArray<PersonCastCreditItem> {
    return this.#castCredits;
  }

  /**
   * Возвращает работы персоны в съемочной группе по указанному департаменту.
   * @param department - Название департамента (например, 'Directing', 'Writing', 'Production').
   * @returns Массив работ или пустой массив.
   */
  getCrewWorksByDepartment(
    department: string
  ): ReadonlyArray<PersonCrewCreditItem> {
    return this.#crewCredits.filter(
      (credit) => credit.department === department
    );
  }

  /**
   * Возвращает работы персоны в съемочной группе по указанной должности.
   * @param job - Название должности (например, 'Director', 'Writer', 'Producer').
   * @returns Массив работ или пустой массив.
   */
  getCrewWorksByJob(job: string): ReadonlyArray<PersonCrewCreditItem> {
    return this.#crewCredits.filter((credit) => credit.job === job);
  }

  // --- Методы --- //

  /**
   * Формирует полный URL для фото профиля.
   * @param size - Желаемый размер (e.g., 'w45', 'w185', 'h632', 'original'). По умолчанию 'original'.
   * @returns Полный URL фото или null, если путь отсутствует.
   */
  getProfileUrl(size: string = "original"): string | null {
    return ImageConfig.buildImageUrl(this.#data.profile_path, size);
  }

  /**
   * Возвращает объект, представляющий Person для JSON-сериализации.
   */
  toJSON() {
    // Возвращаем исходные данные + обработанные кредиты
    return {
      ...this.#data,
      castCredits: this.#castCredits.map((credit) =>
        credit.toJSON ? credit.toJSON() : credit
      ), // Сериализуем кредиты, если у них есть toJSON
      crewCredits: this.#crewCredits.map((credit) =>
        credit.toJSON ? credit.toJSON() : credit
      ),
      _profileUrl_w185: this.getProfileUrl("w185"),
    };
  }
}
