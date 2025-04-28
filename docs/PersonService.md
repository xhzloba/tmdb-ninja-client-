# Сервис Персон (`client.person`)

Этот сервис предоставляет методы для получения информации о персонах (актерах, режиссерах и т.д.).

## Получение Деталей Персоны

- **`client.person.getPersonDetails( personId, [options] )`**
  - Получает детальную информацию о персоне по её `personId`.
  - `options`: `{ language?: string, appendToResponse?: string[] }`.
    - Чтобы получить доступ к фильмографии через методы класса `Person`, **обязательно** укажите `appendToResponse: ['combined_credits']`.
  - Возвращает: `Promise<Person>`.
  - ```typescript
    // Получить детали Вина Дизеля (ID 12835) на русском с полной фильмографией
    client.person
      .getPersonDetails(12835, {
        language: "ru",
        appendToResponse: ["combined_credits"],
      })
      .then((person) => {
        console.log(`Персона: ${person.name}`);
        console.log("Фото:", person.getProfileUrl("w185"));
        console.log("Известные работы:", person.getKnownForWorks(3)); // Первые 3
      });
    ```

## Класс `Person`

Результат `getPersonDetails` - это экземпляр класса `Person`. Он содержит поля с информацией о персоне и методы для удобной работы с её данными и фильмографией (если был запрошен `combined_credits`).

**Основные Поля (Геттеры):**

- `id`: `number` - Уникальный ID.
- `name`: `string` - Имя.
- `biography`: `string` - Биография.
- `birthday`: `string | null` - Дата рождения (YYYY-MM-DD).
- `deathday`: `string | null` - Дата смерти (YYYY-MM-DD).
- `placeOfBirth`: `string | null` - Место рождения.
- `profilePath`: `string | null` - Часть URL фото профиля.
- `knownForDepartment`: `string` - Основной департамент (`Acting`, `Directing`...).
- `castCredits`: `PersonCastCreditItem[]` - Массив ролей (требует `combined_credits`).
- `crewCredits`: `PersonCrewCreditItem[]` - Массив работ в команде (требует `combined_credits`).

**Основные Методы:**

(Большинство методов ниже требуют, чтобы `Person` был получен с `appendToResponse: ['combined_credits']`)

- `getProfileUrl(size?)`: Возвращает полный URL фото профиля указанного `size`.

  - ```typescript
    const photo = person.getProfileUrl("w185"); // => "https://imagetmdb.com/t/p/w185/...jpg"
    ```

- `getMoviesActedIn()`: Возвращает массив фильмов (`Movie[]`), в которых персона снималась.

  - ```typescript
    const movies = person.getMoviesActedIn();
    ```

- `getTvShowsActedIn()`: Возвращает массив сериалов (`TVShow[]`), в которых персона снималась.

  - ```typescript
    const tvShows = person.getTvShowsActedIn();
    ```

- `getVoicedWorks()`: Возвращает массив фильмов и сериалов (`(Movie | TVShow)[]`), где персона участвовала в озвучке (проверяет `castCredits` и `crewCredits`).

  - ```typescript
    const voiced = person.getVoicedWorks();
    ```

- `getKnownForWorks(limit = 10)`: Возвращает до `limit` самых известных работ (`(Movie | TVShow)[]`) персоны.

  - ```typescript
    const knownForTop5 = person.getKnownForWorks(5);
    ```

- `getKnownForMovies(limit = 10)`: Возвращает до `limit` самых известных фильмов (`Movie[]`).

  - ```typescript
    const knownMovies = person.getKnownForMovies();
    ```

- `getKnownForTvShows(limit = 10)`: Возвращает до `limit` самых известных сериалов (`TVShow[]`).

  - ```typescript
    const knownShows = person.getKnownForTvShows();
    ```

- `getActingRoles()`: Шорткат для `person.castCredits`.

  - ```typescript
    const roles = person.getActingRoles();
    ```

- `getCrewWorksByDepartment(department)`: Возвращает работы (`PersonCrewCreditItem[]`) из указанного `department`.

  - ```typescript
    const directingJobs = person.getCrewWorksByDepartment("Directing");
    ```

- `getCrewWorksByJob(job)`: Возвращает работы (`PersonCrewCreditItem[]`) с указанной должностью `job`.
  - ```typescript
    const producerJobs = person.getCrewWorksByJob("Producer");
    ```

Для получения полного списка полей смотрите исходный тип (`PersonDetailsResponse` в `src/types/person.ts`) или используйте `JSON.stringify()`.
