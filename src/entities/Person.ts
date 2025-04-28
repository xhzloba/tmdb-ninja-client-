import { ImageConfig } from "../config";
import { PersonDetailsResponse } from "../types";
import { PersonCastCreditItem, PersonCrewCreditItem } from "./PersonCreditItem";
import { Movie } from "./Movie";
import { TVShow } from "./TVShow";

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

  /**
   * Возвращает все фильмы, в которых персона снималась (из castCredits).
   * Требует, чтобы данные были загружены с appendToResponse: ['combined_credits'].
   * @returns Массив экземпляров Movie.
   */
  getMoviesActedIn(): Movie[] {
    return this.#castCredits
      .map((credit) => credit.movie)
      .filter((movie): movie is Movie => movie !== null);
  }

  /**
   * Возвращает все сериалы, в которых персона снималась (из castCredits).
   * Требует, чтобы данные были загружены с appendToResponse: ['combined_credits'].
   * @returns Массив экземпляров TVShow.
   */
  getTvShowsActedIn(): TVShow[] {
    return this.#castCredits
      .map((credit) => credit.tvShow)
      .filter((tvShow): tvShow is TVShow => tvShow !== null);
  }

  /**
   * Возвращает список самых известных фильмов, где персона снималась (на основе порядка castCredits от API).
   * Требует, чтобы данные были загружены с appendToResponse: ['combined_credits'].
   * @param limit - Максимальное количество возвращаемых фильмов.
   * @returns Массив экземпляров Movie.
   */
  getKnownForMovies(limit: number = 10): Movie[] {
    return this.getMoviesActedIn().slice(0, limit);
  }

  /**
   * Возвращает список самых известных сериалов, где персона снималась (на основе порядка castCredits от API).
   * Требует, чтобы данные были загружены с appendToResponse: ['combined_credits'].
   * @param limit - Максимальное количество возвращаемых сериалов.
   * @returns Массив экземпляров TVShow.
   */
  getKnownForTvShows(limit: number = 10): TVShow[] {
    return this.getTvShowsActedIn().slice(0, limit);
  }

  /**
   * Возвращает список самых известных работ персоны (фильмы или сериалы)
   * на основе её основного департамента (knownForDepartment) и порядка кредитов от API.
   * Требует, чтобы данные были загружены с appendToResponse: ['combined_credits'].
   * @param limit - Максимальное количество возвращаемых работ.
   * @returns Массив экземпляров Movie или TVShow.
   */
  getKnownForWorks(limit: number = 10): (Movie | TVShow)[] {
    let relevantCredits: (PersonCastCreditItem | PersonCrewCreditItem)[] = [];

    // API обычно возвращает combined_credits уже отсортированными по популярности
    if (this.knownForDepartment === "Acting" && this.#castCredits.length > 0) {
      relevantCredits = this.#castCredits;
    } else if (this.#crewCredits.length > 0) {
      // Если не актер, или ролей нет, берем работы из команды,
      // отфильтрованные по основному департаменту (если он есть)
      const crewFiltered = this.knownForDepartment
        ? this.#crewCredits.filter(
            (c) => c.department === this.knownForDepartment
          )
        : this.#crewCredits;
      relevantCredits =
        crewFiltered.length > 0 ? crewFiltered : this.#crewCredits; // Если по департаменту пусто, берем все crew кредиты
    } else {
      // Если нет ни cast, ни crew кредитов, возвращаем пустой массив
      return [];
    }

    // Берем первые N кредитов и извлекаем из них медиа
    return relevantCredits
      .slice(0, limit)
      .map((credit) => credit.media)
      .filter(Boolean) as (Movie | TVShow)[];
  }

  /**
   * Возвращает список работ (фильмов или сериалов), где персона участвовала в озвучке.
   * Ищет в crewCredits должности, связанные с озвучкой ('Voice', 'Dubbing', 'Voice Actor', etc.).
   * Требует, чтобы данные были загружены с appendToResponse: ['combined_credits'].
   * @returns Массив экземпляров Movie или TVShow.
   */
  getVoicedWorks(): (Movie | TVShow)[] {
    const voiceJobsRegex = /voice|dubbing|voiceover|voice actor/i; // Регистронезависимый поиск для crew
    const voiceCharacterRegex = /\(voice\)|\(voice over\)/i; // Регистронезависимый поиск для cast (в имени персонажа)

    // Ищем в crewCredits
    const voicedCrewWorks = this.#crewCredits
      .filter((credit) => voiceJobsRegex.test(credit.job))
      .map((credit) => credit.media)
      .filter((media): media is Movie | TVShow => media !== null);

    // Ищем в castCredits
    const voicedCastWorks = this.#castCredits
      .filter((credit) => voiceCharacterRegex.test(credit.character))
      .map((credit) => credit.media)
      .filter((media): media is Movie | TVShow => media !== null);

    // Объединяем и удаляем дубликаты по ID медиа
    const allVoicedWorks = [...voicedCrewWorks, ...voicedCastWorks];
    const uniqueWorksMap = new Map<number, Movie | TVShow>();
    allVoicedWorks.forEach((work) => {
      if (work && !uniqueWorksMap.has(work.id)) {
        uniqueWorksMap.set(work.id, work);
      }
    });

    return Array.from(uniqueWorksMap.values());
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
