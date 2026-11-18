<template>
  <loading-spinner v-if="isLoad" ></loading-spinner>
  <div class="container mt-4" v-else>

    <!-- 訂單列表 -->
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>訂單編號</th>
          <th>訂購人</th>
          <th>Email</th>
          <th>付款狀態</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.user ? order.user.name : '' }}</td>
          <td>{{ order.user ? order.user.email : '' }}</td>
          <td>{{ order.is_paid ? '已付款' : '未付款' }}</td>
          <td>
            <button class="btn btn-primary btn-sm me-1" @click="openModal(order)">詳情</button>
            <button class="btn btn-danger btn-sm" @click="deleteOrder(order.id)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" ref="orderModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">訂單詳情</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p><strong>訂單編號：</strong> {{ selectedOrder.id }}</p>
            <p><strong>訂購人：</strong> {{ selectedOrder.user ? selectedOrder.user.name : '' }}</p>
            <p><strong>Email：</strong> {{ selectedOrder.user ? selectedOrder.user.email : '' }}</p>
            <p><strong>地址：</strong> {{ selectedOrder.user ? selectedOrder.user.address : '' }}</p>
            <p><strong>電話：</strong> {{ selectedOrder.user ? selectedOrder.user.tel : '' }}</p>
            <p><strong>留言：</strong> {{ selectedOrder.message }}</p>

            <h6>商品清單</h6>
            <ul>
              <li v-for="(prod, key) in selectedOrder.products" :key="key">
                商品ID: {{ prod.product.title }} | 數量: {{ prod.qty }}
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">關閉</button>
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
