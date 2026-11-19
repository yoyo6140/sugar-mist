<template>
  <loading-spinner v-if="isLoading"></loading-spinner>

  <div v-else>
    <my-navbar></my-navbar>

    <section class="goods-page theme-wrap">
      <div class="theme-head">
        <div>
          <p class="kicker">La Carte</p>
          <h2>全部商品<span class="fr">All products</span></h2>
        </div>
      </div>

      <div class="goods-grid">
        <div class="goods-card" v-for="item in pagedProducts" :key="item.id">
          <router-link :to="{ name: 'UserProduct', params: { id: item.id } }">
            <img class="goods-photo" :src="item.imageUrl" :alt="item.title" loading="lazy">
          </router-link>
          <div class="goods-body">
            <p class="goods-cat">{{ item.category }}</p>
            <router-link class="goods-title-link" :to="{ name: 'UserProduct', params: { id: item.id } }">
              <h3>{{ item.title }}</h3>
            </router-link>
            <p class="goods-desc">{{ item.description }}</p>
            <div class="goods-footer">
              <span class="theme-price">NT$ {{ item.price }}</span>
              <div class="theme-qty">
                <button type="button" @click="adjustCartQty(item.id, -1)" aria-label="減少數量">−</button>
                <span>{{ cartQty(item.id) }}</span>
                <button type="button" @click="adjustCartQty(item.id, 1)" aria-label="增加數量">+</button>
              </div>
            </div>
            <div class="goods-actions">
              <router-link class="theme-btn goods-detail" :to="{ name: 'UserProduct', params: { id: item.id } }">詳情</router-link>
              <button type="button" class="theme-btn solid goods-add" @click="addCart(item.id)">加入購物車</button>
            </div>
          </div>
        </div>
        <p v-if="!products.length" class="text-muted">尚無商品</p>
      </div>

      <my-pagination :pages="pagination" @emit-pages="goToPage"></my-pagination>
    </section>

    <my-footer></my-footer>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { API } from '@/constants/api'
import MyNavbar from '@/components/MyNavbar.vue'
import MyFooter from '@/components/MyFooter.vue'
import MyPagination from '@/components/MyPagination.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { notify } from '@/components/MessageToast.vue'
import emitter from '@/methods/emitter'

const products = ref([])
const isLoading = ref(true)
const cartQtyById = ref({})
const cartQtyMin = 1
const cartQtyMax = 999

const pageSize = 6
const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(products.value.length / pageSize)))
const pagination = computed(() => ({
  current_page: currentPage.value,
  total_pages: totalPages.value,
}))
const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return products.value.slice(start, start + pageSize)
})

function goToPage(page) {
  currentPage.value = Math.min(Math.max(1, page), totalPages.value)
}

function cartQty(id) {
  const raw = cartQtyById.value[id]
  const n =
    typeof raw === 'number' && !Number.isNaN(raw) ? raw : cartQtyMin
  return Math.min(cartQtyMax, Math.max(cartQtyMin, n))
}

function adjustCartQty(id, delta) {
  const next = cartQty(id) + delta
  const clamped = Math.min(
    cartQtyMax,
    Math.max(cartQtyMin, next)
  )
  cartQtyById.value = { ...cartQtyById.value, [id]: clamped }
}

async function getProducts() {
  try {
    const httpRes = await fetch(API.productsAll())
    const res = await httpRes.json()
    products.value = res.products || []
  } catch (err) {
    notify.error('取得商品失敗')
  } finally {
    isLoading.value = false
  }
}

async function addCart(id) {
  const qty = cartQty(id)
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
    cartQtyById.value = { ...cartQtyById.value, [id]: cartQtyMin }
    emitter.emit('cart-updated')
  } catch (err) {
    notify.error('加入購物車失敗')
  }
}

getProducts()
</script>

<style scoped>
.goods-page {
  padding: var(--s4) 0 var(--s6);
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--s4);
  margin-bottom: var(--s5);
}

@media (max-width: 960px) {
  .goods-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .goods-grid {
    grid-template-columns: 1fr;
  }
}

.goods-card {
  background: var(--paper);
  border: 1px solid var(--hairline);
  display: flex;
  flex-direction: column;
}

.goods-photo {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}

.goods-body {
  padding: var(--s3);
  display: flex;
  flex-direction: column;
  flex: 1;
}

.goods-cat {
  font-family: var(--latin);
  font-size: 12px;
  letter-spacing: .2em;
  color: var(--gold);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.goods-title-link {
  text-decoration: none;
  color: inherit;
}
.goods-title-link h3 {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 19px;
  letter-spacing: .06em;
  margin: 0 0 var(--s1);
}

.goods-desc {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
  flex: 1;
}

.goods-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--s2);
  padding-top: var(--s2);
  border-top: 1px solid var(--hairline);
}

.goods-actions {
  display: flex;
  gap: var(--s2);
  margin-top: var(--s3);
}
.goods-detail,
.goods-add {
  flex: 1;
  justify-content: center;
}
</style>
