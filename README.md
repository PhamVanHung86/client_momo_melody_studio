# Momo's Melody Studio — Client

Frontend cửa hàng online, xây bằng React + Vite.

## Công nghệ

- React 19, React Router
- Tailwind CSS
- Framer Motion

## Cài đặt

```bash
npm install
cp .env.example .env   # chỉnh VITE_API_URL cho phù hợp
npm run dev
```

## Scripts

npm run dev - Chạy dev server
npm run build - Build production
npm run preview - Xem thử bản build
npm run lint - Kiểm tra lỗi code

## Cấu trúc thư mục

```
src/
├── api/         # gọi API backend (client.js)
├── components/  # component dùng chung
├── context/     # Auth, Shop, Theme
├── pages/       # từng trang
└── utils/       # hàm tiện ích
```

## Biến môi trường

`VITE_API_URL` — địa chỉ backend API (xem `.env.example`).
