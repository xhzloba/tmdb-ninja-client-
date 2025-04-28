# Утилиты и Дополнительная Информация

## Конфигурация Изображений (`ImageConfig`)

Этот статический класс позволяет управлять базовым URL для изображений и получать списки доступных размеров.

- **`ImageConfig.setBaseUrl(newUrl)`**

  - Устанавливает новый базовый URL для всех последующих запросов URL изображений.
  - ```typescript
    import { ImageConfig } from "tmdb-xhzloba";
    ImageConfig.setBaseUrl("https://your-image-proxy.com/t/p/");
    ```

- **`ImageConfig.getBaseUrl()`**

  - Возвращает текущий базовый URL изображений.
  - ```typescript
    console.log(ImageConfig.getBaseUrl());
    ```

- **`ImageConfig.getAvailablePosterSizes()`**

  - Возвращает массив строк с доступными размерами постеров.
  - ```typescript
    const posterSizes = ImageConfig.getAvailablePosterSizes();
    console.log(posterSizes); // ['w92', 'w154', 'w185', ... , 'original']
    ```

- **`ImageConfig.getAvailableBackdropSizes()`**, **`getAvailableLogoSizes()`**, **`getAvailableProfileSizes()`**, **`getAvailableStillSizes()`**

  - Аналогичные методы для получения доступных размеров фонов, логотипов, фото профиля и кадров соответственно.

- **`ImageConfig.buildImageUrl(filePath, size)`**
  - Внутренний метод (используется методами `getPosterUrl`, `getBackdropUrl` и т.д.), но может быть вызван и напрямую, если есть путь к файлу (`filePath`) и желаемый размер (`size`).

## Обработка Ошибок

Методы клиента могут выбрасывать ошибки. Рекомендуется оборачивать вызовы в `try...catch`.

Библиотека экспортирует класс `ApiError`, который выбрасывается при ошибках ответа API (например, статус 4xx или 5xx).

- `error.message`: Основное сообщение об ошибке.
- `error.statusCode`: HTTP статус-код ответа (если применимо).
- `error.apiMessage`: Сообщение об ошибке, возвращенное самим API (если есть).

```typescript
import { ApiError } from "tmdb-xhzloba";

try {
  const details = await client.media.getMovieDetails(9999999); // Несуществующий ID
} catch (error) {
  if (error instanceof ApiError) {
    console.error("Ошибка API!");
    console.error("Статус:", error.statusCode); // e.g., 404
    console.error("Сообщение от API:", error.apiMessage); // e.g., "The resource you requested could not be found."
    console.error("Общее сообщение:", error.message);
  } else if (error instanceof Error) {
    console.error("Другая ошибка JavaScript:", error.message);
  } else {
    console.error("Неизвестная ошибка:", error);
  }
}
```

## Заметки по TypeScript

Библиотека полностью типизирована.

### Работа с `Movie | TVShow`

Некоторые методы (`getPopular`, `getNowPlaying` и др.) и поля (`PersonCastCreditItem.media`) могут возвращать смешанный тип `Movie | TVShow`.

Поскольку у `Movie` есть `title` и `releaseDate`, а у `TVShow` - `name` и `firstAirDate`, необходимо использовать проверку типа `instanceof` для безопасного доступа к этим полям:

```typescript
async function displayMedia(mediaId: number) {
  // Предположим, getMediaById возвращает Promise<Movie | TVShow>
  const item: Movie | TVShow = await getMediaById(mediaId);

  let displayName: string;
  let displayYear: string | undefined;

  if (item instanceof Movie) {
    displayName = item.title;
    displayYear = item.releaseDate?.substring(0, 4);
    console.log(`Это фильм: ${displayName} (${displayYear || "N/A"})`);
    // Здесь можно безопасно использовать другие поля Movie, например item.runtime
  } else if (item instanceof TVShow) {
    displayName = item.name;
    displayYear = item.firstAirDate?.substring(0, 4);
    console.log(`Это сериал: ${displayName} (${displayYear || "N/A"})`);
    // Здесь можно безопасно использовать другие поля TVShow, например item.numberOfSeasons
  }
}
```

**Избегайте** использования утверждений типа (`item as Movie`), так как это небезопасно.
