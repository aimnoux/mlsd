# MLSD Cases

Сборник кейсов по ML System Design с реальных собеседований на позиции Data Scientist и ML Engineer.

Связан с Telegram-каналом [maxouni.ai | by maxim ogorodnik](https://t.me/maxouniai).

**Сайт:** https://aimnoux.github.io/mlsd/

## О проекте

Сайт собирает и структурирует реальные задачи по ML System Design, которые встречаются на технических интервью.

## Кейсы

Сейчас в сборнике **17 кейсов** по 8 доменам.

| Направление | Кол-во |
|-------------|--------|
| ClassicML   | 15     |
| RecSys      | 2      |

| Домен       | Кол-во |
|-------------|--------|
| Retail      | 6      |
| Travel      | 3      |
| AdTech      | 2      |
| Media       | 2      |
| FinTech     | 1      |
| Telecom     | 1      |
| RealEstate  | 1      |
| Logistics   | 1      |

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
