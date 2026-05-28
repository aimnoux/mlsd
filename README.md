# MLSD Cases

Сборник кейсов по ML System Design с реальных собеседований на позиции Data Scientist и ML Engineer.

Связан с Telegram-каналом [Fire Me If You Can](https://t.me/fmiyc_tg).

**Сайт:** https://aimnoux.github.io/mlsd/

## О проекте

Сайт собирает и структурирует реальные задачи по ML System Design, которые встречаются на технических интервью. Все кейсы обработаны по единой методологии:

1. Записи интервью расшифрованы с помощью LLM
2. Из расшифровок извлечены вопросы и задачи
3. Контент стандартизирован и отформатирован с помощью LLM

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

Размер бандла: ~31 kB JS / ~8 kB CSS (~13 kB + 2 kB gzip).

## Разработка

```bash
npm install
npm run dev
```

## Деплой

Деплой происходит автоматически через GitHub Actions при пуше в ветку `main`.

Первый раз нужно включить GitHub Pages в настройках репозитория:
`Settings → Pages → Source → GitHub Actions`
