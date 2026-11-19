# 後端 API 清單

來源：`src/constants/api.js`。網址組成規則：

```
{API_BASE}/{路徑}
```

- `API_BASE` 來自 `.env` 的 `VITE_API`
- 大部分路徑會再插入 `api/{API_PATH}` 這一段（`API_PATH` 來自 `.env` 的 `VITE_PATH`），只有登入例外，直接接在 `API_BASE` 後面。

## 認證

| 方法 | 路徑 |
| --- | --- |
| POST | `/admin/signin` |

## 管理端｜產品

後台管理用的商品管理功能。

| 方法 | 路徑 |
| --- | --- |
| GET | `/api/{API_PATH}/admin/products/?page={page}` |
| PUT | `/api/{API_PATH}/admin/product/{id}` |
| DELETE | `/api/{API_PATH}/admin/product/{id}` |
| POST | `/api/{API_PATH}/admin/product` |
| POST | `/api/{API_PATH}/admin/upload` |

## 管理端｜訂單

後台訂單管理。

| 方法 | 路徑 |
| --- | --- |
| GET | `/api/{API_PATH}/admin/orders/?page={page}` |
| PUT | `/api/{API_PATH}/admin/order/{id}` |
| DELETE | `/api/{API_PATH}/admin/order/{id}` |

## 管理端｜文章

後台文章管理，目前前端尚未串接此功能。

| 方法 | 路徑 |
| --- | --- |
| GET | `/api/{API_PATH}/admin/articles/?page={page}` |
| POST | `/api/{API_PATH}/admin/article` |
| PUT | `/api/{API_PATH}/admin/article/{id}` |
| DELETE | `/api/{API_PATH}/admin/article/{id}` |

## 前台｜商品

| 方法 | 路徑 |
| --- | --- |
| GET | `/api/{API_PATH}/products/all` |
| GET | `/api/{API_PATH}/product/{id}` |

## 前台｜購物車

| 方法 | 路徑 |
| --- | --- |
| GET | `/api/{API_PATH}/cart` |
| POST | `/api/{API_PATH}/cart` |
| PUT | `/api/{API_PATH}/cart/{id}` |
| DELETE | `/api/{API_PATH}/cart/{id}` |

## 前台｜訂單與付款

| 方法 | 路徑 |
| --- | --- |
| POST | `/api/{API_PATH}/order` |
| GET | `/api/{API_PATH}/order/{id}` |
| POST | `/api/{API_PATH}/pay/{orderId}` |

## 前台｜文章

目前前端尚未串接此功能。

| 方法 | 路徑 |
| --- | --- |
| GET | `/api/{API_PATH}/articles` |
| GET | `/api/{API_PATH}/article/{id}` |
