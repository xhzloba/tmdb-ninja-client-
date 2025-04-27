# ✨ xhzloba TMDB Proxy Client - Твой Помощник в Мире Кино!

Представь, что у тебя есть волшебная коробка, которая знает всё про фильмы и сериалы с сайта TMDB (The Movie Database), но получает информацию через специальный адрес прокси.

Эта библиотека - твой удобный пульт управления для этой коробки!

## Что она умеет?

- 🍿 **Узнавать про фильмы и сериалы:** Какие сейчас популярные? Что нового? Кто снимался? Какой рейтинг?
- 🖼️ **Показывать картинки:** Дает правильные ссылки на постеры, фоны, логотипы.
- 🇷🇺 **Работать с русским языком:** Может запрашивать информацию на русском.
- ✨ **Понимать доп. инфо:** добавляет что-то свое (например, ID Кинопоиска), библиотека это поймет.
- ⚙️ **Легко использоваться:** Можно подключить к простому сайту или к большому проекту.

## Как получить эту Коробку?

Попроси свой компьютер установить её:

```bash
npm install tmdb-xhzloba
# или если используешь yarn:
yarn add tmdb-xhzloba
```

## Как Включить и Пользоваться? (Самое Простое)

Сначала тебе нужен твой **секретный ключ API** (API Key) от TMDB. Без него магия не сработает.

Потом нужно получить **пульт управления** (`client`). Вот как это сделать:

**Вариант 1: Для простого HTML сайта (через `<script>`)**

1.  Скачай файл `dist/tmdb-xhzloba.umd.js` из библиотеки.
2.  Положи его рядом со своим HTML файлом.
3.  В HTML добавь перед закрывающим `</body>`:

    ```html
    <script src="tmdb-xhzloba.umd.js"></script>
    <script>
      const MY_API_KEY = "СЮДА_ВСТАВЬ_СВОЙ_API_КЛЮЧ";

      // Проверяем, появилась ли наша магия
      if (window.tmdbXhzloba) {
        // Достаем из нее пульт
        const { createXhZlobaClient, ApiError, Movie, TVShow } =
          window.tmdbXhzloba;

        // Включаем пульт!
        const client = createXhZlobaClient(MY_API_KEY);
        console.log("Пульт готов!", client);

        // Теперь можно им пользоваться!
        // Например, попросим популярные штуки:
        client.media
          .getPopular()
          .then((data) => {
            console.log("Вот что популярно:", data.items);
          })
          .catch((error) => console.error("Ой, ошибка:", error));
      } else {
        console.error("Магия не загрузилась! Проверь путь к файлу.");
      }
    </script>
    ```

**Вариант 2: Для HTML сайта поновее (через `<script type="module">`)**

Тебе даже не нужно ничего скачивать! Можно подключить прямо из интернета (CDN unpkg).

```html
<script type="module">
  // Загружаем пульт и другие нужные штуки
  import {
    createXhZlobaClient,
    ApiError,
    Movie,
    TVShow,
  } from "https://unpkg.com/tmdb-xhzloba@latest/dist/index.esm.js";
  // Ссылка на последнюю версию: https://unpkg.com/tmdb-xhzloba@latest/dist/index.esm.js
  // Для стабильности лучше заменить @latest на номер версии, например @1.0.5

  const MY_API_KEY = "СЮДА_ВСТАВЬ_СВОЙ_API_КЛЮЧ";

  // Включаем пульт!
  const client = createXhZlobaClient(MY_API_KEY);
  console.log("Пульт готов!", client);

  // Пробуем попросить популярные штуки:
  async function showPopular() {
    try {
      const popular = await client.media.getPopular();
      console.log("Вот что популярно:", popular.items);
    } catch (error) {
      console.error("Ой, ошибка:", error);
    }
  }
  showPopular();
</script>
```

**Вариант 3: Для Node.js или проектов со сборщиками (Webpack, Vite и т.д.)**

Просто импортируй и используй:

```javascript
import { createXhZlobaClient, ApiError, Movie, TVShow } from "tmdb-xhzloba";

const MY_API_KEY = "СЮДА_ВСТАВЬ_СВОЙ_API_КЛЮЧ";

// Включаем пульт!
const client = createXhZlobaClient(MY_API_KEY);

// Используем:
client.media
  .getPopular()
  .then((data) => console.log(data.items))
  .catch((error) => console.error(error));
```

*(Примечание: По умолчанию пульт использует адрес прокси `https://tmdb.kurwa-bober.ninja/`. Чтобы использовать этот адрес, просто передай **только** API ключ: `createXhZlobaClient('ТВОЙ_API*КЛЮЧ')`. Если тебе нужен другой адрес, передай его **первым** аргументом, а API ключ **вторым**: `createXhZlobaClient('https://твой.адрес.прокси/', 'ТВОЙ*API*КЛЮЧ')`)\_

## Что Умеет Пульт? (Кнопки на `client.media`)

У пульта есть секция `media` - она для фильмов и сериалов.

- **`client.media.getPopular( [номер_страницы] )`**

  - 🤔 **Что делает:** Просит список **самых популярных** фильмов и сериалов. По умолчанию дает первую страницу, но можно попросить и другие (`getPopular(2)`).
  - ✅ **Что вернет:** Список (`items`) фильмов (`Movie`) и сериалов (`TVShow`), а также информацию о страницах.
  - ```javascript
    client.media.getPopular().then((data) => console.log(data.items));
    ```

- **`client.media.getLatest( [номер_страницы] )`**

  - 🤔 **Что делает:** Просит список **последних добавленных** на сервер фильмов и сериалов (сортировка `latest`). По умолчанию дает первую страницу.
  - ✅ **Что вернет:** Список (`items`) фильмов (`Movie`) и сериалов (`TVShow`), а также информацию о страницах.
  - ```javascript
    client.media
      .getLatest()
      .then((data) => console.log("Последние добавленные:", data.items));
    ```

- **`client.media.getLatestMovies( [номер_страницы] )`**

  - 🤔 **Что делает:** Просит список **только последних добавленных фильмов** (`cat=movie`, `sort=latest`).
  - ✅ **Что вернет:** Список (`items`) **только** фильмов (`Movie`), обернутый в `PaginatedMovieResult`.
  - ```javascript
    client.media
      .getLatestMovies()
      .then((data) => console.log("Последние фильмы:", data.items));
    ```

- **`client.media.getLatestTvShows( [номер_страницы] )`**

  - 🤔 **Что делает:** Просит список **только последних добавленных сериалов** (`cat=tv`, `sort=latest`).
  - ✅ **Что вернет:** Список (`items`) **только** сериалов (`TVShow`), обернутый в `PaginatedTVShowResult`.
  - ```javascript
    client.media
      .getLatestTvShows()
      .then((data) => console.log("Последние сериалы:", data.items));
    ```

- **`client.media.getNowPlaying( [номер_страницы] )`**

  - 🤔 **Что делает:** Просит список того, что **сейчас актуально** (например, идет в кино или только вышло). Тоже можно указать страницу.
  - ✅ **Что вернет:** Список (`items`) фильмов (`Movie`) и сериалов (`TVShow`).
  - ```javascript
    client.media.getNowPlaying().then((data) => console.log(data.items));
    ```

- **`client.media.getNowPlayingMovies( [номер_страницы] )`**

  - 🤔 **Что делает:** Просит список **только фильмов**, которые **сейчас актуальны** (`cat=movie`, `sort=now_playing`).
  - ✅ **Что вернет:** Список (`items`) **только** фильмов (`Movie`), обернутый в `PaginatedMovieResult`.
  - ```javascript
    client.media
      .getNowPlayingMovies()
      .then((data) => console.log("Фильмы сейчас в прокате:", data.items));
    ```

- **`client.media.getNowPlayingTvShows( [номер_страницы] )`**

  - 🤔 **Что делает:** Просит список **только сериалов**, которые **сейчас актуальны** (`cat=tv`, `sort=now_playing`).
  - ✅ **Что вернет:** Список (`items`) **только** сериалов (`TVShow`), обернутый в `PaginatedTVShowResult`.
  - ```javascript
    client.media
      .getNowPlayingTvShows()
      .then((data) => console.log("Сериалы сейчас в эфире:", data.items));
    ```

- **`client.media.getMovieDetails( ID_фильма, [доп_опции] )`**

  - 🤔 **Что делает:** Просит **все подробности** про один конкретный фильм. Нужно знать его ID.
  - ⚙️ **Доп. опции:** Можно попросить информацию на другом языке (`{ language: 'en-US' }`) или дополнительные детали (`{ appendToResponse: ['credits', 'videos'] }`).
  - ✅ **Что вернет:** Объект `Movie` со всей информацией.
  - ```javascript
    client.media.getMovieDetails(550).then((movie) => console.log(movie.title)); // 550 - это ID Бойцовского клуба
    ```

- **`client.media.getTVShowDetails( ID_сериала, [доп_опции] )`**

  - 🤔 **Что делает:** Просит **все подробности** про один конкретный сериал. Нужно знать его ID.
  - ⚙️ **Доп. опции:** Такие же, как у `getMovieDetails`.
  - ✅ **Что вернет:** Объект `TVShow` со всей информацией.
  - ```javascript
    client.media
      .getTVShowDetails(1399)
      .then((tvShow) => console.log(tvShow.name)); // 1399 - это ID Игры Престолов
    ```

**Что такое `appendToResponse` (Дополнительные детали)?**

Когда просишь детали (`getMovieDetails` или `getTVShowDetails`), можно добавить волшебное слово `appendToResponse` и перечислить, что еще хочешь узнать сразу:

- `'credits'`: Кто снимался (актеры `cast`) и кто делал (команда `crew`).
- `'videos'`: Ссылки на трейлеры и другие видео.
- `'images'`: Больше картинок (постеры, фоны, логотипы).
- `'keywords'`: Ключевые слова (теги), описывающие фильм/сериал.
- `'recommendations'`: Что еще похожего посмотреть (рекомендации).
- `'similar'`: Похожие фильмы/сериалы.
- `'reviews'`: Что пишут зрители.
- `'external_ids'`: ID на других сайтах (IMDb, Wikidata...).
- `'watch/providers'`: Где можно легально посмотреть онлайн (если известно).
- ... и некоторые другие.

Пример запроса с доп. деталями:

```javascript
client.media
  .getMovieDetails(550, {
    language: "ru",
    appendToResponse: ["credits", "videos", "images"],
  })
  .then((movie) => {
    console.log("Актеры:", movie.credits.cast);
    console.log("Видео:", movie.videos.results);
    console.log("Картинки:", movie.images);
  });
```

## Что Внутри Фильма или Сериала?

Когда ты получаешь информацию, она приходит в виде специальных объектов: `Movie` (для фильма) или `TVShow` (для сериала). Внутри них лежат разные полезные поля и есть удобные функции (методы).

**Общая Информация (есть и у Фильмов, и у Сериалов):**

- `id`: Уникальный номер (ID).
- `overview`: Краткое описание сюжета. 📝
- `popularity`: Насколько популярен (число).
- `voteAverage`: Средняя оценка (от 0 до 10). ⭐
- `voteCount`: Сколько людей проголосовало.
- `posterPath`: Кусочек ссылки на **главный постер** (картинку).
- `backdropPath`: Кусочек ссылки на **главный фон** (картинку).
- `adult`: Это для взрослых (18+)? (`true` или `false`).
- `originalLanguage`: На каком языке сняли изначально (код, например `'en'`).
- `status`: Что с ним сейчас? ('Вышел', 'Идет показ', 'Закончился').
- **Поля от Прокси (если есть):**
  - `names`: Список названий (может быть русское и оригинальное).
  - `pgRating`: Возрастной рейтинг (число).
  - `releaseQuality`: Качество релиза (например, 'webdl').
  - `kinopoiskId`, `kpRating`: ID и рейтинг Кинопоиска.
  - `imdbId`, `imdbRating`: ID и рейтинг IMDb.
  - `lastAirDate`: Дата последнего показа (иногда есть и у фильмов).
- **Дополнительные Детали (если запрашивали `appendToResponse`):**
  - `genres`: Список жанров (драма, комедия...).
  - `credits`: Актеры (`cast`) и команда (`crew`).
  - `images`: Дополнительные картинки (`posters`, `backdrops`, `logos`).
  - `videos`: Список видео (`results`).
  - `keywords`: Ключевые слова (`keywords`).
  - `recommendations`, `similar`: Списки похожих (`results`).
  - `reviews`: Обзоры (`results`).
  - ... и другие, если запрашивали.

**Полезные Функции (Методы) у Всех:**

- `getPosterUrl('w500')`: Дает **полную ссылку** на главный постер нужного размера (например, `'w185'`, `'w500'`, `'original'`).
- `getBackdropUrl('w780')`: Дает **полную ссылку** на главный фон нужного размера.
- `getLogoUrl(путь_к_лого, 'w154')`: Дает **полную ссылку** на логотип (путь нужно взять из `images.logos`).
- `getProfileUrl(путь_к_аватару, 'w185')`: Дает **полную ссылку** на фото актера/команды (путь нужно взять из `credits`).
- `getDirectors()`: Дает список режиссеров (если запрашивали `credits`).
- `getCast()`: Дает список актеров (если запрашивали `credits`).
- `getCrewByDepartment('Writing')`: Дает список команды из нужного отдела (например, сценаристов) (если запрашивали `credits`).

**Только у Фильмов (`Movie`):**

- `title`: Название фильма. 🎬
- `originalTitle`: Оригинальное название.
- `releaseDate`: Дата выхода (`YYYY-MM-DD`). 📅
- `runtime`: Длительность в минутах. ⏱️
- `budget`: Сколько денег потратили.
- `revenue`: Сколько денег заработали.
- `tagline`: Слоган.
- `getFormattedReleaseDate('ru-RU')`: Дает дату выхода в красивом виде (например, "15 июня 2024 г."). ✨

**Только у Сериалов (`TVShow`):**

- `name`: Название сериала. 📺
- `originalName`: Оригинальное название.
- `firstAirDate`: Дата выхода первой серии (`YYYY-MM-DD`). 📅
- `numberOfSeasons`: Сколько сезонов.
- `numberOfEpisodes`: Сколько всего серий.
- `inProduction`: Еще снимают? (`true` или `false`).
- `seasons`: Список сезонов с информацией о каждом.
- `getFormattedFirstAirDate('ru-RU')`: Дает дату первого показа в красивом виде. ✨

## Картинки (`ImageConfig`)

Иногда нужно узнать, какие размеры картинок вообще бывают или поменять адрес, откуда они грузятся. Для этого есть `ImageConfig`.

```javascript
import { ImageConfig } from "tmdb-xhzloba";

// Узнать доступные размеры постеров:
console.log(ImageConfig.getAvailablePosterSizes()); // ['w92', 'w154', ...]

// Поменять базовый адрес для картинок (если очень нужно):
// ImageConfig.setBaseUrl('https://другой.адрес.картинок/'); // прокси для кратинок для TMDB
```

## Если Что-то Пошло Не Так (Ошибки)

Если пульт не смог получить информацию (например, нет интернета или ключ API неправильный), он сообщит об ошибке.

Нужно ловить ошибки с помощью `try...catch` (если используешь `async/await`) или метода `.catch()` (если используешь `.then()`).

Особый тип ошибки - `ApiError`. У нее могут быть дополнительные детали:

- `statusCode`: Номер ошибки от сервера (например, 401 - неверный ключ, 404 - не найдено).
- `apiMessage`: Сообщение от сервера (если он его прислал).

```javascript
try {
  const details = await client.media.getMovieDetails(123456789); // Несуществующий ID
} catch (error) {
  console.error("Ой! Ошибка!");
  if (error instanceof ApiError) {
    console.error(`  Статус: ${error.statusCode}`);
    console.error(`  Сообщение от API: ${error.apiMessage}`);
  } else {
    console.error("  Непонятная ошибка:", error);
  }
}
```

## Типы для TypeScript

Если ты используешь TypeScript, библиотека экспортирует все нужные типы (например, `Movie`, `TVShow`, `Genre`, `CastMember`), чтобы твой код был еще надежнее.
