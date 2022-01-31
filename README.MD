creating a report on the consumption of electrical energy when drilling oil wells

## Хронология
*2022-01-31*<br>
*Установка и настройка среды разработки*
1. С помощью git создан репозиторий для проекта, настроил ssh подключение, и через него подключился к удаленному репозиторию на GitHub.
2. Инициализирован проект `npm init`
3. Инициализирован typescript `tsc --init`
4. Установлен фреймворк `express` и импортированны типы его данных для TS. Для отладки рабочей среды написан простейший сервер.
5. Установлен `nodemon` и `ts-node`, создан файл в корне проекта `nodemon.json` настроен запуск в режиме отладки с автоматическим перезпуском ноды при изменениях в проекте. 
6. Установлены и сконфигурированы `ESLint`, `TS-ESLint`, `Prettier`, созданы конфигурационные файлы в корне проекта `.prettierrc`, прописал автоматическое исправление при сохранение файлов в `/.vscode/settings.json`, создал команды для проверки и исправления  
7. Настроен режим дебага для TS - в `tsconfig.json` установлено маппинг "sourceMap": true, и конфигурация  лаунчера `/.vscode/launch.json` для запуска ноды.
8. Настроен запуск для `Node Debugger` из инструментов разработчика  chrome - `dev:inspect`
9. Установлен и настроен Clinic Doctor вместе с autocannon для проверки и тестирования производительности, для запуска: `npm run doctor`
10. Подключен и настроен `jest` для unit-test, создан `jest.config.ts`, запуск `npm run test` 
11. Подключен и настроен `supertest` для e2e-test, создан `jest.e2e.config.ts` и директория `tests`, запуск - `test:e2e`
12. Подключена `Prisma` и её клиент, выполнена первичная инициализация - `npx prisma init`, настроен провайдер и подключение к бд, cоздана модель таблицы - `./prisma/schema.prisma`. Выполнена миграция данныx - `npx prisma migrate dev` с именем init. Добавлены исключения  в `.gitignore`. Подчищен файл `.env`. Выполнена генерация типов - `npm run generate` 


---
## Средства разработки
- `vscode` - редактор кода. 
- `git` - система управления версиями, удаленный репозиторий на github.com
- `npm` для управления зависемостями
- `typescript` - язык нашего приложения 
- `express` - для обработки сетевых запросов
- `nodemon` - для запуска в режиме отладки
- `ts-node` - для запуски в ноде TS
- `eslint`, `prettier` - для линта и форматирования кода
- `clinic` - для проверки производительности приложения (установлен глобально)
- `autocannon` - для создани нагрузки на приложение (установлен глобально)
- `jest` - для юнит тестов
- `supertest` - для е2е тестов
- `prisma` - для работы с базой данных

## Установленные пакеты
```
npm i express
npm i -D @types/expres
npm i -D nodemon ts-node
npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm i -D prettier eslint-config-prettier eslint-plugin-prettier
npm i -D typescript  //Нужен для линтера
npm i -D jest ts-jest @types/jest 
npm i -D supertest @types/supertest
npm i -D prisma
npm i @prisma/client  //Клиент призмы

```

## Настройка npm (packege.json)
- `"version": "0.0.0"` - мажорная версия 0 означает что приложение пока не работает
- `"type": "commonjs"` - будем использовать максимально поддерживаемые модули
- `"start": "node ./dist/main.js",` запускать будем нодой
- `"build": "tsc",` собирать будем компилятором TS
- `"test": "jest"` тестировать будем jest
- `"dev": "nodemon"` режим отладки
- ` "lint": "selint ./src**"` - линт кода
- `"lint:fix":"eslint ./src/** --fix"` - форматировние кода
- `"doctor": "clinic doctor --on-port 'autocannon -m GET localhost:8000/hello' -- node dist/main.js"` - запуск Clinic doctor
- `"test:e2e": "jest --config jest.e2e.config.ts --coverage"` - запуск е2е тестов с анализом покрытия кода
- `"generate": "npx prisma generate"` генерация типов из базы данных


-
## Настройка TS (typescript.json)
- `"experimentalDecorators": true` - включил поддержку декораторов, понадобятся для инверсии зависемостей
- `"emitDecoratorMetadata": true,` - поддержка метаданных
- `"moduleResolution": "node"` - интерпритатор для модулей
- `"outDir": "./dist"` - папка для сборки проекта
- `"removeComments": true,`- при сборке удаляем комменты

## Настройка .gitignore
- `/node_modules` - модули всегда можно скачать
- `/dist` - эти файлы создаются при билде проекта
- `/.clinic` - файлы отчета клиник доктора
- `/prisma/dev.db` `/prisma/dev.db-journal` - данные призмы
- `/.env` - переменные окружения