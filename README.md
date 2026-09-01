# MLSD Cases

Сборник кейсов по ML System Design с реальных собеседований на позиции Data Scientist и ML Engineer.

Связан с Telegram-каналом [maxouni.ai | by maxim ogorodnik](https://t.me/maxouniai).

**Сайт:** https://aimnoux.github.io/mlsd/

## О проекте

Сайт собирает и структурирует реальные задачи по ML System Design, которые встречаются на технических интервью.

## Кейсы

Сейчас в сборнике **45 кейсов** по 12 доменам.

Кейс может нести несколько направлений сразу, поэтому сумма по направлениям больше числа кейсов.

| Направление  | Кол-во |
|--------------|--------|
| Classic ML   | 28     |
| AI-engineer  | 9      |
| LLM-engineer | 5      |
| RecSys       | 4      |
| CV           | 3      |

| Домен      | Кол-во |
|------------|--------|
| Retail     | 16     |
| FinTech    | 6      |
| Enterprise | 4      |
| Travel     | 3      |
| AdTech     | 3      |
| Media      | 3      |
| Telecom    | 2      |
| RealEstate | 2      |
| Logistics  | 2      |
| Legal      | 2      |
| Social     | 1      |
| Gambling   | 1      |

## Авторы сборника

- Максим Огородник — [Telegram](https://t.me/maxouniai)
- Григорий Чернышов — [Telegram](https://t.me/doommot_channel)
- Рома Филонов — [Telegram](https://t.me/Ai_bolno_ml), [YouTube](https://www.youtube.com/@AI_bolno_ml)

## Технологии

- **Vite + TypeScript** — сборка, без фреймворков
- **Vanilla TS** — вся интерактивность
- **Plain CSS** с CSS-переменными — стили и темы
- **GitHub Pages** — хостинг
- **GitHub Actions** — автодеплой при push в main

## Разработка

```bash
npm install
npm run dev
```

## Деплой

Деплой происходит автоматически через GitHub Actions при пуше в ветку `main`.

Первый раз нужно включить GitHub Pages в настройках репозитория:
`Settings → Pages → Source → GitHub Actions`
