// examples/vanilla-js-example.js

// Убираем импорт, так как библиотека подключена через <script>
// import { createNinjaClient, Movie, ApiError } from 'tmdb-ninja-client';

// Проверяем, загрузилась ли библиотека под новым именем
if (!window.tmdbXhzloba) {
  console.error("Библиотека tmdbXhzloba не загружена!");
  setStatus("Ошибка: Библиотека не загружена!");
} else {
  // Получаем доступ к функциям через новое имя
  const { createXhZlobaClient, ApiError, ImageConfig } = window.tmdbXhzloba;

  // --- Конфигурация и Инициализация ---
  const API_KEY = "4ef0d7355d9ffb5151e987764708ce96"; // ВАЖНО: Используйте свой ключ!
  const BASE_URL = "https://tmdb.kurwa-bober.ninja/";

  // Используем переименованную функцию для создания клиента
  const client = createXhZlobaClient(BASE_URL, API_KEY);

  // Получаем ссылки на DOM-элементы
  const movieListElement = document.getElementById("movie-list");
  const loadMoreBtn = document.getElementById("load-more-btn");
  const statusMessagesElement = document.getElementById("status-messages");
  const detailsContainerElement = document.getElementById("details-container"); // Получаем контейнер деталей

  // Переменные для отслеживания состояния пагинации и загрузки
  let currentPage = 0; // Начнем с 0, чтобы первый вызов был для page=1
  let totalPages = 0;
  let isLoading = false;

  // Функция для отображения сообщений о статусе или ошибке
  function showStatus(message, isError = false) {
    if (!statusMessagesElement) return;
    statusMessagesElement.textContent = message;
    statusMessagesElement.className = isError ? "status error" : "status";
  }

  // Функция для создания HTML-разметки одного фильма
  function createMovieElement(movie) {
    const li = document.createElement("li");
    li.setAttribute("data-movie-id", movie.id); // Добавляем ID для клика
    const posterUrl = movie.getPosterUrl("w185") || ""; // Получаем URL постера

    li.innerHTML = `
          <img src="${posterUrl}" alt="Постер ${
      movie.title
    }" loading="lazy" onerror="this.style.display='none'"> 
          <h2>${movie.title} (${movie.releaseDate || "N/A"})</h2>
          <p><strong>Рейтинг:</strong> ${
            movie.voteAverage?.toFixed(1) || "N/A"
          } / 10</p>
         <p>${movie.releaseQuality || "N/A"}</p>
          <p>${movie.overview || "Нет описания."}</p>
          <div style="clear: both;"></div>
      `;
    // Добавляем обработчик ошибок к img, если он не загрузился
    const img = li.querySelector("img");
    if (img) {
      img.onerror = () => {
        img.style.display = "none"; // Скрываем img, если постер не загрузился
      };
    }
    return li;
  }

  // --- Обработчик клика на список фильмов ---
  if (movieListElement) {
    movieListElement.addEventListener("click", (event) => {
      // Ищем родительский LI элемент, на который кликнули
      const clickedLi = event.target.closest("li[data-movie-id]");
      if (clickedLi) {
        const movieId = clickedLi.getAttribute("data-movie-id");
        if (movieId) {
          displayMovieDetails(parseInt(movieId, 10));
        }
      }
    });
  }

  // Асинхронная функция для загрузки и отображения фильмов
  async function fetchAndDisplayMovies(page) {
    if (isLoading) return; // Предотвращаем параллельные запросы

    isLoading = true;
    showStatus("Загрузка...");
    if (loadMoreBtn) loadMoreBtn.style.display = "none"; // Скрываем кнопку во время загрузки

    try {
      const result = await client.media.getPopularMovies(page);

      // Добавляем фильмы в список
      result.items.forEach((movie) => {
        if (movieListElement) {
          movieListElement.appendChild(createMovieElement(movie));
        }
      });

      // Обновляем состояние пагинации
      currentPage = result.page;
      totalPages = result.totalPages;

      showStatus(""); // Очищаем статус

      // Показываем или скрываем кнопку "Загрузить еще"
      if (currentPage < totalPages && loadMoreBtn) {
        loadMoreBtn.style.display = "block";
      } else {
        if (loadMoreBtn) loadMoreBtn.style.display = "none";
        if (
          currentPage >= totalPages &&
          movieListElement?.children.length > 0
        ) {
          showStatus("Все фильмы загружены.");
        }
      }
    } catch (error) {
      console.error("Ошибка при загрузке фильмов:", error);
      let errorMessage = "Произошла неизвестная ошибка";
      if (error instanceof ApiError) {
        errorMessage = `Ошибка API (${error.statusCode || "N/A"}): ${
          error.message
        }`;
      } else if (error instanceof Error) {
        errorMessage = `Ошибка: ${error.message}`;
      }
      showStatus(errorMessage, true);
      // Сбрасываем пагинацию при ошибке
      currentPage = 0;
      totalPages = 0;
      if (loadMoreBtn) loadMoreBtn.style.display = "none";
    } finally {
      isLoading = false;
    }
  }

  // Добавляем обработчик на кнопку
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        fetchAndDisplayMovies(currentPage + 1);
      }
    });
  }

  // Загружаем первую страницу при старте
  fetchAndDisplayMovies(1);

  // --- Функция для отображения деталей фильма ---
  let isDetailsLoading = false; // Отдельный флаг загрузки для деталей

  // Хелпер для форматирования объекта в HTML (улучшенный для массивов)
  function formatObjectToHtml(obj, depth = 0) {
    // Ограничение глубины рекурсии для предотвращения бесконечных циклов
    if (depth > 5) return "<em>[Max depth reached]</em>";

    let html =
      '<ul style="margin-left: ' +
      depth * 15 +
      'px; border-left: 1px dashed #ccc; padding-left: 10px;">';
    for (const [key, value] of Object.entries(obj)) {
      // Пропускаем служебные поля, начинающиеся с # (если вдруг они есть)
      if (typeof key === "string" && key.startsWith("#")) continue;

      html += '<li style="margin-bottom: 3px;"><strong>' + key + ":</strong> ";
      if (value === null || value === undefined) {
        html += "<em>null/undefined</em>";
      } else if (Array.isArray(value)) {
        // Обработка массивов
        html += " Array [" + value.length + " items]";
        if (value.length > 0) {
          html +=
            '<ul style="margin-left: 15px; border-left: 1px solid #eee; padding-left: 5px;">';
          // Отображаем каждый элемент массива
          value.forEach((item, index) => {
            html +=
              '<li style="margin-bottom: 2px;"><strong>' +
              index +
              ":</strong> ";
            if (typeof item === "object" && item !== null) {
              html += formatObjectToHtml(item, depth + 1); // Рекурсия для объектов в массиве
            } else {
              html += String(item);
            }
            html += "</li>";
          });
          html += "</ul>";
        }
      } else if (typeof value === "object" && value !== null) {
        // Рекурсивно для вложенных объектов
        html += formatObjectToHtml(value, depth + 1);
      } else {
        html += String(value);
      }
      html += "</li>";
    }
    html += "</ul>";
    return html;
  }

  async function displayMovieDetails(movieId) {
    if (isDetailsLoading || !detailsContainerElement) return;
    isDetailsLoading = true;
    detailsContainerElement.innerHTML = "<p><i>Загрузка деталей...</i></p>";

    try {
      // Запрашиваем все возможные поля (оставляем как есть)
      const allAppendToResponse = [
        "keywords",
        "alternative_titles",
        "content_ratings",
        "release_dates",
        "credits",
        "videos",
        "external_ids",
        "watch/providers",
        "recommendations",
        "similar",
        "reviews",
        "images",
      ];
      const movieDetails = await client.media.getMovieDetails(movieId, {
        language: "ru",
        appendToResponse: allAppendToResponse,
      });

      console.log("Детали фильма получены:", movieDetails);

      // --- Формируем подробный HTML ---
      let detailsHtml = `<h3>${movieDetails.title} (${movieDetails.originalTitle})</h3>`;

      // Слоган и Обзор
      detailsHtml += `<p><strong>Слоган:</strong> ${
        movieDetails.tagline || "N/A"
      }</p>`;
      detailsHtml += `<p><strong>Обзор:</strong> ${
        movieDetails.overview || "N/A"
      }</p>`;
      detailsHtml += "<hr>";

      // Постер и Фон (показываем URL и маленькую картинку)
      detailsHtml += `<h4>Изображения:</h4>`;
      const posterUrl = movieDetails.getPosterUrl("w185");
      const backdropUrl = movieDetails.getBackdropUrl("w300");
      detailsHtml += `<p style="display: flex; align-items: flex-start; gap: 15px;">`;
      if (posterUrl) {
        detailsHtml += `<span><img src="${posterUrl}" alt="Постер" style="max-width: 80px; height: auto; border: 1px solid #ccc;"><br><small>Постер (w185)</small></span>`;
      }
      if (backdropUrl) {
        detailsHtml += `<span><img src="${backdropUrl}" alt="Фон" style="max-width: 150px; height: auto; border: 1px solid #ccc;"><br><small>Фон (w300)</small></span>`;
      }
      detailsHtml += `</p>`;

      // Основная информация
      detailsHtml += `<h4>Основная информация:</h4><ul>`;
      detailsHtml += `<li><strong>Статус:</strong> ${
        movieDetails.status || "N/A"
      }</li>`;
      detailsHtml += `<li><strong>Дата релиза:</strong> ${
        movieDetails.releaseDate || "N/A"
      }</li>`;
      detailsHtml += `<li><strong>Продолжительность:</strong> ${
        movieDetails.runtime ? movieDetails.runtime + " мин." : "N/A"
      }</li>`;
      detailsHtml += `<li><strong>Жанры:</strong> ${
        movieDetails.genres?.map((g) => g.name).join(", ") || "N/A"
      }</li>`;
      detailsHtml += `<li><strong>Ориг. язык:</strong> ${
        movieDetails.originalLanguage || "N/A"
      }</li>`;
      detailsHtml += `<li><strong>Бюджет:</strong> ${
        movieDetails.budget ? "$" + movieDetails.budget.toLocaleString() : "N/A"
      }</li>`;
      detailsHtml += `<li><strong>Сборы:</strong> ${
        movieDetails.revenue
          ? "$" + movieDetails.revenue.toLocaleString()
          : "N/A"
      }</li>`;
      detailsHtml += `<li><strong>Для взрослых:</strong> ${
        movieDetails.adult ? "Да" : "Нет"
      }</li>`;
      detailsHtml += `</ul>`;

      // Рейтинги
      detailsHtml += `<h4>Рейтинги:</h4><ul>`;
      detailsHtml += `<li><strong>TMDB:</strong> ${movieDetails.voteAverage?.toFixed(
        1
      )} / 10 (${movieDetails.voteCount} голосов)</li>`;
      // Добавляем рейтинги из прокси, если они есть
      if (movieDetails.kp_rating)
        detailsHtml += `<li><strong>КиноПоиск:</strong> ${
          movieDetails.kp_rating
        } (ID: ${movieDetails.kinopoisk_id || "N/A"})</li>`;
      if (movieDetails.imdb_rating)
        detailsHtml += `<li><strong>IMDb:</strong> ${
          movieDetails.imdb_rating
        } (ID: ${movieDetails.imdb_id || "N/A"})</li>`;
      // Внешний ID IMDb (если есть)
      if (movieDetails.externalIds?.imdb_id)
        detailsHtml += `<li><strong>IMDb Link:</strong> <a href="https://www.imdb.com/title/${movieDetails.externalIds.imdb_id}/" target="_blank">${movieDetails.externalIds.imdb_id}</a></li>`;
      // Возрастной рейтинг РФ (пример, нужно найти в данных)
      const ruRating = movieDetails.contentRatings?.results?.find(
        (r) => r.iso_3166_1 === "RU"
      )?.rating;
      if (ruRating)
        detailsHtml += `<li><strong>Возраст (РФ):</strong> ${ruRating}</li>`;
      detailsHtml += `</ul>`;

      // Команда (Режиссеры, Ключевые актеры)
      detailsHtml += `<h4>Команда:</h4><ul>`;
      detailsHtml += `<li><strong>Режиссеры:</strong> ${
        movieDetails
          .getDirectors()
          .map((d) => d.name)
          .join(", ") || "N/A"
      }</li>`;
      const cast = movieDetails.getCast();
      if (cast.length > 0) {
        detailsHtml += `<li><strong>В ролях:</strong> ${cast
          .slice(0, 8)
          .map((a) => a.name)
          .join(", ")} ${cast.length > 8 ? "..." : ""}</li>`;
      } else {
        detailsHtml += `<li><strong>В ролях:</strong> N/A</li>`;
      }
      detailsHtml += `</ul>`;

      // Видео (Первый трейлер)
      const trailer = movieDetails.videos?.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (trailer) {
        detailsHtml += `<h4>Трейлер:</h4>`;
        detailsHtml += `<p><a href="https://www.youtube.com/watch?v=${trailer.key}" target="_blank">${trailer.name} (YouTube)</a></p>`;
      }

      // Ключевые слова
      if (movieDetails.keywords?.keywords?.length > 0) {
        detailsHtml += `<h4>Ключевые слова:</h4>`;
        detailsHtml += `<p><small>${movieDetails.keywords.keywords
          .slice(0, 15)
          .map((k) => k.name)
          .join(", ")} ${
          movieDetails.keywords.keywords.length > 15 ? "..." : ""
        }</small></p>`;
      }

      // Логотип (если есть)
      const logo = movieDetails.images?.logos?.[0];
      if (logo && logo.file_path) {
        // Используем новый метод getLogoUrl
        const logoUrl = movieDetails.getLogoUrl(logo.file_path, "w154");
        if (logoUrl) {
          detailsHtml += `<h4>Логотип:</h4>`;
          detailsHtml += `<p><img src="${logoUrl}" alt="Логотип" style="max-height: 40px; width: auto; background: #ddd; padding: 5px;"></p>`;
        }
      }

      // Похожие фильмы
      const similar = movieDetails.similar?.results;
      if (similar && similar.length > 0) {
        detailsHtml += `<h4>Похожие (${movieDetails.similar.total_results}):</h4>`;
        detailsHtml += `<p><small>${similar
          .slice(0, 6)
          .map((m) => m.title || m.name)
          .join(", ")} ${similar.length > 6 ? "..." : ""}</small></p>`;
      }

      // Рекомендованные фильмы
      const recommendations = movieDetails.recommendations?.results;
      if (recommendations && recommendations.length > 0) {
        detailsHtml += `<h4>Рекомендации (${movieDetails.recommendations.total_results}):</h4>`;
        detailsHtml += `<p><small>${recommendations
          .slice(0, 6)
          .map((m) => m.title || m.name)
          .join(", ")} ${recommendations.length > 6 ? "..." : ""}</small></p>`;
      }

      // --- Конец расширенной секции ---
      detailsHtml += "<hr>";
      detailsHtml += "<h4>Все поля объекта (raw data):</h4>";
      // Выводим все остальные поля объекта через formatObjectToHtml
      detailsHtml += formatObjectToHtml(movieDetails);

      detailsContainerElement.innerHTML = detailsHtml;
    } catch (error) {
      console.error("Ошибка при загрузке деталей фильма:", error);
      let errorMessage = "Произошла неизвестная ошибка";
      if (error instanceof ApiError) {
        errorMessage = `Ошибка API (${error.statusCode || "N/A"}): ${
          error.message
        }`;
      } else if (error instanceof Error) {
        errorMessage = `Ошибка: ${error.message}`;
      }
      detailsContainerElement.innerHTML =
        '<p class="error">' + errorMessage + "</p>";
    } finally {
      isDetailsLoading = false;
    }
  }
}
