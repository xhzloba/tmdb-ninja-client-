// examples/vanilla-js-example.js

// Убираем импорт, так как библиотека подключена через <script>
// import { createNinjaClient, Movie, ApiError } from 'tmdb-ninja-client';

// Получаем доступ к библиотеке через глобальную переменную (имя из rollup.config.js)
const { createNinjaClient, Movie, ApiError } = window.tmdbNinjaClient;

// Проверка, что библиотека загрузилась
if (!createNinjaClient) {
  throw new Error(
    "Библиотека tmdbNinjaClient не найдена! Убедитесь, что файл ../dist/tmdb-ninja-client.umd.js подключен перед этим скриптом."
  );
}

// Получаем ссылки на DOM-элементы
const movieListElement = document.getElementById("movie-list");
const loadMoreBtn = document.getElementById("load-more-btn");
const statusMessagesElement = document.getElementById("status-messages");

// Создаем клиент
const client = createNinjaClient();

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
      if (currentPage >= totalPages && movieListElement?.children.length > 0) {
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
