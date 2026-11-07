# WebStudio-SCSS

Проєкт WebStudio (GoITeens, Frontend 1). Урок 68 — **ретинізація графіки: 2x, 3x дисплеї та оптимізація**.

Проєкт переведено з CSS на SCSS (`scss/main.scss` компілюється в `css/main.css`).

## Як перевірити ретинізацію в DevTools

1. Відкрити DevTools → `Ctrl+Shift+P` → `Show rendering`.
2. Внизу знайти `Emulate CSS media feature DPR` і поставити `2`.
3. Вкладка `Network` → у фільтрі `Img`: усі контентні зображення завантажуються з суфіксом `@2x`.

 або так: DevTools → Devices toolbar → iPhone → DPR=2 → Network/Img.

## Що зроблено

### 1. Контентні зображення — `<picture>` з дескрипторами 1x/2x (3x)

**"Чим ми займаємося" (index.html):** `work-1.png`, `work-2.png`, `work-3.png` + `@2x` (740×588).

**Команда (index.html):** `team-1…4.jpg` — 3 ретина-версії (`1x 270×260`, `2x 540×520`, `3x 810×780`).

**Портфоліо (portfolio.html):** 6 карток `pf-*.png` + `@2x` (740×588).

Приклад підключення:

```html
<picture>
    <source type="image/png" srcset="./imgs/work-1@2x.png 2x, ./imgs/work-1.png 1x">
    <img src="./imgs/work-1.png" alt="Робоче місце розробника" width="370" height="294">
</picture>
```

### 2. Фонове зображення — ретинізація через SCSS

У hero на планшеті та десктопі додано фото-фон (`hero-bg.jpg`) із затемненням
через градієнт. Ретинізація зроблена вкладеними медіазапитами:

```scss
.hero {
    // мобільний — тільки градієнти
    background:
        radial-gradient(...),
        linear-gradient(...);

    @media (min-width: $breakpoint-tablet) {
        background: ..., url("../imgs/hero-bg.jpg") center / cover no-repeat;

        // ретина (DPR 2+) — працює разом з min-width
        @media (min-resolution: 2dppx) {
            background: ..., url("../imgs/hero-bg@2x.jpg") center / cover no-repeat;
        }
    }
}
```

### 3. Оптимізація

- усі JPEG перетиснуті (`-quality 70–88`), маса `@2x/3x` файлів під контролем (загальний `"imgs" ≈ 3 МБ`);
- `width` і `height` прописані в `<img>` — layout не "стрибає" під час завантаження;
- закомпільований `css/main.css` не редагується руками — правки тільки в SCSS.

### Бонус: mixin `retina` (scss/_mixins.scss)

```scss
@mixin retina {
    @media (min-resolution: 2dppx) {
        @content;
    }
}
```

Різниця в кількості рядків **до і після**:

```scss
// ДО — кожен ретина-блок повторює повний @media (4–5 рядків на блок)
@media (min-width: $breakpoint-tablet) and (min-resolution: 2dppx) {
    .hero {
        background:
            linear-gradient(rgba(47, 48, 58, 0.8), rgba(47, 48, 58, 0.8)),
            url('../imgs/hero-bg@2x.jpg') center / cover no-repeat;
    }
}
// = 9 рядків × на кожен ретинізований фон = 9

// ПІСЛЯ — 2 рядки на блок (десь + фоновий градієнт)
@include retina {
    background:
        linear-gradient(rgba(47, 48, 58, 0.8), rgba(47, 48, 58, 0.8)),
        url('../imgs/hero-bg@2x.jpg') center / cover no-repeat;
}
// = 7 рядків, і цей вхід вкладений у @media (min-width: ...) —
// за потреби додати ще 2–3 фони виграш зростає
```

## Як запускати

```bash
npm install        # встановити sass
npm run watch:css  # авто-компіляція scss -> css
```

Відкривати через live-сервер (або `python3 -m http.server`), бо медіазапити
ретина-фону працюють з будь-якого протоколу, але спрайти (якщо додаються) потребують http.
