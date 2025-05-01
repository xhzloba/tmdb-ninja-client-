import { Movie } from "./Movie";
import { TVShow } from "./TVShow";
import {
  MovieMedia,
  TVShowMedia,
  PersonCastCreditMovieResponse,
  PersonCastCreditTVResponse,
  PersonCrewCreditMovieResponse,
  PersonCrewCreditTVResponse,
  isPersonCastCreditMovie,
  isPersonCastCreditTV,
  isPersonCrewCreditMovie,
  isPersonCrewCreditTV,
} from "../types";

/**
 * Представляет роль актера (cast) в фильме или сериале.
 * Содержит экземпляр Movie или TVShow и информацию о роли.
 */
export class PersonCastCreditItem {
  readonly media: Movie | TVShow;
  readonly character: string;
  readonly creditId: string;
  readonly order?: number;
  readonly episodeCount?: number;

  constructor(
    data: PersonCastCreditMovieResponse | PersonCastCreditTVResponse
  ) {
    this.character = data.character;
    this.creditId = data.credit_id;

    // Создаем Movie или TVShow на основе media_type
    if (isPersonCastCreditMovie(data)) {
      this.media = new Movie(data as unknown as MovieMedia);
      this.order = data.order;
    } else if (isPersonCastCreditTV(data)) {
      this.media = new TVShow(data as unknown as TVShowMedia);
      this.episodeCount = data.episode_count;
    } else {
      // Обработка непредвиденного случая
      console.warn("Unknown cast credit type:", data);
      // Можно выбросить ошибку или установить media в null/undefined
      this.media = null as any; // Пример: установить в null, но TS требует тип
    }
  }

  /**
   * Возвращает экземпляр Movie, если это роль в фильме.
   */
  get movie(): Movie | null {
    return this.media instanceof Movie ? this.media : null;
  }

  /**
   * Возвращает экземпляр TVShow, если это роль в сериале.
   */
  get tvShow(): TVShow | null {
    return this.media instanceof TVShow ? this.media : null;
  }

  /**
   * Возвращает объект для JSON-сериализации.
   */
  toJSON() {
    return {
      character: this.character,
      creditId: this.creditId,
      order: this.order,
      episodeCount: this.episodeCount,
      // Сериализуем вложенный медиа-объект, используя его собственный toJSON
      media: this.media?.toJSON ? this.media.toJSON() : this.media,
    };
  }
}

/**
 * Представляет работу члена съемочной группы (crew) в фильме или сериале.
 * Содержит экземпляр Movie или TVShow и информацию о работе.
 */
export class PersonCrewCreditItem {
  readonly media: Movie | TVShow;
  readonly department: string;
  readonly job: string;
  readonly creditId: string;
  readonly episodeCount?: number;

  constructor(
    data: PersonCrewCreditMovieResponse | PersonCrewCreditTVResponse
  ) {
    this.department = data.department;
    this.job = data.job;
    this.creditId = data.credit_id;

    if (isPersonCrewCreditMovie(data)) {
      this.media = new Movie(data as unknown as MovieMedia);
    } else if (isPersonCrewCreditTV(data)) {
      this.media = new TVShow(data as unknown as TVShowMedia);
      this.episodeCount = data.episode_count;
    } else {
      console.warn("Unknown crew credit type:", data);
      this.media = null as any;
    }
  }

  /**
   * Возвращает экземпляр Movie, если это работа в фильме.
   */
  get movie(): Movie | null {
    return this.media instanceof Movie ? this.media : null;
  }

  /**
   * Возвращает экземпляр TVShow, если это работа в сериале.
   */
  get tvShow(): TVShow | null {
    return this.media instanceof TVShow ? this.media : null;
  }

  /**
   * Возвращает объект для JSON-сериализации.
   */
  toJSON() {
    return {
      department: this.department,
      job: this.job,
      creditId: this.creditId,
      episodeCount: this.episodeCount,
      media: this.media?.toJSON ? this.media.toJSON() : this.media,
    };
  }
}
