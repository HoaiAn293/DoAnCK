# --- GIAI ĐOẠN 1: BUILD (Thiết kế mã nguồn) ---
# Tải môi trường node phiên bản mới nhất để đóng gói
FROM node:20-alpine AS build-stage

# Thiết lập thư mục làm việc /app để thao tác
WORKDIR /app

# Sao chép file cấu hình và cài đặt dependencies một lần cho tất cả
COPY package*.json ./
RUN npm install

# Sao chép toàn bỗ mã nguồn React Native / Expo của bạn
COPY . .

# Biên dịch code sang dạng Web tĩnh (HTML/JS/CSS)
# Chỉ xuất file phân phối cho Web (--platform web)
RUN npx expo export --platform web

# --- GIAI ĐOẠN 2: SERVE (Triển khai hệ thống) ---
# Sử dụng Nginx-alpine chuyên biệt để phục vụ các file web nhẹ nhàng
FROM nginx:stable-alpine as production-stage

# Lấy thư mục 'dist' đã đóng gói từ builder (GĐ1) sang thư mục phục vụ của Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Mở cổng 80 cho các sinh viên hoặc người dùng truy cập
EXPOSE 80

# Lệnh "bật công tắc" để chạy server Web Nginx
CMD ["nginx", "-g", "daemon off;"]
