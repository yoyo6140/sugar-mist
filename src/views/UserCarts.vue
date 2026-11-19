<template>
  <my-navbar></my-navbar>

  <section class="cart-page theme-wrap">
    <checkout-stepper :current="1" class="cart-stepper"></checkout-stepper>

    <p class="kicker">Votre Panier</p>
    <h2 class="cart-title">購物車<span class="fr">Cart</span></h2>

    <!-- 購物車空的情況 -->
    <div v-if="cart.carts.length === 0" class="cart-empty">
      <p>購物車目前沒有商品</p>
      <router-link class="theme-link" :to="{ name: 'UserGoods' }">去看看商品 →</router-link>
    </div>

    <div v-else>
      <!-- 購物車列表 -->
      <table class="cart-table">
        <thead>
          <tr>
            <th>商品</th>
            <th>單價</th>
            <th>數量</th>
            <th>小計</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart.carts" :key="item.id">
            <td class="cart-product">
              <img class="cart-photo" :src="item.product.imageUrl" alt="">
              <span>{{ item.product.title }}</span>
            </td>
            <td>NT$ {{ item.product.price || item.product.origin_price }}</td>
            <td>
              <div class="theme-qty">
                <button type="button" @click="adjustQty(item, -1)" aria-label="減少數量">−</button>
                <span>{{ item.qty }}</span>
                <button type="button" @click="adjustQty(item, 1)" aria-label="增加數量">+</button>
              </div>
            </td>
            <td class="cart-subtotal">NT$ {{ (item.product.price || item.product.origin_price) * item.qty }}</td>
            <td>
              <button type="button" class="cart-remove-btn" @click="removeCart(item.id)" aria-label="刪除">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 總計 -->
      <div class="cart-total">
        <span>總計</span>
        <span class="theme-price">NT$ {{ cart.total }}</span>
      </div>

      <div class="cart-actions">
        <button
          type="button"
          class="theme-btn solid"
          @click="checkout"
          :disabled="cart.carts.length === 0"
        >前往結帳</button>
      </div>
    </div>
  </section>

  <my-footer></my-footer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MyNavbar from '@/components/MyNavbar.vue'
import MyFooter from '@/components/MyFooter.vue'
import CheckoutStepper from '@/components/CheckoutStepper.vue'
import { API } from '@/constants/api'
import { notify } from '@/components/MessageToast.vue'

const router = useRouter()

const cart = ref({
  carts: [],
  total: 0
})
const qtyMin = 1
const qtyMax = 999

async function getCarts() {
  try {
    const httpRes = await fetch(API.cart())
    const res = await httpRes.json()
    cart.value = res.data || { carts: [], total: 0 }
  } catch (err) {
    notify.error('取得購物車失敗')
    cart.value = { carts: [], total: 0 }
  }
}

async function updateCart(item) {
  const payload = { product_id: item.product_id, qty: item.qty }
  try {
    await fetch(API.cartItem(item.id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload }),
    })
    getCarts()
  } catch (err) {
    notify.error('更新購物車失敗')
  }
}

function adjustQty(item, delta) {
  const next = Math.min(qtyMax, Math.max(qtyMin, item.qty + delta))
  if (next === item.qty) return
  item.qty = next
  updateCart(item)
}

async function removeCart(id) {
  try {
    await fetch(API.cartItem(id), { method: 'DELETE' })
    getCarts()
  } catch (err) {
    notify.error('刪除商品失敗')
  }
}

function checkout() {
  if (cart.value.carts.length === 0) {
    notify.warn('購物車沒有商品，無法結帳！')
    return
  }
  router.push({ name: 'UserCheckout' })
}

getCarts()
</script>

<style scoped>
.cart-page {
  padding: var(--s4) 0 var(--s6);
}
.cart-stepper {
  max-width: 480px;
  margin: 0 auto var(--s5);
}
.cart-title {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 32px;
  letter-spacing: .08em;
  margin: var(--s1) 0 var(--s5);
}
.cart-title .fr {
  display: block;
  font-size: 18px;
  color: var(--muted);
  letter-spacing: .01em;
  margin-top: 4px;
}

.cart-empty {
  text-align: center;
  padding: var(--s6) 0;
  color: var(--muted);
}
.cart-empty p {
  margin-bottom: var(--s3);
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--s4);
}
.cart-table th,
.cart-table td {
  padding: var(--s2) var(--s1);
  border-bottom: 1px solid var(--hairline);
  text-align: left;
  vertical-align: middle;
}
.cart-table thead th {
  color: var(--muted);
  font-weight: 400;
  letter-spacing: .08em;
  font-size: 13px;
}

.cart-product {
  display: flex;
  align-items: center;
  gap: var(--s2);
}
.cart-photo {
  width: 64px;
  height: 64px;
  object-fit: cover;
  flex-shrink: 0;
}
.cart-product span {
  font-family: var(--serif);
  letter-spacing: .04em;
}

.cart-remove-btn {
  border: none;
  background: none;
  padding: 4px 8px;
  font-size: 1.1rem;
  color: var(--muted);
  cursor: pointer;
  transition: color .2s ease;
}
.cart-remove-btn:hover {
  color: var(--rose);
}

.cart-subtotal {
  font-family: var(--latin);
  color: var(--rose);
  font-weight: 500;
}

.cart-total {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: var(--s2);
  padding-top: var(--s3);
  border-top: 1px solid var(--hairline);
  font-size: 15px;
  letter-spacing: .08em;
  color: var(--muted);
  margin-bottom: var(--s4);
}
.cart-total .theme-price {
  font-size: 24px;
}

.cart-actions {
  text-align: right;
}
.cart-actions .theme-btn:disabled {
  opacity: .4;
  cursor: not-allowed;
}
.cart-actions .theme-btn:disabled:hover {
  background: var(--espresso);
  color: var(--ivory);
}

@media (max-width: 760px) {
  .cart-table thead {
    display: none;
  }
  .cart-table tr {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--s1) var(--s2);
    padding: var(--s2) 0;
  }
  .cart-product {
    grid-column: 1 / -1;
  }
}
</style>
