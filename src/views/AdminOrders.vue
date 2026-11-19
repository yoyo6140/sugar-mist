<template>
  <loading-spinner v-if="isLoad" ></loading-spinner>
  <div class="theme-wrap admin-view" v-else>
  <div class="mt-4">
    <h3 class="mb-3 text-center">訂單列表</h3>

    <!-- 訂單列表 -->
    <table class="table align-middle order-list-table">
      <thead class="table-light">
        <tr>
          <th>訂單編號</th>
          <th>訂購人</th>
          <th>Email</th>
          <th width="100" class="text-center">付款狀態</th>
          <th width="100" class="text-center">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td class="order-id">{{ order.id }}</td>
          <td>{{ order.user ? order.user.name : '' }}</td>
          <td>{{ order.user ? order.user.email : '' }}</td>
          <td class="text-center">
            <span v-if="order.is_paid" class="badge bg-success">已付款</span>
            <span v-else class="badge bg-secondary">未付款</span>
          </td>
          <td class="text-center">
            <div class="btn-group" role="group">
              <button class="icon-action-btn" @click="openModal(order)" title="詳情" aria-label="詳情">
                <i class="bi bi-eye"></i>
              </button>
              <button class="icon-action-btn danger" @click="deleteOrder(order.id)" title="刪除" aria-label="刪除">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="!orders.length" class="text-muted text-center py-4">目前沒有訂單</p>
  </div>

    <!-- Modal -->
    <div class="modal fade" ref="orderModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">訂單詳情</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <table class="table table-sm order-detail-table">
              <tbody>
                <tr>
                  <th width="90">訂單編號</th>
                  <td class="order-id">{{ selectedOrder.id }}</td>
                </tr>
                <tr>
                  <th>訂購人</th>
                  <td>{{ selectedOrder.user ? selectedOrder.user.name : '' }}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{{ selectedOrder.user ? selectedOrder.user.email : '' }}</td>
                </tr>
                <tr>
                  <th>地址</th>
                  <td>{{ selectedOrder.user ? selectedOrder.user.address : '' }}</td>
                </tr>
                <tr>
                  <th>電話</th>
                  <td>{{ selectedOrder.user ? selectedOrder.user.tel : '' }}</td>
                </tr>
                <tr>
                  <th>付款狀態</th>
                  <td>
                    <span v-if="selectedOrder.is_paid" class="badge bg-success">已付款</span>
                    <span v-else class="badge bg-secondary">未付款</span>
                  </td>
                </tr>
                <tr v-if="selectedOrder.message">
                  <th>留言</th>
                  <td>{{ selectedOrder.message }}</td>
                </tr>
              </tbody>
            </table>

            <h6 class="order-detail-subtitle">商品清單</h6>
            <table class="table table-sm order-detail-table order-products-table">
              <tbody>
                <tr v-for="(prod, key) in selectedOrder.products" :key="key">
                  <td>{{ prod.product.title }}</td>
                  <td class="text-center">x {{ prod.qty }}</td>
                  <td class="text-end">NT$ {{ prod.final_total || (prod.product?.price * prod.qty) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="closeModal">關閉</button>
          </div>
        </div>
      </div>
    </div>

  </div>
  <my-pagination :pages="pagination" @emit-pages="getOrders"></my-pagination>
</template>

<script setup>
import { ref } from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min'
import MyPagination from '@/components/MyPagination.vue'
import { API, adminHeaders } from '@/constants/api'
import { notify } from '@/components/MessageToast.vue'

defineEmits(['update-product'])

const isLoad = ref(true)
const orders = ref([])
const selectedOrder = ref({
  user: {},
  products: [],
  message: '',
  is_paid: false,
  id: ''
})
const orderModal = ref(null)
let modalInstance = null
const pagination = ref({})

// 取得訂單
async function getOrders(page = 1) {
  isLoad.value = true
  try {
    const httpRes = await fetch(API.adminOrders(page), {
      headers: adminHeaders(),
    })
    const res = await httpRes.json()

    if (res.success) {
      orders.value = res.orders
      pagination.value = res.pagination
    } else {
      notify.error(res.message || '取得訂單失敗')
    }
  } catch (err) {
    notify.error('網路錯誤')
  } finally {
    isLoad.value = false
  }
}

// 刪除訂單
async function deleteOrder(orderId) {
  if (!confirm('確定要刪除此訂單嗎？')) return

  try {
    const httpRes = await fetch(API.adminOrder(orderId), {
      method: 'DELETE',
      headers: adminHeaders(),
    })
    const res = await httpRes.json()

    if (res.success) {
      notify.success('刪除成功')
      // 刪除成功後重新取得訂單
      getOrders()
    } else {
      notify.error(res.message || '刪除失敗')
    }
  } catch (err) {
    notify.error('網路錯誤，刪除失敗')
  }
}

function openModal(order) {
  selectedOrder.value = order
  if (!modalInstance) {
    modalInstance = new Modal(orderModal.value)
  }
  modalInstance.show()
}

function closeModal() {
  if (modalInstance) modalInstance.hide()
  document.activeElement.blur()
}

getOrders()
</script>

<style scoped>
.order-id {
  font-family: var(--latin);
  font-size: 13px;
  color: var(--muted);
}

.order-list-table {
  font-size: 16px;
  font-weight: 600;
  color: var(--espresso);
}
.order-list-table thead th {
  font-size: 15px;
  font-weight: 700;
  color: var(--espresso);
}

/* ── 訂單詳情 Modal ── */
.modal-content {
  border-radius: 0;
  border: 1px solid var(--hairline);
  background: var(--paper);
}
.modal-header,
.modal-footer {
  border-color: var(--hairline);
}
.modal-title {
  font-family: var(--serif);
  font-weight: 500;
  letter-spacing: .06em;
  color: var(--espresso);
}

.order-detail-table {
  margin-bottom: var(--s4);
}
.order-detail-table th,
.order-detail-table td {
  border-color: var(--hairline);
  vertical-align: middle;
}
.order-detail-table th {
  width: 90px;
  color: var(--muted);
  font-weight: 400;
}
.order-detail-subtitle {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 15px;
  letter-spacing: .04em;
  margin-bottom: var(--s2);
  padding-top: var(--s2);
  border-top: 1px solid var(--hairline);
}
.order-products-table td {
  border-color: var(--hairline);
}
.order-products-table .text-end {
  font-family: var(--latin);
  color: var(--rose);
}
</style>
