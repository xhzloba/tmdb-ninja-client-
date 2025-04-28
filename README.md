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
import { createTMDBProxyClient, MediaItem, Movie, TVShow, ApiError } from 'tmdb-xhzloba';

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

## Что Внутри Персоны (`Person`)?

Когда ты получаешь информацию о человеке, она приходит в виде объекта `Person`.

**Основная Информация:**

- `id`: Уникальный номер (ID).
- `name`: Имя. 🧑‍🎨
- `adult`: Контент для взрослых? (`true` или `false`).
- `alsoKnownAs`: Список других известных имен (псевдонимов).
- `biography`: Биография. 📜
- `birthday`: Дата рождения (`YYYY-MM-DD`) или `null`.
- `deathday`: Дата смерти (`YYYY-MM-DD`) или `null`. RIP
- `gender`: Пол (1 - женский, 2 - мужской, 3 - не бинарный, 0 - не указан). ♀️♂️
- `homepage`: Ссылка на домашнюю страницу или `null`.
- `imdbId`: ID на IMDb или `null`.
- `knownForDepartment`: Основной департамент работы (например, 'Acting', 'Directing'). 🎬
- `placeOfBirth`: Место рождения или `null`. 🌍
- `popularity`: Насколько популярен (число).
- `profilePath`: Кусочек ссылки на **главное фото профиля**.

**Фильмография (если запрашивали `appendToResponse: ['combined_credits']`)** 🎞️

- `castCredits`: Массив объектов `PersonCastCreditItem`, представляющих **роли** человека в фильмах и сериалах.
- `crewCredits`: Массив объектов `PersonCrewCreditItem`, представляющих **работы** человека в съемочной группе.

**Что Внутри Элемента Фильмографии (`PersonCastCreditItem` / `PersonCrewCreditItem`)?**

- `media`: Объект `Movie` или `TVShow`, к которому относится кредит. Ты можешь использовать все его методы (`getPosterUrl`, `title`, `name` и т.д.).
- `creditId`: Уникальный ID самого кредита.
- **Для `PersonCastCreditItem` (роли):**
  - `character`: Имя персонажа.
  - `order`: Порядок в титрах (не всегда есть).
  - `episodeCount`: Количество эпизодов (для роли в сериале).
- **Для `PersonCrewCreditItem` (команда):**
  - `department`: Департамент (Writing, Production, Directing...).
  - `job`: Должность (Director, Writer, Producer...).
  - `episodeCount`: Количество эпизодов (может быть для создателей/продюсеров).

**Полезные Функции (Методы) у `Person`:**

- `getProfileUrl('w185')`: Дает **полную ссылку** на фото профиля нужного размера (например, `'w45'`, `'w185'`, `'h632'`, `'original'`).
- `getActingRoles()`: Возвращает массив всех актерских ролей (`PersonCastCreditItem[]`). Шорткат для `person.castCredits`.
- `getCrewWorksByDepartment('Directing')`: Возвращает массив работ (`PersonCrewCreditItem[]`) человека в указанном департаменте (например, `'Directing'`, `'Writing'`, `'Production'`).
- `getCrewWorksByJob('Director')`: Возвращает массив работ (`PersonCrewCreditItem[]`) человека на указанной должности (например, `'Director'`, `'Writer'`, `'Producer').

## Пример Использования в React

Вот базовый пример, как использовать библиотеку в React-компоненте для загрузки и отображения информации о человеке.

```jsx
import React, { useState, useEffect } from "react";
import { createTMDBProxyClient, ApiError, Person } from "tmdb-xhzloba";

// Инициализируем клиент один раз
const apiClient = createTMDBProxyClient("ВАШ_API_КЛЮЧ");

function PersonDetails() {
  const [person, setPerson] = (useState < Person) | (null > null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = (useState < string) | (null > null);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const person = await apiClient.person.getPersonDetails(2524, {
          language: "ru",
          appendToResponse: ["combined_credits"],
        });
        setPerson(person);
      } catch (err) {
        console.error("Ошибка загрузки информации о персоне:", err);
        if (err instanceof ApiError) {
          setError(
            `Ошибка API (${err.statusCode}): ${err.apiMessage || err.message}`
          );
        } else if (err instanceof Error) {
          setError(`Произошла ошибка: ${err.message}`);
        } else {
          setError("Произошла неизвестная ошибка");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз при монтировании

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div>
      <h1>Информация о персоне</h1>
      {person && (
        <>
          <p>
            <strong>Имя:</strong> {person.name}
          </p>
          <p>
            <strong>Биография:</strong> {person.biography}
          </p>
          <p>
            <strong>Известен по:</strong> {person.knownForDepartment}
          </p>
          <p>
            <strong>Ссылка на фото:</strong>{" "}
            <img
              src={person.getProfileUrl("w185")}
              alt={person.name}
              style={{ width: "100px" }}
            />
          </p>
          {person.castCredits.length > 0 && (
            <>
              <h2>Некоторые роли:</h2>
              <ul>
                {person.castCredits.slice(0, 5).map((credit) => (
                  <li key={credit.creditId}>
                    {credit.character} -{" "}
                    {credit.media instanceof Movie
                      ? credit.media.title
                      : credit.media.name}
                  </li>
                ))}
              </ul>
            </>
          )}
          {person.crewCredits.length > 0 && (
            <>
              <h2>Некоторые работы в команде:</h2>
              <ul>
                {person.crewCredits
                  .filter((c) => c.department === "Production")
                  .slice(0, 3)
                  .map((credit) => (
                    <li key={credit.creditId}>
                      {credit.job} -{" "}
                      {credit.media instanceof Movie
                        ? credit.media.title
                        : credit.media.name}
                    </li>
                  ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default PersonDetails;
```

**Пояснения к примеру:**

1.  **Инициализация Клиента:** `createTMDBProxyClient`

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

+## ⚠️ Важно: Как Работать с `Movie | TVShow`?

- +Некоторые методы (`getPopular`, `getLatest`, `getNowPlaying`) и свойства (`PersonCastCreditItem.media`, `PersonCrewCreditItem.media`) возвращают или содержат значение, которое может быть **либо** фильмом (`Movie`), **либо** сериалом (`TVShow`). В TypeScript это называется объединенным типом (`Movie | TVShow`).
- +**Почему это важно?**
- +_ У `Movie` есть свойство `title` (название) и `releaseDate` (дата выхода). +_ У `TVShow` есть свойство `name` (название) и `firstAirDate` (дата первого показа).
- +Если вы попытаетесь напрямую обратиться к `item.title` или `item.name` у переменной типа `Movie | TVShow`, TypeScript выдаст ошибку, так как он не знает _заранее_, какой именно тип там будет во время выполнения.
- +**Как правильно получить доступ к уникальным полям?**
- +Используйте **проверку типа** с помощью оператора `instanceof`:
- +**Вариант 1: `if/else`**
- +```javascript
  +if (item instanceof Movie) {
- // Здесь TypeScript знает, что item - это Movie
- console.log(`Фильм: ${item.title} (${item.releaseDate?.substring(0, 4)})`);
  +} else if (item instanceof TVShow) {
- // Здесь TypeScript знает, что item - это TVShow
- console.log(`Сериал: ${item.name} (${item.firstAirDate?.substring(0, 4)})`);
  +}
  +```
- +**Вариант 2: Тернарный оператор**
- +```javascript
  +const displayName = item instanceof Movie ? item.title : item.name;
  +const displayDate = item instanceof Movie ? item.releaseDate : item.firstAirDate;
  +const displayYear = displayDate?.substring(0, 4) || 'N/A';
- +console.log(`${displayName} (${displayYear})`);
  +```
- +**Чего следует избегать:**
- +Не используйте утверждение типа `as Movie` или `as TVShow` (`(item as Movie).title`), чтобы "заставить" компилятор замолчать. Это **небезопасно**, так как отключает проверку типов и может привести к ошибкам во время выполнения, если тип окажется не тем, который вы ожидали. Используйте `instanceof` для надежной проверки.
