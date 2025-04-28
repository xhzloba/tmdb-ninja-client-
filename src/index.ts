// --- Основные экспорты --- //
export { createTMDBProxyClient } from "./client";
export { ApiClient, ApiError } from "./core/ApiClient";
export { ImageConfig } from "./config";

// --- Экспорт Сущностей --- //
export {
  MediaItem,
  Movie,
  TVShow,
  Person,
  PersonCastCreditItem,
  PersonCrewCreditItem,
  Collection, // Добавлен Collection
} from "./entities";

// --- Экспорт Основных Типов --- //
export type {
  // Основные типы данных
  Genre,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
  // Типы для списков
  PaginatedResponse,
  PaginatedMediaResult,
  PaginatedMovieResult,
  PaginatedTVShowResult,
  // Типы для деталей
  MovieDetailsOptions,
  TVShowDetailsOptions,
  PersonDetailsOptions,
  CollectionDetailsResponse, // Добавлен тип ответа коллекции
  // Доп. типы для appendToResponse
  CreditsResponse,
  CastMember,
  CrewMember,
  VideosResponse,
  Video,
  ImagesResponse,
  ImageDetails,
  KeywordsResponse,
  Keyword,
  ExternalIdsResponse,
  WatchProviderResponse,
  WatchProviderDetails,
  // ... можно добавить другие по мере необходимости
} from "./types";

/*
// Пример использования для быстрого старта (можно раскомментировать)
import { createTMDBProxyClient, ApiError, Movie, TVShow, Person, Collection } from "./index";

async function runExample() {
  const client = createTMDBProxyClient("ВАШ_API_КЛЮЧ");

  try {
    // 1. Получить популярные
    const popular = await client.media.getPopular();
    console.log("--- Popular Media ---");
    popular.items.slice(0, 3).forEach(item => {
      console.log(`- ${item instanceof Movie ? item.title : item.name} (Rating: ${item.voteAverage.toFixed(1)})`);
    });

    // 2. Получить детали фильма "Бэтмен"
    const batman = await client.media.getMovieDetails(414906, { appendToResponse: ['credits'] });
    console.log("\n--- Movie Details ---");
    console.log(`Title: ${batman.title}`);
    console.log(`Runtime: ${batman.getFormattedRuntime()}`);
    console.log(`Directors: ${batman.getDirectors().map(d => d.name).join(', ')}`);

    // 3. Получить детали персоны "Вин Дизель"
    const vinDiesel = await client.person.getPersonDetails(12835, { appendToResponse: ['combined_credits'] });
    console.log("\n--- Person Details ---");
    console.log(`Name: ${vinDiesel.name}`);
    console.log(`Known For (Acting): ${vinDiesel.getMoviesActedIn().slice(0, 3).map(m => m.title).join(', ')}`);
    console.log(`Voiced Works (Sample): ${vinDiesel.getVoicedWorks().slice(0, 3).map(w => w instanceof Movie ? w.title : w.name).join(', ')}`);

    // 4. Получить детали коллекции "Расплата"
    const accountantCollection = await client.media.getCollectionDetails(870339);
    console.log("\n--- Collection Details ---");
    console.log(`Collection: ${accountantCollection.name}`);
    console.log(`Parts (${accountantCollection.parts.length}):`);
    accountantCollection.parts.forEach(part => {
      console.log(`  - ${part.title} (${part.releaseDate?.substring(0,4) || 'N/A'})`);
    });

  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`\n--- API Error ---`);
      console.error(`Status: ${error.statusCode}`);
      console.error(`Message: ${error.apiMessage || error.message}`);
    } else {
      console.error("\n--- Generic Error ---", error);
    }
  }
}

// runExample();
*/
