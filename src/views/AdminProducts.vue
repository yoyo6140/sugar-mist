<template>
  <loading-spinner v-if="isLoad" ></loading-spinner>

  <div class="theme-wrap admin-view" v-else>
  <div class="mt-4">
    <div class="products-header-row mb-3">
      <h3 class="mb-0 text-center">產品清單</h3>
      <div class="products-header-action">
        <product-create-modal @refresh-products="getProducts()"></product-create-modal>
      </div>
    </div>

    <!-- 桌機版：表格 (md 以上) -->
    <table class="table align-middle d-none d-md-table product-list-table">
      <thead class="table-light">
        <tr>
          <th width="120">圖片</th>
          <th>分類</th>
          <th>產品名稱</th>
          <th width="120">售價</th>
          <th width="100">是否啟用</th>
          <th width="120">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>
            <img
              :src="item.imageUrl"
              alt="產品圖片"
              class="img-thumbnail product-thumb"
              loading="lazy"
            />
          </td>
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-end">{{ item.price }}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else class="text-muted">未啟用</span>
          </td>
          <td>
            <div class="btn-group" role="group">
              <button class="icon-action-btn" @click="openEdit(item)" title="編輯" aria-label="編輯">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="icon-action-btn danger" @click="deleteProduct(item.id)" title="刪除" aria-label="刪除">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 平板 + 手機版：卡片 手機單欄 col-12 平板兩欄 col-sm-6 -->
    <div class="row d-md-none g-3">
      <div
        v-for="item in products"
        :key="item.id"
        class="col-12 col-sm-6" 
      >
        <div class="card shadow-sm h-100">
          <img
            :src="item.imageUrl"
            class="card-img-top product-img"
            alt="產品圖片"
            loading="lazy"
          />
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted">{{ item.category }}</h6>
            <h5 class="card-title">{{ item.title }}</h5>
            <p class="fw-bold text-danger">售價：{{ item.price }}</p>
          </div>
          <div class="card-footer text-center">
            <span class="badge bg-success" v-if="item.is_enabled">啟用</span>
            <span class="badge bg-secondary" v-else>未啟用</span>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button class="icon-action-btn" @click="openEdit(item)" title="編輯" aria-label="編輯">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="icon-action-btn danger" @click="deleteProduct(item.id)" title="刪除" aria-label="刪除">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <product-edit-modal
      ref="editModal"
      :product="selectedProduct"
      @refresh-products="getProducts()">
    </product-edit-modal>
  </div>
  <MyPagination :pages="pagination" @emit-pages="getProducts"></MyPagination>
</template>

<script setup>
import { ref } from 'vue'
import LoadingSpinner from "@/components/LoadingSpinner.vue"
import ProductCreateModal from "@/components/ProductCreateModal.vue"
import ProductEditModal from "@/components/ProductEditModal.vue"
import MyPagination from "@/components/MyPagination.vue"
import { API, adminHeaders } from '@/constants/api'
import { notify } from '@/components/MessageToast.vue'

const isLoad = ref(true)
const products = ref([])
const pagination = ref({})
const selectedProduct = ref({})
const editModal = ref(null)

async function getProducts(page = 1) {
  try {
    const httpRes = await fetch(API.adminProducts(page), {
      headers: adminHeaders(),
    })
    const res = await httpRes.json()

    if (res.success) {
      products.value = res.products
      pagination.value = res.pagination
    } else {
      notify.error(res.message || '取得產品失敗')
    }
  } catch (err) {
    notify.error('網路錯誤')
  } finally {
    isLoad.value = false
  }
}

function openEdit(item) {
  selectedProduct.value = { ...item }        // 複製產品資料給 Modal
  editModal.value.showModal()                // 彈出編輯 Modal
}

async function deleteProduct(id) {
  const isConfirm = confirm('確定要刪除這個產品嗎？')
  if (!isConfirm) return

  try {
    const httpRes = await fetch(API.adminProduct(id), {
      method: 'DELETE',
      headers: adminHeaders(),
    })
    const res = await httpRes.json()

    if (res.success) {
      notify.success('刪除成功')
      getProducts() // 刪除後重新取得產品列表
    } else {
      notify.error(res.message || '刪除失敗')
    }
  } catch (err) {
    notify.error('網路錯誤，刪除失敗')
  }
}

getProducts()
</script>

<style>
.product-img {
  width: 100%;
  height: 200px;
  object-fit: cover; /* 保持比例，超出部分裁切 */
  border-radius: 8px;
}

.product-thumb {
  width: 100px;
  height: 100px;
  object-fit: cover; /* 固定尺寸，保持比例裁切 */
}

.products-header-row {
  position: relative;
}
.products-header-action {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
}

.product-list-table {
  font-size: 16px;
  font-weight: 600;
  color: var(--espresso);
}
.product-list-table thead th {
  font-size: 15px;
  font-weight: 700;
  color: var(--espresso);
}
</style>
