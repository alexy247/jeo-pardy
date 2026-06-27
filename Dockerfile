# Этап 1: Сборка приложения
FROM node:20-alpine AS builder

# Принимаем аргументы для переменных окружения
ARG VITE_APP_SUPABASE_URL
ARG VITE_APP_SUPABASE_ANON_KEY
ARG VITE_REACT_APP_TINYBIRD_HOST
ARG VITE_REACT_APP_TINYBIRD_APPEND_TOKEN

# Устанавливаем их как переменные окружения на этапе сборки
ENV VITE_APP_SUPABASE_URL=$VITE_APP_SUPABASE_URL
ENV VITE_APP_SUPABASE_ANON_KEY=$VITE_APP_SUPABASE_ANON_KEY
ENV VITE_REACT_APP_TINYBIRD_HOST=$VITE_REACT_APP_TINYBIRD_HOST
ENV VITE_REACT_APP_TINYBIRD_APPEND_TOKEN=$VITE_REACT_APP_TINYBIRD_APPEND_TOKEN

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код проекта
COPY . .

# Собираем приложение
RUN npm run build

# Этап 2: Сервер для раздачи статики (Nginx)
FROM nginx:alpine

# Копируем собранные файлы из предыдущего этапа в папку Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем кастомный конфиг Nginx (опционально)
# COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт 80 (стандартный порт Nginx)
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]