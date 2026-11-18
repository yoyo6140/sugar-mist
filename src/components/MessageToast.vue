<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 11000">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="toast align-items-center border-0 mb-2"
      :class="`text-bg-${t.type}`"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      :ref="(el) => setToastEl(t.id, el)"
    >
      <div class="d-flex">
        <div class="toast-body">
          <div v-if="t.title" class="fw-bold mb-1">{{ t.title }}</div>
          <div>{{ t.message }}</div>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close" @click="hide(t.id)"></button>
      </div>
    </div>
  </div>
</template>

<script>
// 讓各檔案自行 import 使用（不走 globalProperties）；
// 跟下面 <script setup> 共用同一個模組作用域，不用再 import 一次
const listeners = new Set()

export function notify(payload) {
  for (const fn of listeners) fn(payload)
}

notify.success = (message, options = {}) =>
  notify({ type: 'success', title: options.title ?? '成功', message, ...options })

notify.error = (message, options = {}) =>
  notify({ type: 'danger', title: options.title ?? '錯誤', message, ...options })

notify.warn = (message, options = {}) =>
  notify({ type: 'warning', title: options.title ?? '提醒', message, ...options })
</script>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { Toast } from 'bootstrap'

const toasts = ref([])
const toastEls = new Map()
const toastInstances = new Map()

function setToastEl(id, el) {
  if (el) toastEls.set(id, el)
}

function pushToast(payload) {
  const p = payload || {}
  const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`
  const toast = {
    id,
    type: p.type || 'secondary', // success | danger | warning | info | primary | secondary
    title: p.title ?? '',
    message: p.message ?? '',
    delay: Number.isFinite(p.delay) ? p.delay : 2500,
    autohide: p.autohide !== false,
  }

  toasts.value.push(toast)

  nextTick(() => {
    const el = toastEls.get(id)
    if (!el) return

    const instance = Toast.getOrCreateInstance(el, {
      delay: toast.delay,
      autohide: toast.autohide,
    })
    toastInstances.set(id, instance)

    el.addEventListener(
      'hidden.bs.toast',
      () => {
        toastInstances.delete(id)
        toastEls.delete(id)
        toasts.value = toasts.value.filter((x) => x.id !== id)
      },
      { once: true }
    )

    instance.show()
  })
}

function hide(id) {
  const inst = toastInstances.get(id)
  if (inst) inst.hide()
}

let off = null
onMounted(() => {
  const handler = (payload) => pushToast(payload)
  listeners.add(handler)
  off = () => listeners.delete(handler)
})

onUnmounted(() => {
  if (off) off()
})
</script>

