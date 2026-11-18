## 作品連結

- Demo：部署於 Vercel（網址請自行補上）

## 專案簡介

以 **Vue 3** 製作的電商前台/後台練習專案，透過 **Vue Router** 串接各頁面，並將常用 UI（例如 navbar、footer、載入特效）抽成可重複使用的元件。

## 功能與頁面結構

### 管理者平台（後台）

- 登入
- 商品管理
- 訂單管理
- 優惠券管理

### 使用者平台（前台）

- 首頁
- 商品介紹
- 購物車
- 結帳確認

## 技術與套件

- **前端**：Vue 3（`<script setup>` Composition API）、Vue Router
- **建置工具**：Vite
- **UI**：Bootstrap 5、HTML、CSS、JavaScript
- **表單驗證**：VeeValidate（含 i18n / rules）
- **其他**：mitt、js-cookie

## 資料夾結構

```text
my-omamori/
├─ public/                 # 原樣輸出的靜態資源（圖片等）
│  └─ images/
├─ src/
│  ├─ assets/
│  ├─ components/          # navbar / footer / loading / modal 等共用元件
│  ├─ methods/             # 共用方法（例如事件總線）
│  ├─ router/              # 路由設定
│  ├─ views/               # 頁面（前台/後台）
│  │  ├─ AdminCoupons.vue
│  │  ├─ AdminOrders.vue
│  │  ├─ AdminProducts.vue
│  │  ├─ CallMe.vue
│  │  ├─ DashBoard.vue
│  │  ├─ LoginForm.vue
│  │  ├─ MyHome.vue
│  │  ├─ UserCarts.vue
│  │  ├─ UserCheckout.vue
│  │  ├─ UserGoods.vue
│  │  └─ UserProduct.vue
│  ├─ App.vue
│  └─ main.js
├─ index.html
├─ .env
├─ package.json
└─ vite.config.js
```

## 開發與部署

此專案使用 **Vite**。

### 安裝

```bash
npm install
```

### 本機開發

```bash
npm run serve
```

預設網址為 `http://localhost:5173`（Vite 預設 port，被佔用時會自動換一個）。

### 建置

```bash
npm run build
```

### 部署

只部署在 **Vercel**（`vercel.json` 已設定 SPA rewrite，支援 `vue-router` 的乾淨網址模式）。




