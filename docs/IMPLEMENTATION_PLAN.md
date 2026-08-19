# Embeddable Chatbot Builder — Implementation Plan

> Living document. We check items with `- [x]` as they are completed and verified.
> Product copy and UI are in **English**. This plan is in Russian for our own coordination.

## Продукт

Приложение, которое превращает документы и знания компании в чат-бота.
Бот доступен внутри приложения как ChatGPT-подобный интерфейс и как embeddable-виджет
для встраивания на сторонние сайты.

## Стек

- Next.js (App Router) + TypeScript
- Tailwind CSS
- SQLite (`better-sqlite3`) — локальное хранилище
- OpenRouter — chat completions и embeddings
- `pdf-parse` (PDF), `mammoth` (DOCX), нативно TXT/MD
- Локальная email/password авторизация (сессии через httpOnly cookie)

## Границы MVP

Реализуем:

- Регистрация/вход, изоляция данных по пользователю
- Один chatbot на пользователя
- Загрузка PDF, DOCX, TXT, MD + добавление knowledge вручную
- Автоматический разбор, чанкинг и индексация (embeddings)
- RAG-ответы строго по загруженному контенту + источники
- ChatGPT-подобный playground со стримингом
- Настоящий embed script + iframe-виджет
- Demo website для проверки виджета
- Free/Pro pricing + mock billing + серверные лимиты
- Адаптивный landing page
- Presentation deliverable (screenshare script)

Не делаем (вне scope):

- Команды и роли, несколько ботов, analytics dashboard
- CRM-интеграции, scraping сайтов
- Real Stripe, OAuth, password recovery
- Продвинутый редактор промптов, обучение моделей

## Pricing

- Free ($0): 3 документа, 50 сообщений/мес, 5 MB/файл, 1 бот, widget, branding "Powered by"
- Pro ($29/мес): 50 документов, 2000 сообщений/мес, 15 MB/файл, без branding, расширенная кастомизация

Billing — mock, но flow выглядит как реальный SaaS checkout.

---

# Имплементационные шаги

## Шаг 0. Инициализация проекта
- [x] Next.js + TypeScript + Tailwind проект создан
- [x] Структура папок (`app`, `lib`, `components`, `docs`)
- [x] `.env.example` с `OPENROUTER_API_KEY`, `SESSION_SECRET`
- [x] `.gitignore` (node_modules, .env, *.sqlite)
- [x] README со скриптами запуска
- [x] `npm run dev` стартует пустую страницу
- [x] `npm run lint` и `npm run typecheck` проходят без ошибок
- **Готово когда:** dev-сервер запускается без ошибок, Tailwind применяется

## Шаг 1. Дизайн-система
- [x] Токены цвета, типографика, spacing в Tailwind config
- [x] Базовые компоненты: Button, Input, Card, Badge, Modal, Toast
- [x] Состояния hover/focus/disabled/loading
- **Готово когда:** компоненты переиспользуемы и адаптивны

## Шаг 2. База данных (SQLite)
- [x] Схема: `users`, `chatbot_settings`, `documents`, `document_chunks`,
      `conversations`, `messages`, `subscription`, `monthly_usage`
- [x] Инициализация БД и миграции при старте
- [x] Хелперы доступа к данным
- **Готово когда:** таблицы создаются автоматически, запись/чтение работают

## Шаг 3. Авторизация
- [x] Регистрация (email + password, хеш bcrypt/scrypt)
- [x] Вход и выход
- [x] Сессия через httpOnly cookie
- [x] Серверная защита `/app/*` через redirect
- [x] Изоляция данных по `userId` в auth/db слоях
- [x] HTTP smoke test: guest redirect, register, authenticated access
- **Готово когда:** нельзя увидеть чужие данные, guest не заходит в `/app`

## Шаг 4. Landing page
- [x] Hero + value proposition + CTA
- [x] How it works
- [x] Features
- [x] Пример embed-кода
- [x] Pricing (Free/Pro)
- [x] Footer
- [x] Полная адаптивность
- **Готово когда:** страница убедительна и responsive на mobile/desktop

## Шаг 5. App shell + Dashboard
- [x] Сайдбар/навигация (Dashboard, Knowledge, Playground, Embed, Billing)
- [x] Dashboard: статус бота, кол-во документов, usage, тариф, быстрые действия
- [x] Responsive desktop sidebar и mobile navigation
- [x] Onboarding checklist для первого запуска
- **Готово когда:** навигация работает, метрики берутся из БД

## Шаг 6. Загрузка и разбор документов
- [x] Drag-and-drop upload + выбор файла
- [x] Валидация типа и размера (по тарифу, на сервере)
- [x] Извлечение текста: PDF, DOCX, TXT, MD
- [x] Очистка и чанкинг с overlap
- [x] Статусы Processing/Ready/Failed
- [x] Удаление с подтверждением
- [x] Вкладка Text knowledge (title + текст)
- **Готово когда:** все 4 формата + ручной текст индексируются, ошибки видны

## Шаг 7. Embeddings и индексация (OpenRouter)
- [x] Клиент OpenRouter embeddings
- [x] Batch-embeddings для чанков
- [x] Сохранение векторов в БД
- [x] Обработка ошибок API и лимитов
- [x] Реальный API smoke test с бесплатной embeddings-моделью
- **Готово когда:** после загрузки документ переходит в Ready с чанками+векторами

## Шаг 8. RAG-поиск и chat
- [x] Embedding вопроса
- [x] Cosine similarity по чанкам пользователя
- [x] Выбор top-K релевантных чанков
- [x] Сборка промпта: контекст + история + вопрос
- [ ] Стриминг ответа
- [x] Возврат источников
- [x] Отказ выдумывать при отсутствии контекста
- **Готово когда:** вопрос по документу даёт корректный ответ с источником

## Шаг 9. Playground
- [x] ChatGPT-подобный UI, история диалога
- [ ] Streaming + loading states
- [x] Источники под ответом
- [x] Empty state с примерами вопросов
- [x] Сохранение conversations/messages
- **Готово когда:** полноценный диалог с ботом работает и сохраняется

## Шаг 10. Embed widget + demo website
- [x] Настройки: имя, welcome message, accent color, позиция
- [x] Live preview + готовый embed snippet + копирование
- [x] `public/widget.js`: floating launcher + iframe
- [x] Публичная страница виджета `/embed/[botId]`
- [x] Публичный chat API по `chatbotId` (без секретов)
- [x] `/demo-site` с реальным подключением скрипта
- [ ] Branding "Powered by" на Free
- **Готово когда:** виджет реально работает на demo website и отвечает по докам

## Шаг 11. Pricing и mock billing
- [x] Страница Billing: текущий тариф, usage, сравнение планов
- [x] Mock checkout (upgrade/downgrade)
- [x] Сохранение тарифа в БД
- [x] Серверные gates: документы, сообщения, размер файла, branding
- **Готово когда:** Free-лимиты реально блокируют, upgrade снимает ограничения

## Шаг 12. Безопасность публичного бота
- [x] Публичный `chatbotId` без секретов
- [x] Ограничение длины вопроса
- [x] Простое rate limiting
- [x] Безопасный вывод (без исполнения HTML)
- **Готово когда:** публичный endpoint устойчив к базовым злоупотреблениям

## Шаг 13. Полировка и состояния
- [x] Loading/empty/error states на всех ключевых страницах
- [x] Подтверждение удаления и серверные error messages
- [x] Проверка адаптивности mobile → desktop в layout-классах
- [x] Копирайтинг и микротексты
- **Готово когда:** продукт ощущается завершённым

## Шаг 14. Проверка качества
- [x] `npm run lint` без ошибок
- [x] `npm run typecheck` без ошибок
- [x] `npm run build` успешен
- [x] Ручной прогон основного flow с бесплатными OpenRouter models
- **Готово когда:** все проверки зелёные

## Шаг 15. Презентация
- [x] `docs/DEMO_SCRIPT.md` (3–5 мин screenshare)
- [x] Тестовый документ с известными фактами
- [x] Обновлённый README (запуск, env, демо)
- **Готово когда:** демо можно провести по сценарию без импровизации

---

# Definition of Done (весь MVP)

- [ ] Проект запускается одной командой
- [ ] PDF, DOCX, TXT, MD и ручной текст загружаются и индексируются
- [ ] Вопрос по документу даёт корректный ответ с источником
- [ ] На неизвестный вопрос бот не выдумывает информацию
- [ ] Виджет работает на demo website, embed snippet копируется
- [ ] Free-лимиты блокируют превышение, mock upgrade снимает ограничения
- [ ] Авторизация изолирует данные пользователей
- [ ] Все страницы адаптивны (mobile + desktop)
- [ ] lint, typecheck, build проходят
- [ ] Готов сценарий презентации
