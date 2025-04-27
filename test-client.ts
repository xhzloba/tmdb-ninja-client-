// test-client.ts (упрощенный для проверки импорта)
// Запуск: ts-node test-client.ts (из корневой папки проекта)

import {
  createNinjaClient,
  ApiClient,
  ApiError,
  Movie,
  TVShow,
  ImageConfig,
} from "./src/index";

console.log("---> Импорт из ./src/index прошел успешно!");

// Создаем отдельный ApiClient ТОЛЬКО для теста сырых запросов
const rawApiClient = new ApiClient("https://tmdb.kurwa-bober.ninja/");

// Создаем обычный клиент для теста сервисов
const client = createNinjaClient();

async function runTest() {
  console.log("Запускаем тест API клиента...");

  try {
    // --- ШАГ 0: Тестирование СЫРЫХ ответов API ---
    console.log(
      "\n0.1 Тестируем СЫРОЙ ответ API для Popular Movies (cat=movie&sort=top)..."
    );
    try {
      const rawPopularMoviesResponse = await rawApiClient.get<any>("", {
        cat: "movie",
        sort: "top",
        page: 1,
      });
      console.log("  ---> СЫРОЙ ответ API для Popular Movies:");
      console.dir(rawPopularMoviesResponse, { depth: null });
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
      const rawNowPlayingResponse = await rawApiClient.get<any>("", {
        sort: "now_playing",
        page: 1,
      });
      console.log("  ---> СЫРОЙ ответ API для Now Playing:");
      console.dir(rawNowPlayingResponse, { depth: null });
    } catch (rawError) {
      console.error(
        "  ОШИБКА при получении сырого ответа Now Playing:",
        rawError
      );
    }

    console.log(
      "\n--- Теперь тесты с использованием MediaService и классов --- "
    );

    // --- ШАГ 1: Тестирование обработанных данных из MediaService ---
    console.log("\n1. Тестируем getPopularMovies() через MediaService...");
    const popularMovies = await client.media.getPopularMovies(1);
    console.log(
      `  Успешно! Получено обработанных фильмов: ${popularMovies.items.length}`
    );
    console.log(
      `  Страница: ${popularMovies.page}, Всего страниц: ${popularMovies.totalPages}, Всего результатов: ${popularMovies.totalResults}`
    );
    if (popularMovies.items.length > 0) {
      const firstMovie = popularMovies.items[0];
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
    const nowPlaying = await client.media.getNowPlaying(1);
    console.log(
      `  Успешно! Получено обработанных элементов: ${nowPlaying.items.length}`
    );
    console.log(
      `  Страница: ${nowPlaying.page}, Всего страниц: ${nowPlaying.totalPages}, Всего результатов: ${nowPlaying.totalResults}`
    );
    if (nowPlaying.items.length > 0) {
      const firstItem = nowPlaying.items[0];
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
