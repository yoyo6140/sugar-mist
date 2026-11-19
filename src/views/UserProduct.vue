<template>
  <loading-spinner v-if="isLoading"></loading-spinner>

  <div v-else>
    <my-navbar></my-navbar>

    <section class="pd-page theme-wrap">
      <!-- 麵包屑 -->
      <nav aria-label="breadcrumb" class="pd-crumbs">
        <router-link :to="{ name: 'MyHome' }">首頁</router-link>
        <span>/</span>
        <router-link :to="{ name: 'UserGoods' }">商品</router-link>
        <template v-if="product.category">
          <span>/</span>
          <span>{{ product.category }}</span>
        </template>
        <span>/</span>
        <span class="current">{{ product.title }}</span>
      </nav>

      <div class="pd-grid">
        <img class="pd-photo" :src="product.imageUrl" :alt="product.title">

        <div class="pd-info">
          <p class="kicker">{{ product.category }}</p>
          <h1 class="pd-title">{{ product.title }}</h1>
          <p class="pd-desc">{{ product.description }}</p>
          <p class="pd-content">{{ product.content }}</p>
          <span class="theme-price pd-price">NT$ {{ product.price }}</span>

          <div class="pd-qty-row">
            <span class="pd-qty-label">數量</span>
            <div class="theme-qty">
              <button type="button" @click="adjustQty(-1)" aria-label="減少數量">−</button>
              <span>{{ productQty }}</span>
              <button type="button" @click="adjustQty(1)" aria-label="增加數量">+</button>
            </div>
          </div>

          <button type="button" class="theme-btn solid pd-add" @click="addCart(product.id)">加入購物車</button>
        </div>
      </div>
    </section>

    <my-footer></my-footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import MyNavbar from '@/components/MyNavbar.vue'
import MyFooter from '@/components/MyFooter.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { API } from '@/constants/api'
import { notify } from '@/components/MessageToast.vue'
import emitter from '@/methods/emitter'

const route = useRoute()

const product = ref({
  imagesUrl: []
})
const isLoading = ref(true)
const productQty = ref(1)
const qtyMin = 1
const qtyMax = 999

function adjustQty(delta) {
  const next = productQty.value + delta
  productQty.value = Math.min(qtyMax, Math.max(qtyMin, next))
}

async function getProduct() {
  const id = route.params.id
  try {
    const httpRes = await fetch(API.product(id))
    const res = await httpRes.json()
    product.value = res.product || {}
    if (!product.value.imagesUrl) product.value.imagesUrl = []
  } catch (err) {
    notify.error('取得商品資料失敗')
  } finally {
    isLoading.value = false
  }
}

async function addCart(id) {
  const qty = Math.min(qtyMax, Math.max(qtyMin, productQty.value))
  try {
    const httpRes = await fetch(API.cart(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { product_id: id, qty } }),
    })
    const res = await httpRes.json()
    if (res?.success === false) {
      notify.error(res.message || '加入購物車失敗')
      return
    }
    notify.success(qty > 1 ? `已加入購物車（${qty} 件）` : '已加入購物車')
    productQty.value = 1
    emitter.emit('cart-updated')
  } catch (err) {
    notify.error('加入購物車失敗')
  }
}

getProduct()
</script>

<style scoped>
.pd-page {
  padding: var(--s4) 0 var(--s6);
}

.pd-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: var(--s4);
  font-size: 13px;
  letter-spacing: .08em;
  color: var(--muted);
}
.pd-crumbs a {
  color: var(--muted);
  text-decoration: none;
}
.pd-crumbs a:hover {
  color: var(--espresso);
}
.pd-crumbs .current {
  color: var(--espresso);
}

.pd-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s6);
  align-items: start;
}

.pd-photo {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  display: block;
}

.pd-info {
  padding-top: var(--s1);
}

.pd-info .kicker {
  display: block;
  margin-bottom: var(--s2);
}

.pd-title {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 32px;
  letter-spacing: .08em;
  line-height: 1.4;
  margin: 0 0 var(--s3);
}

.pd-desc {
  color: var(--espresso);
  margin-bottom: var(--s2);
}

.pd-content {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.9;
  margin-bottom: var(--s4);
}

.pd-price {
  display: block;
  font-size: 28px;
  margin-bottom: var(--s4);
}

.pd-qty-row {
  display: flex;
  align-items: center;
  gap: var(--s2);
  margin-bottom: var(--s3);
}
.pd-qty-label {
  font-size: 13px;
  letter-spacing: .1em;
  color: var(--muted);
}

.pd-add {
  width: 100%;
  justify-content: center;
}

@media (max-width: 960px) {
  .pd-grid {
    grid-template-columns: 1fr;
  }
}
</style>
