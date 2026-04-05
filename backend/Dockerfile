# --- GIAI ĐOẠN 1: BUILD (Chuẩn bị môi trường) ---
# Sử dụng node:20-alpine để giảm kích thước image và tăng tốc độ build
FROM node:20-alpine AS builder

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép các file cấu hình dependency trước để tận dụng Docker Cache
COPY package*.json ./

# Cài đặt toàn bộ dependencies (bao gồm cả dev-dependencies nếu cần build)
RUN npm install

# Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# --- GIAI ĐOẠN 2: RUN (Môi trường thực thi tinh gọn) ---
FROM node:20-alpine

# Thiết lập biến môi trường NODE_ENV là production
ENV NODE_ENV=production

WORKDIR /app

# Chỉ sao chép các file cần thiết từ giai đoạn builder để giảm dung lượng
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./
COPY --from=builder /app/src ./src

# Chỉ cài đặt các production dependencies (không cài dev-dependencies)
RUN npm install --only=production

# Mở cổng 5000 cho backend (Express)
EXPOSE 5000

# Lệnh "bật công tắc" để chạy ứng dụng
CMD ["node", "server.js"]
