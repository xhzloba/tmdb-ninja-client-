[![npm version](https://badge.fury.io/js/tmdb-xhzloba.svg)](https://badge.fury.io/js/tmdb-xhzloba)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

# ✨ xhzloba TMDB Proxy Client - Твой Помощник в Мире Кино!

Типизированная клиентская библиотека на TypeScript для взаимодействия с прокси-API TMDB. Предоставляет классы-сущности (`Movie`, `TVShow`, `Person`), методы для получения списков и деталей с пагинацией, а также утилиты для работы с API.

## Основные Возможности

- 🍿 **Получение информации о фильмах и сериалах:** Популярные, новинки, поиск, детали, актеры, команда.
- 🤵 **Получение информации о персонах:** Детали, фильмография.
- 🖼️ **Работа с изображениями:** Генерация URL для постеров, фонов, фото профиля разных размеров.
- ✨ **Поддержка `appendToResponse`:** Получение дополнительных данных (кредиты, видео, ключевые слова и т.д.) в одном запросе.
- 🇷🇺 **Поддержка языка:** Возможность указывать язык для ответов API (например, `ru`).
- ⚙️ **Полная типизация:** Написана на TypeScript для максимальной надежности.
- 🛡️ **Обработка ошибок:** Включает кастомный класс `ApiError`.

## Содержание

- **[Установка и Настройка](https://github.com/xhzloba/tmdb-ninja-client-/blob/main/docs/Setup.md)**
  - Установка через npm/yarn
  - Инициализация клиента (`createTMDBProxyClient`)
  - Использование с CDN
- **[Сервис Медиа (`client.media`)](https://github.com/xhzloba/tmdb-ninja-client-/blob/main/docs/MediaService.md)**
  - Получение списков (`getPopular`, `getLatest`, `getNowPlaying`, ...)
  - Поиск (`searchMovies`, `searchTVShows`)
  - Получение деталей (`getMovieDetails`, `getTVShowDetails`)
  - Опция `appendToResponse`
  - Классы `Movie` и `TVShow` (поля и методы)
- **[Сервис Персон (`client.person`)](https://github.com/xhzloba/tmdb-ninja-client-/blob/main/docs/PersonService.md)**
  - Получение деталей (`getPersonDetails`)
  - Класс `Person` (поля и методы, включая фильмографию)
- **[Утилиты и Дополнительная Информация](https://github.com/xhzloba/tmdb-ninja-client-/blob/main/docs/Utilities.md)**
  - Конфигурация изображений (`ImageConfig`)
  - Обработка ошибок (`ApiError`)
  - Заметки по TypeScript (работа с `Movie | TVShow`)
- **[Примеры Использования в React](https://github.com/xhzloba/tmdb-ninja-client-/blob/main/docs/ReactExamples.md)**
  - Отображение популярных медиа
  - Отображение профиля персоны

## Быстрый Старт

**Установка:**

```bash
npm install tmdb-xhzloba
```

**Использование:**

```typescript
import { createTMDBProxyClient } from "tmdb-xhzloba";

const client = createTMDBProxyClient("ВАШ_TMDB_API_КЛЮЧ");

async function main() {
  try {
    // Получаем популярные фильмы и сериалы
    const popular = await client.media.getPopular();
    console.log(
      "Популярное:",
      popular.items.map((item) =>
        item instanceof Movie ? item.title : item.name
      )
    );

    // Получаем детали фильма
    const movie = await client.media.getMovieDetails(550, {
      appendToResponse: ["credits"],
    });
    console.log(`\nФильм: ${movie.title}`);
    console.log(
      "Режиссеры:",
      movie.getDirectors().map((d) => d.name)
    );

    // Получаем детали персоны
    const person = await client.person.getPersonDetails(12835, {
      appendToResponse: ["combined_credits"],
    });
    console.log(`\nПерсона: ${person.name}`);
    console.log(
      "Известные фильмы:",
      person.getKnownForMovies(3).map((m) => m.title)
    );
  } catch (error) {
    console.error("Произошла ошибка:", error);
  }
}

main();
```

Подробности смотрите в разделах документации по ссылкам выше.

## Помощь в Консоли (`client.help()`)

После инициализации клиента (`const client = createTMDBProxyClient(...)`), вы можете вызвать специальную функцию `help()` прямо в консоли разработчика браузера, чтобы увидеть краткую справку по доступным методам:

```javascript
// Сначала инициализируйте клиент
const client = createTMDBProxyClient("ВАШ_API_КЛЮЧ");

// Затем вызовите в консоли:
client.help();
```

Это выведет структурированный список методов для `client.media` и `client.person`, а также напомнит об основных классах-сущностях и утилитах.

## Лицензия

[ISC](LICENSE)

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

**Вариант 1: Для HTML сайта поновее (через `<script type="module">`)**

Тебе даже не нужно ничего скачивать! Можно подключить прямо из интернета (CDN unpkg).

```html
<script type="module">
  // Загружаем пульт и другие нужные штуки
  import {
    createTMDBProxyClient,
    ApiError,
    Movie,
    TVShow,
  } from "https://unpkg.com/tmdb-xhzloba@latest/dist/index.esm.js";
  // Ссылка на последнюю версию: https://unpkg.com/tmdb-xhzloba@latest/dist/index.esm.js
  // Для стабильности лучше заменить @latest на номер версии, например @1.0.5

  const MY_API_KEY = "СЮДА_ВСТАВЬ_СВОЙ_API_КЛЮЧ";

  // Включаем пульт!
  const client = createTMDBProxyClient(MY_API_KEY);
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
import { createTMDBProxyClient, ApiError, Movie, TVShow } from "tmdb-xhzloba";

const MY_API_KEY = "СЮДА_ВСТАВЬ_СВОЙ_API_КЛЮЧ";

// Включаем пульт!
const client = createTMDBProxyClient(MY_API_KEY);

// Используем:
client.media
  .getPopular()
  .then((paginatedResult) => console.log(paginatedResult.items))
  .catch((error) => console.error(error));
```

*(Примечание: По умолчанию пульт использует адрес прокси `https://tmdb.kurwa-bober.ninja/`.
Чтобы использовать его, передай только API ключ: `createTMDBProxyClient('ТВОЙ_API*КЛЮЧ')`.
Если нужен другой адрес (`baseUrl`), передай его **первым** аргументом, а API ключ **вторым**: `createTMDBProxyClient('https://твой.адрес.прокси/', 'ТВОЙ*API*КЛЮЧ')`)\_

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

- **`client.media.searchMovies( "запрос", [номер_страницы] )`**

  - 🤔 **Что делает:** Ищет **фильмы** по текстовому запросу.
  - ✅ **Что вернет:** Список (`items`) найденных фильмов (`Movie`), обернутый в `PaginatedMovieResult`.
  - ```javascript
    client.media
      .searchMovies("Матрица")
      .then((data) => console.log("Найденные фильмы:", data.items));
    ```

- **`client.media.searchTVShows( "запрос", [номер_страницы] )`**

  - 🤔 **Что делает:** Ищет **сериалы** по текстовому запросу.
  - ✅ **Что вернет:** Список (`items`) найденных сериалов (`TVShow`), обернутый в `PaginatedTVShowResult`.
  - ```javascript
    client.media
      .searchTVShows("Доктор Кто")
      .then((data) => console.log("Найденные сериалы:", data.items));
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

**Просмотр Всех Данных (JSON)**

Иногда для отладки или просто из любопытства хочется увидеть **абсолютно все** данные, которые библиотека хранит для фильма или сериала, включая все детальные поля, которые были загружены.

Теперь ты можешь легко это сделать! Просто используй стандартную функцию `JSON.stringify()` с объектом `Movie` или `TVShow`:

```javascript
client.media
  .getMovieDetails(550, { appendToResponse: ["credits", "images"] })
  .then((movie) => {
    // Превращаем объект movie в красивую JSON-строку
    const movieDataString = JSON.stringify(movie, null, 2); // 2 - для отступов
    console.log("Все данные по фильму:\n", movieDataString);
    // В этой строке будут все поля: id, title, overview, credits, images,
    // а также _posterUrl_w500, _directors и т.д.
  });
```

Библиотека сама позаботится о том, чтобы собрать все доступные данные в удобный для просмотра формат.

## Пример Использования в React

Вот базовый пример, как использовать библиотеку в React-компоненте для загрузки и отображения популярных фильмов и сериалов.

```jsx
import React, { useState, useEffect } from 'react';
import { createTMDBProxyClient, MediaItem, Movie, TVShow, ApiError, ImageConfig } from 'tmdb-xhzloba';

// Инициализируем клиент один раз
const apiClient = createTMDBProxyClient("ВАШ_API_КЛЮЧ");

function PopularMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]); // Используем MediaItem для смешанного списка
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient.media.getPopular();
        setMedia(data.items);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
        if (err instanceof ApiError) {
          setError(`Ошибка API (${err.statusCode}): ${err.apiMessage || err.message}`);
        } else if (err instanceof Error) {
          setError(`Произошла ошибка: ${err.message}`);
        } else {
          setError("Произошла неизвестная ошибка");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз при монтировании

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div>
      <h1>Популярные фильмы и сериалы</h1>
      <ul>
        {media.map((item) => (
          <li key={item.id}>
            <img
              src={item.getPosterUrl('w92')} // Получаем URL постера
              alt={item instanceof Movie ? item.title : item.name} // У Movie есть title, у TVShow - name
              width="92"
              style={{ marginRight: '10px', verticalAlign: 'middle' }}
            />
            {item instanceof Movie ? item.title : item.name}
            {' '}
            ({item.getFormattedReleaseDate ? item.getFormattedReleaseDate('ru-RU') : item.getFormattedFirstAirDate ? item.getFormattedFirstAirDate('ru-RU') : 'Дата неизвестна'})
            {' - '}
            ⭐ {item.voteAverage.toFixed(1)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PopularMedia;

```

**Пояснения к примеру:**

1.  **Инициализация Клиента:** `createTMDBProxyClient` вызывается **вне** компонента, чтобы не создавать новый экземпляр при каждом рендере.
2.  **Состояние:** `useState` используется для хранения списка медиа (`media`), статуса загрузки (`loading`) и возможной ошибки (`error`).
3.  **Загрузка Данных:** `useEffect` с пустым массивом зависимостей `[]` используется для выполнения запроса к API (`apiClient.media.getPopular()`) только **один раз** после первого рендера компонента.
4.  **Обработка Загрузки и Ошибок:** Отображаются сообщения "Загрузка..." или текст ошибки, пока данные не получены или если произошла проблема. Используется `try...catch...finally` для управления состоянием загрузки и ошибок.
5.  **Отображение:** Метод `map` используется для итерации по массиву `media`.
6.  **Определение Типа:** `instanceof Movie` используется для определения, является ли элемент фильмом или сериалом, чтобы получить правильное название (`title` или `name`) и вызвать соответствующий метод для форматирования даты (`getFormattedReleaseDate` или `getFormattedFirstAirDate`).
7.  **Изображения:** Используется метод `getPosterUrl()` для получения URL постера нужного размера.
8.  **Типизация:** Пример использует TypeScript для лучшей читаемости и надежности, указывая типы для состояния (`useState<MediaItem[]>`) и ошибок.

## Что Умеет Пульт? (Секция `client.person`)

У пульта появилась новая секция `person` для работы с актерами, режиссерами и другими людьми из базы.

- **`client.person.getPersonDetails( ID_персоны, [доп_опции] )`**

  - 🤔 **Что делает:** Просит **все подробности** про конкретного человека. Нужно знать его ID.
  - ⚙️ **Доп. опции:**
    - `language`: Можно попросить информацию на другом языке (`{ language: 'en-US' }`).
    - `appendToResponse`: Можно сразу попросить дополнительно фильмографию (`{ appendToResponse: ['combined_credits'] }`).
  - ✅ **Что вернет:** Объект `Person` со всей информацией.
  - ```javascript
    // Получаем информацию о Томе Харди (ID 2524)
    client.person
      .getPersonDetails(2524, {
        language: "ru",
        appendToResponse: ["combined_credits"],
      })
      .then((person) => {
        console.log(`Загружена информация: ${person.name}`);
        console.log(`Биография: ${person.biography.substring(0, 100)}...`);
        console.log(`Известен по: ${person.knownForDepartment}`);
        console.log(`Ссылка на фото: ${person.getProfileUrl("w185")}`);

        // Выводим первые 5 работ из фильмографии (если запросили combined_credits)
        if (person.castCredits.length > 0) {
          console.log("\nНекоторые роли (cast):");
          person.castCredits.slice(0, 5).forEach((credit) => {
            const media = credit.media; // Movie или TVShow
            const title = media instanceof Movie ? media.title : media.name;
            const year =
              media instanceof Movie
                ? media.releaseDate?.substring(0, 4)
                : media.firstAirDate?.substring(0, 4);
            console.log(
              `  - ${title} (${year || "N/A"}) как ${credit.character}`
            );
            // Можно вывести и постер медиа: console.log(`    Постер: ${media.getPosterUrl('w92')}`);
          });
        }
        if (person.crewCredits.length > 0) {
          console.log("\nНекоторые работы в команде (crew):");
          person.crewCredits
            .filter((c) => c.department === "Production") // Пример: фильтр по департаменту
            .slice(0, 3)
            .forEach((credit) => {
              const media = credit.media; // Movie или TVShow
              const title = media instanceof Movie ? media.title : media.name;
              const year =
                media instanceof Movie
                  ? media.releaseDate?.substring(0, 4)
                  : media.firstAirDate?.substring(0, 4);
              console.log(
                `  - ${title} (${year || "N/A"}) - ${credit.job} (${
                  credit.department
                })`
              );
            });
        }
      })
      .catch((error) => console.error("Ошибка загрузки персоны:", error));
    ```

## Что Внутри Объекта `Person`?

Когда ты получаешь детали персоны с помощью `getPersonDetails`, ты получаешь экземпляр класса `Person`. У него есть много полей (имя, биография, день рождения и т.д.) и удобные методы для работы с фильмографией (если ты запросил `combined_credits`).

**Полезные Поля (Геттеры):**

- `id`: Уникальный номер (ID).
- `name`: Имя персоны.
- `biography`: Биография.
- `birthday`: Дата рождения (или `null`).
- `deathday`: Дата смерти (или `null`).
- `placeOfBirth`: Место рождения (или `null`).
- `profilePath`: Кусочек ссылки на **фото профиля**.
- `knownForDepartment`: В какой области наиболее известен (`Acting`, `Directing` и т.д.).
- `castCredits`: **Полный список ролей** (массив `PersonCastCreditItem`). Нужен `combined_credits`.
- `crewCredits`: **Полный список работ в команде** (массив `PersonCrewCreditItem`). Нужен `combined_credits`.

**Удобные Методы:**

Все методы ниже требуют, чтобы `Person` был получен с `{ appendToResponse: ['combined_credits'] }`.

- **`getProfileUrl( [размер] )`**

  - 🤔 **Что делает:** Формирует **полный URL для фото профиля**. Можно указать желаемый размер (например, `'w185'`, `'h632'`, по умолчанию `'original'`).
  - ✅ **Что вернет:** Строку с URL или `null`.
  - ```javascript
    const photoUrl = person.getProfileUrl("w185");
    console.log(photoUrl); // https://imagetmdb.com/t/p/w185/путь_к_фото.jpg
    ```

- **`getMoviesActedIn()`**

  - 🤔 **Что делает:** Возвращает **список всех фильмов**, в которых персона снималась (из `castCredits`).
  - ✅ **Что вернет:** Массив объектов `Movie`.
  - ```javascript
    const movies = person.getMoviesActedIn();
    console.log(
      `Снялся в ${movies.length} фильмах:`,
      movies.map((m) => m.title)
    );
    ```

- **`getTvShowsActedIn()`**

  - 🤔 **Что делает:** Возвращает **список всех сериалов**, в которых персона снималась (из `castCredits`).
  - ✅ **Что вернет:** Массив объектов `TVShow`.
  - ```javascript
    const tvShows = person.getTvShowsActedIn();
    console.log(
      `Снялся в ${tvShows.length} сериалах:`,
      tvShows.map((s) => s.name)
    );
    ```

- **`getVoicedWorks()`**

  - 🤔 **Что делает:** Возвращает список **фильмов и сериалов**, где персона работала над **озвучкой**. Проверяет и роли с пометкой `(voice)` в `castCredits`, и работы с должностями типа `Voice Actor` в `crewCredits`.
  - ✅ **Что вернет:** Массив объектов `Movie` или `TVShow`.
  - ```javascript
    const voiced = person.getVoicedWorks();
    console.log(
      `Озвучил ${voiced.length} работ:`,
      voiced.map((w) => (w instanceof Movie ? w.title : w.name))
    );
    ```

- **`getKnownForWorks( [лимит] )`**

  - 🤔 **Что делает:** Возвращает список **самых известных работ** (фильмов или сериалов), основываясь на основном департаменте персоны (`knownForDepartment`) и сортировке от API. Можно ограничить количество (по умолчанию **10**).
  - ✅ **Что вернет:** Массив объектов `Movie` или `TVShow`.
  - ```javascript
    const knownFor = person.getKnownForWorks(5); // Получить 5 самых известных работ
    console.log(
      "Известен по:",
      knownFor.map((w) => (w instanceof Movie ? w.title : w.name))
    );
    ```

- **`getKnownForMovies( [лимит] )` / `getKnownForTvShows( [лимит] )`**
  - 🤔 **Что делает:** Аналогично `getKnownForWorks`, но возвращает только **фильмы** или только **сериалы** соответственно. Лимит по умолчанию **10**.
  - ✅ **Что вернет:** Массив `Movie` или `TVShow`.

**Что такое `appendToResponse` (Дополнительные детали)?**

Когда просишь детали (`getMovieDetails` или `getTVShowDetails`), можно добавить волшебное слово `appendToResponse` и перечислить, что еще хочешь узнать сразу:

- `'credits'`: Кто снимался (актеры `cast`) и кто делал (команда `crew`).
- `'videos'`: Ссылки на трейлеры и другие видео.
- `'images'`: Больше картинок (постеры, фоны, логотипы).
- `'keywords'`: Ключевые слова (`keywords`).
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

## Пример использования в React

Вот простой пример, как можно загрузить и отобразить информацию о персоне в React-компоненте:

```jsx
import React, { useState, useEffect } from "react";
import {
  createTMDBProxyClient,
  Person,
  Movie,
  TVShow,
  ApiError,
  ImageConfig,
} from "tmdb-xhzloba";

// Замени на свой ключ!
const MY_API_KEY = "СЮДА_ВСТАВЬ_СВОЙ_API_КЛЮЧ";
const client = createTMDBProxyClient(MY_API_KEY);

interface PersonProfileProps {
  personId: number;
}

const PersonProfile: React.FC<PersonProfileProps> = ({ personId }) => {
  const [person, setPerson] = (useState < Person) | (null > null);
  const [loading, setLoading] = useState < boolean > true;
  const [error, setError] = (useState < string) | (null > null);

  useEffect(() => {
    const fetchPerson = async () => {
      setLoading(true);
      setError(null);
      try {
        // Запрашиваем детали с фильмографией
        const personDetails = await client.person.getPersonDetails(personId, {
          appendToResponse: ["combined_credits"],
          language: "ru", // Опционально: запросить на русском
        });
        setPerson(personDetails);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(`Ошибка API (${err.statusCode}): ${err.message}`);
        } else if (err instanceof Error) {
          setError(`Ошибка: ${err.message}`);
        } else {
          setError("Произошла неизвестная ошибка");
        }
        console.error("Ошибка загрузки персоны:", err);
      }
      setLoading(false);
    };

    fetchPerson();
  }, [personId]); // Перезагружаем при смене ID

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!person) return <p>Данные не найдены.</p>;

  // Используем методы класса Person для отображения,
  // сохраняя результаты в константы для читаемости
  const profileImageUrl = person.getProfileUrl("w185");
  const knownForWorks = person.getKnownForWorks(5); // 5 самых известных работ
  const voicedWorks = person.getVoicedWorks();
  const knownMovies = person.getKnownForMovies(); // Лимит по умолчанию 10
  const knownTvShows = person.getKnownForTvShows(); // Лимит по умолчанию 10

  // Получаем доступные размеры постеров для демонстрации
  const availablePosterSizes = ImageConfig.getAvailablePosterSizes();
  {
    /* ImageConfig.getAvailablePosterSizes() возвращает массив строк.
            Это может быть полезно, чтобы динамически выбирать или предлагать 
            пользователю доступные размеры изображений в интерфейсе. */
  }

  return (
    <div>
      <h1>{person.name}</h1>
      {profileImageUrl && (
        <img
          src={profileImageUrl}
          alt={person.name}
          style={{ width: "185px", float: "left", marginRight: "15px" }}
        />
      )}
      <p>{person.biography || "Биография отсутствует."}</p>
      <div style={{ clear: "both" }}></div>

      <h2>Наиболее известен(на) по:</h2>
      {knownForWorks.length > 0 ? (
        <ul>
          {knownForWorks.map((work) => (
            <li key={work.id}>
              {work instanceof Movie ? work.title : work.name} (
              {work instanceof Movie ? "Фильм" : "Сериал"})
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет данных.</p>
      )}

      <h2>Работы в озвучке:</h2>
      {voicedWorks.length > 0 ? (
        <ul>
          {voicedWorks.map((work) => (
            <li key={`voiced-${work.id}`}>
              {work instanceof Movie ? work.title : work.name} (
              {work instanceof Movie ? "Фильм" : "Сериал"})
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет данных об озвучке.</p>
      )}

      <h2>Известные фильмы ({knownMovies.length}):</h2>
      {knownMovies.length > 0 ? (
        <ul>
          {knownMovies.map((movie) => {
            const year = movie.releaseDate?.substring(0, 4) || "N/A";
            const posterUrl = movie.getPosterUrl("w92");
            return (
              <li
                key={`movie-${movie.id}`}
                style={{ marginBottom: "10px", listStyle: "none" }}
              >
                {posterUrl && (
                  <img
                    src={posterUrl}
                    alt={`Постер ${movie.title}`}
                    width="60" // Немного меньше для компактности
                    style={{ verticalAlign: "middle", marginRight: "10px" }}
                  />
                )}
                {movie.title} ({year})
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Нет данных.</p>
      )}

      <h2>Известные сериалы ({knownTvShows.length}):</h2>
      {knownTvShows.length > 0 ? (
        <ul>
          {knownTvShows.map((tvShow) => (
            <li key={`tv-${tvShow.id}`}>{tvShow.name}</li>
          ))}
        </ul>
      ) : (
        <p>Нет данных.</p>
      )}

      {/* Демонстрация ImageConfig */}
    </div>
  );
};

export default PersonProfile;
```

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

```
console.error("  Непонятная ошибка:", error);
```

## Типы для TypeScript

Если ты используешь TypeScript, библиотека экспортирует все нужные типы (например, `Movie`, `TVShow`, `Genre`, `CastMember`), чтобы твой код был еще надежнее.

## ⚠️ Важно: Как Работать с `Movie | TVShow`?

Некоторые методы (`getPopular`, `getLatest`, `getNowPlaying`) и свойства (`PersonCastCreditItem.media`, `PersonCrewCreditItem.media`) возвращают или содержат значение, которое может быть **либо** фильмом (`Movie`), **либо** сериалом (`TVShow`). В TypeScript это называется объединенным типом (`Movie | TVShow`).

**Почему это важно?**

_ У `Movie` есть свойство `title` (название) и `releaseDate` (дата выхода).
_ У `TVShow` есть свойство `name` (название) и `firstAirDate` (дата первого показа).

Если вы попытаетесь напрямую обратиться к `item.title` или `item.name` у переменной типа `Movie | TVShow`, TypeScript выдаст ошибку, так как он не знает _заранее_, какой именно тип там будет во время выполнения.

**Как правильно получить доступ к уникальным полям?**

Используйте **проверку типа** с помощью оператора `instanceof`:

**Вариант 1: `if/else`**

```javascript
if (item instanceof Movie) {
  // Здесь TypeScript знает, что item - это Movie
  console.log(`Фильм: ${item.title} (${item.releaseDate?.substring(0, 4)})`);
} else if (item instanceof TVShow) {
  // Здесь TypeScript знает, что item - это TVShow
  console.log(`Сериал: ${item.name} (${item.firstAirDate?.substring(0, 4)})`);
}
```

**Вариант 2: Тернарный оператор**

```javascript
const displayName = item instanceof Movie ? item.title : item.name;
const displayDate =
  item instanceof Movie ? item.releaseDate : item.firstAirDate;
const displayYear = displayDate?.substring(0, 4) || "N/A";
console.log(`${displayName} (${displayYear})`);
```

**Чего следует избегать:**

Не используйте утверждение типа `as Movie` или `as TVShow` (`(item as Movie).title`), чтобы "заставить" компилятор замолчать. Это **небезопасно**, так как отключает проверку типов и может привести к ошибкам во время выполнения, если тип окажется не тем, который вы ожидали. Используйте `instanceof` для надежной проверки.
