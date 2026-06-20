FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Cài đặt dependencies (bao gồm cả sqlite3 biên dịch native nếu cần)
# Sử dụng --omit=dev để loại bỏ devDependencies giúp image nhẹ hơn
RUN npm install --omit=dev

COPY . .

# Đảm bảo thư mục dữ liệu SQLite được cấp quyền ghi
RUN touch database.sqlite && chmod 666 database.sqlite

ENV PORT=5000
ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "index.js"]
