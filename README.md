# ИдёмВКино — система онлайн-бронирования билетов в кинотеатр

Дипломный проект: публичный сайт бронирования билетов и административная панель для управления залами, сеансами и продажами.

## Стек

- **Backend:** PHP 8.2+, Laravel 13, SQLite, Laravel Sanctum
- **Frontend:** React 18, Vite, React Router
- **QR-коды:** [PHP QR Code](https://phpqrcode.sourceforge.net/) (`backend/app/Libraries/phpqrcode.php`, PNG при наличии GD) + SVG fallback через `chillerlan/php-qrcode`

## Структура проекта

```
fs-2-diplom/
├── backend/     # Laravel API
├── frontend/    # React SPA (клиент + /admin)
├── layouts/     # исходная HTML/CSS вёрстка 
└── README.md
```

## Быстрый старт

### 1. Backend

```bash
cd backend
composer install
cp .env.example .env   
php artisan key:generate
type nul > database\database.sqlite  
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

API будет доступен по адресу: `http://localhost:8000`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   
npm run dev
```

Приложение откроется по адресу: `http://localhost:5173`

## Учётные данные администратора

После выполнения сидов:

- **Email:** `admin@cinema.local`
- **Пароль:** `password`

Изменить можно в `backend/.env`:

```
ADMIN_EMAIL=admin@cinema.local
ADMIN_PASSWORD=password
```

## Маршруты приложения

| URL | Описание |
|-----|----------|
| `/` | Расписание сеансов |
| `/hall/:seanceId` | Выбор мест |
| `/payment` | Подтверждение бронирования |
| `/ticket/:code` | Электронный билет с QR |
| `/admin/login` | Вход администратора |
| `/admin` | Панель администратора |

## API (основное)

Публичные (`/api/v1`):

- `GET /schedule?date=YYYY-MM-DD`
- `GET /seances/{id}`
- `POST /bookings`
- `GET /bookings/{code}`
- `GET /bookings/{code}/qr`

Админ (`/api/v1/admin`, Bearer token):

- `POST /login`, `POST /logout`
- CRUD залов, фильмов, сеансов
- `PUT /halls/{id}/layout`, `PUT /halls/{id}/prices`
- `PATCH /settings/sales` — открыть/приостановить продажи

## Бизнес-логика

1. **Зал** создаётся неактивным. Активируется кнопкой в разделе «Управление залами».
2. **Продажи** открываются глобально кнопкой «Открыть продажу билетов» в админке.
3. Гость видит расписание только когда продажи открыты и зал активен.
4. **Пароли** хранятся в виде bcrypt-хеша (`Hash::make`).
5. **Валидация** выполняется на сервере через Form Request классы.
6. **QR-код** содержит JSON с кодом бронирования, ID сеанса и списком мест.

## Миграции и сиды

```bash
cd backend
php artisan migrate:fresh --seed
```

Сиды создают:

- администратора;
- демо-зал «Зал 1» с сеткой 8×8;
- демо-фильм и сеанс на сегодня в 18:30.

## Сценарий проверки

1. Войти в `/admin/login`.
2. Создать/настроить зал, цены, фильм и сеанс.
3. Активировать зал и нажать «Открыть продажу билетов».
4. На главной странице выбрать сеанс, места и получить QR-билет.

## Технические особенности

- **БД:** SQLite (`backend/database/database.sqlite`)
- **Постеры:** загружаются в `backend/storage/app/public/posters`
- **CORS:** разрешён origin из `FRONTEND_URL` (по умолчанию `http://localhost:5173`)
- **Аутентификация админа:** Laravel Sanctum (Bearer token)