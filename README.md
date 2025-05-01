[![npm version](https://badge.fury.io/js/tmdb-xhzloba.svg)](https://badge.fury.io/js/tmdb-xhzloba)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

# ✨ xhzloba TMDB Proxy Client - Твой Помощник в Мире Кино!

Типизированная клиентская библиотека на TypeScript для взаимодействия с прокси-API TMDB. Предоставляет классы-сущности (`Movie`, `TVShow`, `Person`), методы для получения списков и деталей с пагинацией, а также утилиты для работы с API.

## Установка

```bash
npm install tmdb-xhzloba
# или
yarn add tmdb-xhzloba
```

## ✨ Ключевые Возможности

Надоело возиться с "сырыми" JSON от TMDB Proxy? Эта библиотека — твой турбо-ускоритель! Мы превращаем ответы API в удобные, типизированные объекты TypeScript/JavaScript, с которыми приятно работать.

- **🎬 Погружайся в мир кино и ТВ!**

  - Запросто получай **самое горячее**: популярное, новинки года, свежие добавления, что сейчас идет — всё с пагинацией и фильтрами (фильмы/сериалы).
  - Найди **что угодно** с помощью встроенного поиска.
  - Копай **глубже**: получай сочные детали о любом фильме, сериале или даже целой коллекции.

- **🤵 Узнай всё о звездах (и не только)!**

  - Получай **подробные досье** на актеров, режиссеров и всю команду.
  - Разбирайся в их карьере: доступна **полная фильмография** (`combined_credits`), удобно разложенная по полочкам.

- **💡 Забудь про голые данные — работай с умными объектами!**

  - Никаких больше `data.movie_title`! Используй готовые классы: `Movie`, `TVShow`, `Person`, `Collection`.
  - Получай **дополнительные данные от прокси**, такие как **ID Кинопоиска** (`kinopoiskId`), **ID IMDb** (`imdbId`) и **качество релиза** (`releaseQuality`), прямо из свойств объекта!
  - **Куча полезных хелперов** уже встроена: форматируй даты (`getFormattedReleaseDate()`) и длительность (`getFormattedRuntime()`), доставай режиссеров (`getDirectors()`), актеров (`getCast()`), смотри, где играл актер (`getMoviesActedIn()`) или кого озвучивал (`getVoicedWorks()`). И это только начало!

- **⚙️ Мощь и гибкость — твои новые инструменты:**

  - **Экономь запросы** с `appendToResponse`: получай видео, картинки, каст, ключевики и прочее вместе с основными деталями за один раз!
  - **Картинки? Легко!** Генерируй ссылки на постеры, фоны и фотки профилей любого нужного размера (`getPosterUrl`, `getBackdropUrl`, `getProfileUrl`).

- **🛡️ Пиши код уверенно и с комфортом:**
  - **TypeScript рулит!** Полная типизация ловит ошибки на лету и дает шикарное автодополнение в IDE.
  - **Говорим по-русски (и не только)!** Запрашивай данные на нужном языке (`language: 'ru'`).
  - **Ошибки? Не проблема!** Понятная обработка с классом `ApiError`, который покажет и статус, и сообщение от API.

Хватит бороться с API — начни создавать крутые фичи прямо сейчас!

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
