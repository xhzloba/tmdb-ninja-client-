// Используем require вместо import
const typescript = require("@rollup/plugin-typescript");
const resolve = require("@rollup/plugin-node-resolve").default; // .default может быть нужен для resolve
const commonjs = require("@rollup/plugin-commonjs");
// Убираем импорт с assert
// import pkg from "./package.json" assert { type: "json" };

// Используем fs для чтения JSON файла
const fs = require("fs");
const path = require("path");

// Читаем и парсим package.json
const pkg = JSON.parse(
  fs.readFileSync(path.resolve("./package.json"), "utf-8")
);

// Имя глобальной переменной для UMD сборки
const umdName = "tmdbNinjaClient";

// Используем module.exports вместо export default
module.exports = {
  input: "src/index.ts", // Точка входа
  output: [
    {
      file: pkg.main, // CommonJS (для Node)
      format: "cjs",
      sourcemap: true, // Генерировать sourcemaps
    },
    {
      file: pkg.module, // ES module (для бандлеров)
      format: "esm",
      sourcemap: true,
    },
    {
      file: pkg.browser, // UMD (для браузера через <script>)
      format: "umd",
      name: umdName, // Имя глобальной переменной window.tmdbNinjaClient
      sourcemap: true,
      // Опционально: можно определить глобальные переменные для зависимостей, если они не должны бандлиться
      // globals: { 'some-dependency': 'SomeDependencyGlobal' }
    },
  ],
  plugins: [
    resolve(), // Позволяет Rollup находить модули в node_modules
    commonjs(), // Конвертирует CommonJS модули в ES6
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true, // Генерировать .d.ts файлы
      declarationDir: "dist/types", // Указываем папку для .d.ts
      rootDir: "src", // Указываем корневую директорию исходников
      // Важно: Убедимся, что sourcemap генерируется плагином
      sourceMap: true,
      inlineSources: true,
    }), // Интегрирует компиляцию TypeScript
  ],
  // Опционально: Указать внешние зависимости, если они не должны включаться в бандл
  // external: [],
};
