# Stage 1: Build ứng dụng React với Node
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Khai báo tham số cổng API lúc build (Nginx sẽ proxy nên dùng /api là tối ưu)
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Stage 2: Khởi chạy Web Server bằng Nginx để phân phối static files
FROM nginx:alpine

# Sao chép file build từ stage 1 vào thư mục html của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Sao chép tệp cấu hình Nginx có reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
