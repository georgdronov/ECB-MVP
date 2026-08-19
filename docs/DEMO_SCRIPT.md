# Helply Demo Script

Ориентировочная длительность: 3–5 минут.

## 1. Landing page

Показать hero, блок How it works и pricing.

Текст для voiceover:

> Helply turns company documentation into an AI assistant. A team can upload
> its knowledge, test answers inside the product, and embed the same assistant
> on a website with one script.

## 2. Create a workspace

1. Нажать `Get started`.
2. Создать аккаунт с demo email и паролем.
3. Показать dashboard и onboarding checklist.

## 3. Add knowledge

1. Открыть `Knowledge`.
2. Добавить text knowledge с названием `Returns FAQ`.
3. Использовать текст:

```text
Customers can return unused items within 30 days of delivery.
Refunds are issued to the original payment method within five business days.
Standard delivery takes three to five business days.
```

4. Показать статус `ready`.

## 4. Test the assistant

1. Открыть `Playground`.
2. Спросить: `How long do customers have to return an item?`
3. Показать ответ и `Returns FAQ` как source.
4. Спросить вопрос, которого нет в knowledge, и показать grounded response.

## 5. Embed the widget

1. Открыть `Embed`.
2. Изменить имя и accent color.
3. Нажать `Save settings`.
4. Показать live preview.
5. Скопировать generated snippet.
6. Открыть `/demo-site` и показать страницу, куда можно вставить snippet.

Для локального показа можно временно вставить snippet из Embed в devtools или
в отдельную demo HTML page.

## 6. Pricing and gates

1. Открыть `Billing`.
2. Показать Starter: 3 sources и 50 messages.
3. Нажать `Switch to Growth`.
4. Показать mock confirmation и обновлённый статус.

Финальная фраза:

> The MVP keeps the scope focused: knowledge ingestion, grounded answers,
> embeddable delivery, and a clear path from the free plan to Growth.
