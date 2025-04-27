/**
 * Конфигурация для базового URL изображений.
 * Использует статические свойства и методы для глобальной настройки.
 * Ниндзя-стайл: не слишком очевидно, как это работает, но эффективно.
 */
export class ImageConfig {
  // Приватное статическое свойство для хранения URL.
  // Доступно только внутри этого класса.
  static #baseUrl: string = "https://imagetmdb.com/t/p/";

  /**
   * Устанавливает новый базовый URL для всех изображений.
   * Это позволяет пользователю библиотеки переопределить дефолтный прокси.
   * @param newUrl - Новый базовый URL (должен заканчиваться на '/').
   */
  static setBaseUrl(newUrl: string): void {
    // Комментарий для "себя": Валидация URL - убедимся, что он не пустой
    // и заканчивается на слеш для корректного соединения с путем.
    if (!newUrl) {
      console.warn("Attempted to set an empty image base URL. Ignoring.");
      return;
    }
    if (!newUrl.endsWith("/")) {
      console.warn(
        `Image base URL "${newUrl}" does not end with '/'. Appending it.`
      );
      newUrl += "/";
    }
    ImageConfig.#baseUrl = newUrl;
  }

  /**
   * Получает текущий базовый URL для изображений.
   * Внутренний метод, используемый другими классами (например, MediaItem).
   * @returns Текущий базовый URL.
   */
  static getBaseUrl(): string {
    // Комментарий для "себя": Просто возвращаем приватное статическое поле.
    return ImageConfig.#baseUrl;
  }

  /**
   * Строит полный URL для изображения.
   * @param filePath - Путь к файлу изображения (может быть null).
   * @param size - Запрашиваемый размер (например, 'w500', 'original').
   * @returns Полный URL или null, если путь не предоставлен.
   */
  static buildImageUrl(filePath: string | null, size: string): string | null {
    if (!filePath) {
      return null;
    }
    // Убираем ведущий слеш из filePath, если он есть, т.к. baseUrl уже заканчивается на слеш
    const cleanFilePath = filePath.startsWith("/")
      ? filePath.substring(1)
      : filePath;
    return `${ImageConfig.getBaseUrl()}${size}/${cleanFilePath}`;
  }

  // Можно добавить методы для получения дефолтных размеров или списков доступных, если нужно
  // static getAvailablePosterSizes(): string[] { return [...] }
}
