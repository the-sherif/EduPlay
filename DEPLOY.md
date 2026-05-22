# Деплой EduPlay на VPS

## 1. Выбор и настройка VPS

**Hetzner** → hetzner.com → Cloud → Create Server:
- Location: **Nuremberg** или **Falkenstein** (ближе к России)
- Image: **Ubuntu 24.04**
- Type: **CX22** (2 CPU, 4GB RAM) — €3.99/мес
- SSH Key: добавь свой публичный ключ

## 2. Первичная настройка сервера

```bash
# Подключись к серверу
ssh root@IP_СЕРВЕРА

# Обновление системы
apt update && apt upgrade -y

# Установка Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# Установка PostgreSQL
apt install -y postgresql postgresql-contrib

# Установка Nginx
apt install -y nginx

# Установка PM2
npm install -g pm2
```

## 3. Настройка PostgreSQL

```bash
sudo -u postgres psql

-- Внутри psql:
CREATE USER eduplay WITH PASSWORD 'ПРИДУМАЙ_НАДЁЖНЫЙ_ПАРОЛЬ';
CREATE DATABASE eduplay OWNER eduplay;
\q

# Запусти схему базы
sudo -u postgres psql -d eduplay -f /var/www/eduplay/server/db/schema.sql
```

## 4. Загрузка проекта на сервер

```bash
# На сервере
mkdir -p /var/www/eduplay
cd /var/www/eduplay

# Клонируй репозиторий
git clone https://github.com/the-sherif/EduPlay.git .

# Установи зависимости сервера
cd server && npm install --production
```

## 5. Настройка переменных окружения

```bash
cp /var/www/eduplay/server/.env.example /var/www/eduplay/server/.env
nano /var/www/eduplay/server/.env
# Заполни все значения
```

## 6. Запуск через PM2

```bash
cd /var/www/eduplay/server
pm2 start index.js --name eduplay
pm2 save
pm2 startup  # выполни команду которую он выдаст
```

## 7. Настройка Nginx

```bash
nano /etc/nginx/sites-available/eduplay
```

Вставь:
```nginx
server {
    listen 80;
    server_name твой-домен.com www.твой-домен.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/eduplay /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## 8. SSL сертификат (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d твой-домен.com -d www.твой-домен.com
```

## 9. Обновление проекта в будущем

```bash
cd /var/www/eduplay
git pull
cd server && npm install --production
pm2 restart eduplay
```
