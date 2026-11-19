<template>
  <div class="theme-topbar">週二至週日 11:00 – 20:00　·　整模蛋糕請於三日前預訂</div>
  <header class="theme-header">
    <div class="theme-wrap theme-nav">
      <div class="nav-left"></div>
      <router-link class="theme-brand" :to="{ name: 'MyHome' }" aria-label="糖霧 Sugar Mist 首頁">
        <span class="en">SUGAR MIST</span>
        <span class="zh">糖霧・甜點與茶</span>
      </router-link>
      <div class="nav-right">
        <ul>
          <li><router-link :to="{ name: 'UserGoods' }">商品</router-link></li>
          <li><router-link :to="{ name: 'UserOrderLookup' }">查詢訂單</router-link></li>
        </ul>
      </div>
    </div>
  </header>

  <router-link class="theme-cart-float" :to="{ name: 'UserCarts' }" aria-label="前往購物車">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">
      <path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
    <span class="theme-cart-count" :class="{ zero: cartCount === 0 }">{{ cartCount }}</span>
  </router-link>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { API } from '@/constants/api'
import emitter from '@/methods/emitter'

const cartCount = ref(0)

async function updateCartCount() {
  try {
    const httpRes = await fetch(API.cart())
    const res = await httpRes.json()
    const carts = res?.data?.carts || []
    cartCount.value = carts.reduce((total, item) => total + (item.qty || 0), 0)
  } catch (err) {
    cartCount.value = 0
  }
}

onMounted(() => {
  updateCartCount()
  emitter.on('cart-updated', updateCartCount)
})

onUnmounted(() => {
  emitter.off('cart-updated', updateCartCount)
})
</script>
