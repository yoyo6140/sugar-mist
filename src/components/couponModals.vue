<template>
  <div class="modal fade" id="couponModal" tabindex="-1" ref="modalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">優惠券</h5>
          <button type="button" class="btn-close" @click="hideModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label>標題</label>
            <input type="text" class="form-control" v-model="tempCoupon.title">
          </div>
          <div class="mb-3">
            <label>優惠碼</label>
            <input type="text" class="form-control" v-model="tempCoupon.code">
          </div>
          <div class="mb-3">
            <label>到期日</label>
            <input type="date" class="form-control" v-model="due_date">
          </div>
          <div class="mb-3">
            <label>折扣百分比</label>
            <input type="number" class="form-control" v-model.number="tempCoupon.percent">
          </div>
          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox"
                   :true-value="1" :false-value="0"
                   v-model="tempCoupon.is_enabled">
            <label class="form-check-label">是否啟用</label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="hideModal">關閉</button>
          <button class="btn btn-primary" @click.prevent="$emit('update-coupon', tempCoupon)">更新優惠券</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Modal } from 'bootstrap'

const props = defineProps({ coupon: {} })
defineEmits(['update-coupon'])

const modalRef = ref(null)
let modalInstance = null
const tempCoupon = ref({})
const due_date = ref('')

onMounted(() => {
  modalInstance = new Modal(modalRef.value, { backdrop: 'static' })
})

watch(
  () => props.coupon,
  (newVal) => {
    if (!newVal) return
    tempCoupon.value = { ...newVal }
    if (tempCoupon.value.due_date) {
      due_date.value = new Date(tempCoupon.value.due_date * 1000)
        .toISOString().split('T')[0]
    }
  },
  { immediate: true }
)

watch(due_date, (newVal) => {
  if (newVal) {
    tempCoupon.value.due_date = Math.floor(new Date(newVal) / 1000)
  }
})

function showModal() {
  modalInstance.show()
}

function hideModal() {
  const activeEl = document.activeElement
  if (modalRef.value.contains(activeEl)) activeEl.blur()
  modalInstance.hide()
}

defineExpose({ showModal, hideModal })
</script>
