# Piter-Westi

Одностраничный адаптивный лендинг питомника вест-хайленд-уайт-терьеров.

## Запуск

Без установки зависимостей:

```powershell
python -m http.server 4173
```

Откройте `http://localhost:4173`.

Также `index.html` можно открыть напрямую в браузере, но локальный сервер корректнее обрабатывает видео и SEO-файлы.

## Контент перед публикацией

- Замените ссылки WhatsApp и Telegram в `index.html`.
- Замените номер `+70000000000` на актуальный.
- При наличии домена укажите абсолютный адрес в Open Graph и `sitemap.xml`.

## Видео

Hero использует `piter-westi-puppy-v2.mp4` с `autoplay`, `muted`, `playsinline`, `loop`, `preload="auto"`, без controls. Fallback: `assets/westie-portrait.jpg` и текст внутри тега `<video>`.
