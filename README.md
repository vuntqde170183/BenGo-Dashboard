# BenGo Admin - Hệ thống quản lý vận chuyển thông minh

BenGo Admin là giao diện quản trị dành cho người điều hành và nhân viên điều phối của hệ thống BenGo. Ứng dụng cung cấp các công cụ mạnh mẽ để quản lý chuyến đi, theo dõi tài xế, quản lý người dùng, cấu hình giá cước và theo dõi doanh thu thời gian thực.

## 🚀 Công nghệ sử dụng

- **Framework:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching:** [React Query (TanStack Query)](https://tanstack.com/query/latest)
- **Maps:** [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
- **Charts:** [Recharts](https://recharts.org/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Package Manager:** [npm](https://www.npmjs.com/)

## 📋 Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt các công cụ sau:

- [Node.js](https://nodejs.org/) (Phiên bản LTS)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (Đi kèm với Node.js)

## 🛠️ Hướng dẫn cài đặt

### 1. Clone repository
```bash
git clone https://github.com/vuntqde170183/BenGo-Admin.git
cd BenGo-Admin
```

### 2. Cài đặt các dependencies
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` ở thư mục gốc và cấu hình các biến sau:
```env
VITE_API_URL=https://bengo-backend.onrender.com/api/v1
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

### 4. Chạy ứng dụng
Khởi động môi trường phát triển:
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: `http://localhost:5173`

### 5. Build dự án
```bash
npm run build
```

## 📂 Cấu trúc thư mục

- `/src/app`: Cấu trúc routes và các trang chính (Admin, Dispatcher).
- `/src/components`: Các thành phần UI dùng chung và components từ Shadcn/UI.
- `/src/api`: Các cấu hình gọi API với Axios.
- `/src/stores`: Quản lý trạng thái toàn cục (Zustand).
- `/src/hooks`: Các custom hooks xử lý logic.
- `/src/layouts`: Các khung giao diện chính (Admin Layout, Auth Layout).
- `/src/interface`: Định nghĩa các kiểu dữ liệu (Interfaces/Types).

## ✨ Tính năng chính dành cho Quản trị viên

- [x] **Dashboard:** Thống kê doanh thu, số lượng đơn hàng, người dùng và tài xế qua biểu đồ trực quan.
- [x] **Quản lý Tài xế:** Phê duyệt hồ sơ, theo dõi trạng thái hoạt động và vị trí tài xế.
- [x] **Quản lý Đơn hàng:** Theo dõi các chuyến đi đang diễn ra, lịch sử đơn hàng và xử lý khiếu nại.
- [x] **Cấu hình Giá (Pricing):** Thiết lập giá cước linh hoạt theo quãng đường, thời gian và loại xe.
- [x] **Khuyến mãi (Promotions):** Quản lý các mã giảm giá và chương trình ưu đãi cho khách hàng.
- [x] **Quản lý Người dùng:** Theo dõi và hỗ trợ người dùng cuối.
- [x] **Hệ thống điều phối:** Giao diện dành riêng cho nhân viên điều phối để tối ưu hóa việc phân bổ chuyến đi.

---
© 2024 BenGo Team. All rights reserved.
