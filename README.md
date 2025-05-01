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
