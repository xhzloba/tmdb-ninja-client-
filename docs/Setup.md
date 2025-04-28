# Установка и Настройка

## Установка

Установите библиотеку с помощью npm или yarn:

```bash
npm install tmdb-xhzloba
# или
yarn add tmdb-xhzloba
```

## Инициализация Клиента

Для взаимодействия с API вам понадобится **API ключ** от TMDB и экземпляр клиента.

**Основной способ (с прокси по умолчанию):**

Импортируйте `createTMDBProxyClient` и передайте ваш API ключ. Будет использован прокси-URL по умолчанию.

```typescript
import { createTMDBProxyClient } from "tmdb-xhzloba";

const MY_API_KEY = "ВАШ_TMDB_API_КЛЮЧ";

// Инициализация клиента
const client = createTMDBProxyClient(MY_API_KEY);

console.log("Клиент готов!", client);
// Теперь можно использовать client.media.* и client.person.*
```

**С указанием своего прокси URL:**

Если вы используете другой прокси-сервер, передайте его URL **первым** аргументом, а API ключ — **вторым**.

```typescript
import { createTMDBProxyClient } from "tmdb-xhzloba";

const MY_PROXY_URL = "https://адрес_вашего_прокси/";
const MY_API_KEY = "ВАШ_TMDB_API_КЛЮЧ";

// Инициализация с кастомным URL
const client = createTMDBProxyClient(MY_PROXY_URL, MY_API_KEY);

console.log("Клиент с кастомным URL готов!", client);
```

**Использование в браузере через CDN (unpkg):**

Вы можете подключить библиотеку напрямую в HTML без установки, используя CDN.

```html
<script type="module">
  import {
    createTMDBProxyClient,
    // ... другие нужные импорты (ApiError, Movie, TVShow, Person)
  } from "https://unpkg.com/tmdb-xhzloba@latest/dist/index.esm.js";
  // Для стабильности замените @latest на конкретную версию, напр. @1.0.20

  const MY_API_KEY = "ВАШ_TMDB_API_КЛЮЧ";
  const client = createTMDBProxyClient(MY_API_KEY);

  console.log("Клиент из CDN готов!");

  // Пример использования
  async function loadPopular() {
    try {
      const popular = await client.media.getPopular();
      console.log("Популярное:", popular.items);
    } catch (e) {
      console.error(e);
    }
  }
  loadPopular();
</script>
```

Теперь клиент готов к работе! Переходите к следующим разделам для изучения возможностей.
