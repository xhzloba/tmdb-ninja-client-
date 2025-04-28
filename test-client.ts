// test-client.ts (упрощенный для проверки импорта)
// Запуск: ts-node test-client.ts (из корневой папки проекта)

// Восстанавливаем импорты
import {
  createTMDBProxyClient,
  ApiClient,
  ApiError,
  Movie,
  TVShow,
  ImageConfig,
  Episode,
  Season,
  PaginatedMediaResult,
  PaginatedMovieResult,
  PaginatedTVShowResult,
  // Типы и классы для персон
  Person,
  PersonDetailsOptions,
  PersonCastCreditItem,
  PersonCrewCreditItem,
} from "./src/index";

console.log("---> Импорт из ./src/index прошел успешно!");

const BASE_URL = "https://tmdb.kurwa-bober.ninja/"; // Определяем URL
const API_KEY = "4ef0d7355d9ffb5151e987764708ce96"; // Хардкодим ключ для теста

// Создаем отдельный ApiClient ТОЛЬКО для теста сырых запросов
// const rawApiClient = new ApiClient(BASE_URL, API_KEY); // Пока закомментируем или исправим позже, если нужен

// Инициализация клиента (только после проверки API_KEY)
const client = createTMDBProxyClient(BASE_URL, API_KEY!);

async function runTest() {
  console.log("Запускаем тест API клиента...");

  try {
    // --- ШАГ 0: Тестирование СЫРЫХ ответов API ---
    console.log(
      "\n0.1 Тестируем СЫРОЙ ответ API для Popular Movies (cat=movie&sort=top)..."
    );
    try {
      // const rawPopularMoviesResponse = await rawApiClient.get<any>("", {
      //   cat: "movie",
      //   sort: "top",
      //   page: 1,
      // });
      console.log("  ---> СЫРОЙ ответ API для Popular Movies:");
      // console.dir(rawPopularMoviesResponse, { depth: null });
    } catch (rawError) {
      console.error(
        "  ОШИБКА при получении сырого ответа Popular Movies:",
        rawError
      );
    }

    console.log(
      "\n0.2 Тестируем СЫРОЙ ответ API для Now Playing (sort=now_playing)..."
    );
    try {
      // const rawNowPlayingResponse = await rawApiClient.get<any>("", {
      //   sort: "now_playing",
      //   page: 1,
      // });
      console.log("  ---> СЫРОЙ ответ API для Now Playing:");
      // console.dir(rawNowPlayingResponse, { depth: null });
    } catch (rawError) {
      console.error(
        "  ОШИБКА при получении сырого ответа Now Playing:",
        rawError
      );
    }

    console.log(
      "\n0.3 Тестируем СЫРОЙ ответ API для TV Show Details (id: 265235)..."
    );
    try {
      // const rawTVDetailsResponse = await rawApiClient.get<any>(`3/tv/265235`, {
      //   append_to_response: "keywords,alternative_titles,content_ratings",
      //   language: "ru",
      // });
      console.log("  ---> СЫРОЙ ответ API для TV Show Details:");
      // console.dir(rawTVDetailsResponse, { depth: null });
    } catch (rawError) {
      console.error(
        "  ОШИБКА при получении сырого ответа TV Show Details:",
        rawError
      );
    }

    console.log(
      "\n--- Теперь тесты с использованием MediaService и классов --- "
    );

    // --- ШАГ 1: Тестирование обработанных данных из MediaService ---
    console.log("\n1. Тестируем getPopularMovies() через MediaService...");
    const paginatedResult = await client.media.getPopularMovies(1);
    console.log(
      `  Успешно! Получено обработанных фильмов: ${paginatedResult.items.length}`
    );
    console.log(
      `  Страница: ${paginatedResult.page}, Всего страниц: ${paginatedResult.totalPages}, Всего результатов: ${paginatedResult.totalResults}`
    );
    if (paginatedResult.items.length > 0) {
      const firstMovie = paginatedResult.items[0];
      console.log(
        "  ---> Структура ПЕРВОГО ОБРАБОТАННОГО фильма из getPopularMovies:"
      );
      console.dir(firstMovie, { depth: 2 }); // Ограничим глубину для читаемости
      if (firstMovie instanceof Movie) {
        console.log(`    (Проверка) Title через getter: ${firstMovie.title}`);
        console.log(
          `    (Проверка) Poster URL через метод: ${firstMovie.getPosterUrl(
            "w185"
          )}`
        );
      }
    }

    console.log(
      "\n2. Тестируем getNowPlaying() (смешанный список) через MediaService..."
    );
    const paginatedResultNowPlaying = await client.media.getNowPlaying(1);
    console.log(
      `  Успешно! Получено обработанных элементов: ${paginatedResultNowPlaying.items.length}`
    );
    console.log(
      `  Страница: ${paginatedResultNowPlaying.page}, Всего страниц: ${paginatedResultNowPlaying.totalPages}, Всего результатов: ${paginatedResultNowPlaying.totalResults}`
    );
    if (paginatedResultNowPlaying.items.length > 0) {
      const firstItem = paginatedResultNowPlaying.items[0];
      console.log(
        "  ---> Структура ПЕРВОГО ОБРАБОТАННОГО элемента из getNowPlaying:"
      );
      console.dir(firstItem, { depth: 2 }); // Ограничим глубину
      if (firstItem instanceof Movie) {
        console.log(`    (Проверка) Тип: Фильм, Title: ${firstItem.title}`);
      } else if (firstItem instanceof TVShow) {
        console.log(`    (Проверка) Тип: Сериал, Name: ${firstItem.name}`);
      }
      console.log(
        `    (Проверка) Backdrop URL: ${firstItem.getBackdropUrl("w780")}`
      );
    }

    // --- ШАГ 3: Тестирование getTVShowDetails ---
    console.log(
      "\n3. Тестируем getTVShowDetails(id: 265235) через MediaService..."
    );
    const tvShowId = 265235;
    const tvShowDetails = await client.media.getTVShowDetails(tvShowId, {
      language: "ru",
      appendToResponse: ["keywords", "alternative_titles", "content_ratings"],
    });

    console.log(
      `  Успешно! Получен сериал: ${tvShowDetails.name} (ID: ${tvShowDetails.id})`
    );
    console.log("  ---> Структура ОБРАБОТАННОГО экземпляра TVShow:");
    console.dir(tvShowDetails, { depth: null }); // Используем null для максимальной глубины

    // Проверяем доступ к некоторым детальным полям через геттеры
    console.log(
      `    (Проверка) Количество сезонов: ${tvShowDetails.numberOfSeasons}`
    );
    console.log(`    (Проверка) Тип: ${tvShowDetails.type}`);
    console.log(
      `    (Проверка) Последний эпизод: ${
        tvShowDetails.lastEpisodeToAir?.name || "N/A"
      }`
    );
    console.log(
      `    (Проверка) Ключевые слова: ${
        tvShowDetails.keywords?.keywords?.map((k) => k.name).join(", ") || "N/A"
      }`
    );
    // Проверка детальной информации о сезонах
    if (tvShowDetails.seasons && tvShowDetails.seasons.length > 0) {
      const firstSeason = tvShowDetails.seasons[0];
      console.log(
        `    (Проверка) Первый сезон: ${firstSeason.name}, Эпизодов: ${firstSeason.episode_count}, Дата выхода: ${firstSeason.air_date}`
      );
      // console.dir(firstSeason); // Можно раскомментировать для деталей сезона
    }

    // --- ШАГ 4: Тестирование getMovieDetails ---
    console.log(
      "\n4. Тестируем getMovieDetails(id: 414906 - Бэтмен) через MediaService..."
    );
    const movieId = 414906;
    const movieDetails = await client.media.getMovieDetails(movieId, {
      language: "ru",
      // Добавим релевантные для фильма appendToResponse + дополнительные для полноты
      appendToResponse: [
        "keywords",
        "alternative_titles",
        "content_ratings",
        "release_dates",
        "videos",
        "credits",
        "watch/providers",
        "external_ids",
        "recommendations",
        "similar",
        "reviews",
        "images", // Добавим и картинки на всякий случай
      ],
    });

    console.log(
      `  Успешно! Получен фильм: ${movieDetails.title} (ID: ${movieDetails.id})`
    );
    console.log("  ---> Структура ОБРАБОТАННОГО экземпляра Movie:");
    console.dir(movieDetails, { depth: null }); // Максимальная глубина

    // --- Явный вывод всех полей для наглядности ---
    console.log("    --- Детальный разбор полей movieDetails ---");

    // Поля из MediaItem (базовые)
    console.log(`    ID: ${movieDetails.id}`);
    console.log(`    Title: ${movieDetails.title}`);
    console.log(`    Original Title: ${movieDetails.originalTitle}`);
    console.log(`    Overview: ${movieDetails.overview?.substring(0, 100)}...`); // Обрежем для краткости
    console.log(`    Adult: ${movieDetails.adult}`);
    console.log(`    Backdrop Path: ${movieDetails.backdropPath}`);
    console.log(`    Poster Path: ${movieDetails.posterPath}`);
    console.log(`    Popularity: ${movieDetails.popularity}`);
    console.log(`    Vote Average: ${movieDetails.voteAverage}`);
    console.log(`    Vote Count: ${movieDetails.voteCount}`);
    console.log(`    Original Language: ${movieDetails.originalLanguage}`);
    console.log(`    Status: ${movieDetails.status}`);
    console.log(`    Release Date: ${movieDetails.releaseDate}`);
    console.log(`    Video: ${movieDetails.video}`);

    // Поля из DetailedMediaBase (детальные общие)
    console.log(
      `    Genres: ${movieDetails.genres?.map((g) => g.name).join(", ")}`
    );
    console.log(`    Homepage: ${movieDetails.homepage || "N/A"}`);
    console.log(
      `    Production Companies: ${movieDetails.productionCompanies
        ?.map((c) => c.name)
        .join(", ")}`
    );
    console.log(
      `    Production Countries: ${movieDetails.productionCountries
        ?.map((c) => c.name)
        .join(", ")}`
    );
    console.log(
      `    Spoken Languages: ${movieDetails.spokenLanguages
        ?.map((l) => l.english_name)
        .join(", ")}`
    );
    console.log(`    Tagline: ${movieDetails.tagline || "N/A"}`);

    // Поля специфичные для Movie (детальные)
    console.log(
      `    Belongs to Collection: ${
        movieDetails.belongsToCollection ? "Yes (details in dir)" : "No"
      }`
    );
    console.log(`    Budget: ${movieDetails.budget ?? "N/A"}`);
    console.log(`    Revenue: ${movieDetails.revenue ?? "N/A"}`);
    console.log(`    Runtime: ${movieDetails.runtime ?? "N/A"}`);

    // Поля из appendToResponse
    console.log(
      `    Keywords: ${
        movieDetails.keywords?.keywords?.length ?? 0
      } keywords (details in dir)`
    );
    console.log(
      `    Alternative Titles: ${
        movieDetails.alternativeTitles?.titles?.length ?? 0
      } titles (details in dir)`
    );
    console.log(
      `    Content Ratings: ${
        movieDetails.contentRatings?.results?.length ?? 0
      } ratings (details in dir)`
    );
    console.log(
      `    Release Dates: ${
        movieDetails.releaseDates?.results?.length ?? 0
      } country dates (details in dir)`
    );
    console.log(
      `    Credits: ${movieDetails.credits?.cast?.length ?? 0} cast, ${
        movieDetails.credits?.crew?.length ?? 0
      } crew (details in dir)`
    );
    console.log(
      `    Videos: ${
        movieDetails.videos?.results?.length ?? 0
      } videos (details in dir)`
    );
    console.log(
      `    External IDs: IMDb=${
        movieDetails.externalIds?.imdb_id ?? "N/A"
      } (others in dir)`
    );
    console.log(
      `    Watch Providers: ${
        Object.keys(movieDetails.watchProviders?.results ?? {}).length
      } countries (details in dir)`
    );
    console.log(
      `    Recommendations: ${
        movieDetails.recommendations?.results?.length ?? 0
      } items (details in dir)`
    );
    console.log(
      `    Similar: ${
        movieDetails.similar?.results?.length ?? 0
      } items (details in dir)`
    );
    console.log(
      `    Reviews: ${
        movieDetails.reviews?.results?.length ?? 0
      } reviews (details in dir)`
    );
    console.log(
      `    Images: ${movieDetails.images?.posters?.length ?? 0} posters, ${
        movieDetails.images?.backdrops?.length ?? 0
      } backdrops, ${
        movieDetails.images?.logos?.length ?? 0
      } logos (details in dir)`
    );
    console.log("    --------------------------------------------");

    // Проверяем доступ к некоторым детальным полям через геттеры/методы (оставляем старые проверки для примера)
    console.log(
      `    (Проверка) Оригинальное название: ${movieDetails.originalTitle}`
    );
    console.log(`    (Проверка) Слоган: ${movieDetails.tagline || "N/A"}`);
    console.log(
      `    (Проверка) Постер (w500): ${movieDetails.getPosterUrl("w500")}`
    );
    console.log(`    (Проверка) Статус: ${movieDetails.status}`);
    console.log(
      `    (Проверка) Ключевые слова: ${
        movieDetails.keywords?.keywords?.map((k) => k.name).join(", ") || "N/A"
      }`
    );

    // Дополнительные проверки полей из appendToResponse
    console.log(
      `    (Проверка) Актеры (cast size): ${
        movieDetails.credits?.cast?.length ?? "N/A"
      }`
    );
    console.log(
      `    (Проверка) Видео (results size): ${
        movieDetails.videos?.results?.length ?? "N/A"
      }`
    );
    console.log(
      `    (Проверка) IMDb ID (external_ids): ${
        movieDetails.externalIds?.imdb_id ?? "N/A"
      }`
    );
    console.log(
      `    (Проверка) Рекомендации (results size): ${
        movieDetails.recommendations?.results?.length ?? "N/A"
      }`
    );
    console.log(
      `    (Проверка) Похожие (results size): ${
        movieDetails.similar?.results?.length ?? "N/A"
      }`
    );

    // --- Тестирование новых методов ---
    const directors = movieDetails.getDirectors();
    const cast = movieDetails.getCast();
    console.log(
      `    (Метод) Режиссеры: ${
        directors.map((d) => d.name).join(", ") || "N/A"
      }`
    );
    console.log(
      `    (Метод) Первые 5 актеров: ${
        cast
          .slice(0, 5)
          .map((a) => `${a.name} (${a.character})`)
          .join(", ") || "N/A"
      }`
    );

    // --- ШАГ 5: Тестирование PersonDetails ---
    console.log(
      "\n5. Тестируем client.person.getPersonDetails(id: 2524 - Tom Hardy) с кредитами..."
    );
    const personId = 2524;
    const personDetails = await client.person.getPersonDetails(personId, {
      language: "ru",
      appendToResponse: ["combined_credits"],
    });

    console.log(
      `  Успешно! Получены детали персоны: ${personDetails.name} (ID: ${personDetails.id})`
    );
    console.log("  ---> Структура ОБРАБОТАННОГО экземпляра Person:");
    console.dir(personDetails, { depth: null }); // Выводим весь объект

    // Проверки основных полей
    console.log("    --- Детальный разбор полей personDetails ---");
    console.log(`    ID: ${personDetails.id}`);
    console.log(`    Имя: ${personDetails.name}`);
    console.log(`    Adult: ${personDetails.adult}`);
    console.log(
      `    Также известен как: ${personDetails.alsoKnownAs.join(", ")}`
    );
    console.log(
      `    Биография (начало): ${personDetails.biography?.substring(0, 150)}...`
    );
    console.log(`    День рождения: ${personDetails.birthday || "N/A"}`);
    console.log(`    День смерти: ${personDetails.deathday || "N/A"}`);
    console.log(`    Пол (1:Ж, 2:М): ${personDetails.gender}`);
    console.log(`    Homepage: ${personDetails.homepage || "N/A"}`);
    console.log(`    IMDb ID: ${personDetails.imdbId || "N/A"}`);
    console.log(
      `    Известен по департаменту: ${personDetails.knownForDepartment}`
    );
    console.log(`    Место рождения: ${personDetails.placeOfBirth || "N/A"}`);
    console.log(`    Популярность: ${personDetails.popularity}`);
    console.log(`    Путь к фото профиля: ${personDetails.profilePath}`);
    console.log(`    URL фото (w185): ${personDetails.getProfileUrl("w185")}`);
    console.log("    --------------------------------------------");

    // Проверки кредитов (если есть)
    console.log(
      `    (Проверка) Количество ролей (cast): ${personDetails.castCredits.length}`
    );
    if (personDetails.castCredits.length > 0) {
      const firstCastCredit = personDetails.castCredits[0];
      console.log(
        `      ---> Первая роль: ${firstCastCredit.character} в ${
          firstCastCredit.media instanceof Movie
            ? firstCastCredit.media.title
            : firstCastCredit.media.name
        }`
      );
      console.log(
        `           Медиа ID: ${firstCastCredit.media.id}, Тип: ${
          firstCastCredit.media instanceof Movie ? "Movie" : "TVShow"
        }`
      );
    }

    console.log(
      `    (Проверка) Количество работ (crew): ${personDetails.crewCredits.length}`
    );
    if (personDetails.crewCredits.length > 0) {
      const firstCrewCredit = personDetails.crewCredits[0];
      console.log(
        `      ---> Первая работа: ${firstCrewCredit.job} (${
          firstCrewCredit.department
        }) в ${
          firstCrewCredit.media instanceof Movie
            ? firstCrewCredit.media.title
            : firstCrewCredit.media.name
        }`
      );
      console.log(
        `           Медиа ID: ${firstCrewCredit.media.id}, Тип: ${
          firstCrewCredit.media instanceof Movie ? "Movie" : "TVShow"
        }`
      );
    }

    console.log("\nТесты успешно завершены!");
  } catch (error) {
    console.error("\n--- ОШИБКА ВО ВРЕМЯ ТЕСТА СЕРВИСОВ ---");
    if (error instanceof ApiError) {
      console.error(`  Тип ошибки: ApiError`);
      console.error(`  Статус код: ${error.statusCode || "N/A"}`);
      console.error(`  Сообщение: ${error.message}`);
      if (error.apiMessage) {
        console.error(`  Ответ API: ${error.apiMessage}`);
      }
    } else if (error instanceof Error) {
      console.error(`  Тип ошибки: ${error.name}`);
      console.error(`  Сообщение: ${error.message}`);
      console.error(`  Стек: ${error.stack}`);
    } else {
      console.error("  Неизвестный тип ошибки:", error);
    }
    console.error("------------------------------------");
  }
}

runTest();
