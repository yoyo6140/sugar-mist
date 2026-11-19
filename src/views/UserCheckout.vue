<template>
  <my-navbar></my-navbar>

  <section class="checkout-page theme-wrap">
    <div class="co-col">
      <!-- 三步驟 -->
      <div class="stepper-row" v-if="step < 4">
        <button
          type="button"
          class="co-nav-arrow"
          :disabled="step <= 2"
          @click="goPrev"
          aria-label="上一步"
        >
          <i class="bi bi-chevron-left"></i>
        </button>

        <checkout-stepper :current="step"></checkout-stepper>

        <button
          type="button"
          class="co-nav-arrow"
          :disabled="!canGoNext"
          @click="goNext"
          aria-label="下一步"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>

      <!-- Step 2：填寫資料 -->
      <div v-if="step === 2">
        <p class="kicker">Étape 2</p>
        <h3 class="co-title">填寫資料</h3>

        <!-- 結帳表單 -->
        <Form class="co-form" @submit="createOrder" v-slot="{ errors }">
          <div class="co-field">
            <label for="email">Email<span class="required">*</span></label>
            <Field id="email" name="email" type="email" class="co-input"
                   :class="{ 'is-invalid': errors['email'] }"
                   placeholder="請輸入 Email" rules="email|required"
                   v-model="form.user.email"></Field>
            <ErrorMessage name="email" class="co-error"></ErrorMessage>
          </div>

          <div class="co-field">
            <label for="name">收件人姓名<span class="required">*</span></label>
            <Field id="name" name="name" type="text" class="co-input"
                   :class="{ 'is-invalid': errors['name'] }"
                   placeholder="請輸入姓名" rules="required"
                   v-model="form.user.name"></Field>
            <ErrorMessage name="name" class="co-error"></ErrorMessage>
          </div>

          <div class="co-field">
            <label for="tel">收件人電話<span class="required">*</span></label>
            <Field id="tel" name="tel" type="tel" class="co-input"
                   :class="{ 'is-invalid': errors['tel'] }"
                   placeholder="請輸入電話" rules="required"
                   v-model="form.user.tel"></Field>
            <ErrorMessage name="tel" class="co-error"></ErrorMessage>
          </div>

          <div class="co-field">
            <label for="address">收件人地址<span class="required">*</span></label>
            <Field id="address" name="address" type="text" class="co-input"
                   :class="{ 'is-invalid': errors['address'] }"
                   placeholder="請輸入地址" rules="required"
                   v-model="form.user.address"></Field>
            <ErrorMessage name="address" class="co-error"></ErrorMessage>
          </div>

          <div class="co-field">
            <label for="message">留言</label>
            <textarea id="message" class="co-input" cols="30" rows="5"
                      v-model="form.message"></textarea>
          </div>

          <div class="co-actions">
            <button type="submit" class="theme-btn solid">前往付款</button>
          </div>
        </Form>
      </div>

      <!-- Step 3：確認付款 -->
      <div v-if="step === 3">
        <p class="kicker">Étape 3</p>
        <h3 class="co-title">確認付款</h3>
        <form @submit.prevent="payOrder">
          <table class="co-table">
            <thead>
              <tr>
                <th>品名</th>
                <th>數量</th>
                <th>單價</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, key) in order.products || {}" :key="key">
                <td>{{ item.product?.title }}</td>
                <td>{{ item.qty }}</td>
                <td class="text-end">{{ item.final_total || (item.product?.price * item.qty) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" class="text-end">總計</td>
                <td class="text-end">{{ order?.total || 0 }}</td>
              </tr>
            </tfoot>
          </table>

          <table class="co-table co-info-table">
            <tbody>
              <tr>
                <th width="100">Email</th>
                <td>{{ order.user?.email }}</td>
              </tr>
              <tr>
                <th>姓名</th>
                <td>{{ order.user?.name }}</td>
              </tr>
              <tr>
                <th>收件人電話</th>
                <td>{{ order.user?.tel }}</td>
              </tr>
              <tr>
                <th>收件人地址</th>
                <td>{{ order.user?.address }}</td>
              </tr>
              <tr>
                <th>付款狀態</th>
                <td>
                  <span v-if="!order.is_paid">尚未付款</span>
                  <span v-else class="co-paid">付款完成</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="co-actions" v-if="order.is_paid === false">
            <button class="theme-btn solid">確認付款去</button>
          </div>
        </form>
      </div>

      <!-- 結帳完成 -->
      <div v-if="step === 4" class="co-success">
        <p class="kicker">Merci</p>
        <h2 class="co-title">付款成功</h2>
        <p class="co-success-lead">感謝您的購買，訂單已成立。</p>
        <p class="co-order-no">
          訂單單號：<span>{{ order.id }}</span>
          <button type="button" class="co-copy-btn" @click="copyOrderId" aria-label="複製訂單單號">
            <i class="bi bi-clipboard"></i>
          </button>
        </p>

        <!-- 訂單明細 -->
        <div class="co-success-detail">
          <h4 class="co-subtitle">訂單明細</h4>
          <table class="co-table">
            <thead>
              <tr>
                <th>商品</th>
                <th>單價</th>
                <th>數量</th>
                <th>小計</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, key) in order.products || {}" :key="key">
                <td>{{ item.product?.title }}</td>
                <td>{{ item.product?.price || item.product?.origin_price }}</td>
                <td>{{ item.qty }}</td>
                <td>{{ item.final_total || (item.product?.price * item.qty) }}</td>
              </tr>
            </tbody>
          </table>
          <p class="co-total">總計 <span class="theme-price">NT$ {{ order?.total || 0 }}</span></p>

          <!-- 收件人資訊 -->
          <div class="co-success-user">
            <h5 class="co-subtitle">收件人資訊</h5>
            <table class="co-table co-info-table">
              <tbody>
                <tr>
                  <th width="120">Email</th>
                  <td>{{ order.user?.email }}</td>
                </tr>
                <tr>
                  <th>姓名</th>
                  <td>{{ order.user?.name }}</td>
                </tr>
                <tr>
                  <th>電話</th>
                  <td>{{ order.user?.tel }}</td>
                </tr>
                <tr>
                  <th>地址</th>
                  <td>{{ order.user?.address }}</td>
                </tr>
                <tr v-if="order.message">
                  <th>留言</th>
                  <td>{{ order.message }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="co-actions center">
            <router-link to="/goods" class="theme-btn">回到商店</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>

  <my-footer></my-footer>
</template>


<script setup>
import { computed, ref } from 'vue'
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import * as AllRules from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'
import MyNavbar from '@/components/MyNavbar.vue'
import MyFooter from '@/components/MyFooter.vue'
import CheckoutStepper from '@/components/CheckoutStepper.vue'
import { API } from '@/constants/api'
import { notify } from '@/components/MessageToast.vue'

const order = ref({})
const step = ref(2)
const form = ref({
  user: {},
  message: ''
})

const canGoNext = computed(() => step.value === 2 && !!order.value.id)

function goPrev() {
  if (step.value > 2 && step.value < 4) step.value -= 1
}

function goNext() {
  if (canGoNext.value) step.value += 1
}

function createOrder() {
  order.value.user = { ...form.value.user }
  order.value.message = form.value.message

  // 送出訂單 API
  fetch(API.order(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: order.value }),
  })
    .then((r) => r.json())
    .then((res) => {
      if (res.success) {
        const orderId = res.orderId

        // ✅ 再呼叫一次完整訂單 API
        return fetch(API.orderById(orderId)).then((r) => r.json())
      }
      notify.error('建立訂單失敗，請稍後再試')
      return null
    })
    .then((detailRes) => {
      if (!detailRes) return
      order.value = detailRes.order
      step.value = 3
    })
    .catch(() => {
      notify.error('送出訂單時發生錯誤')
    })
}

function copyOrderId() {
  if (!order.value.id) return
  navigator.clipboard.writeText(order.value.id)
    .then(() => notify.success('已複製訂單單號'))
    .catch(() => notify.error('複製失敗'))
}

function payOrder() {
  fetch(API.pay(order.value.id), { method: 'POST' })
    .then((r) => r.json())
    .then(res => {
      if (res.success) {
        order.value.is_paid = true
        step.value = 4
      } else {
        notify.error(res.message || '付款失敗')
      }
    })
    .catch(() => {
      notify.error('付款失敗')
    })
}

// vee-validate
Object.keys(AllRules)
  .filter(rule => typeof AllRules[rule] === 'function')
  .forEach(rule => defineRule(rule, AllRules[rule]))

configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: true,
})
setLocale('zh_TW')
</script>


<style scoped>
.checkout-page {
  padding: var(--s4) 0 var(--s6);
}
.co-col {
  max-width: 760px;
  margin: 0 auto;
}

/* ── 三步驟 ── */
.stepper-row {
  display: flex;
  align-items: center;
  gap: var(--s2);
  margin-bottom: var(--s5);
}
.co-nav-arrow {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--espresso);
  background: var(--ivory);
  color: var(--espresso);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background .25s ease, color .25s ease, opacity .25s ease;
}
.co-nav-arrow:hover:not(:disabled) {
  background: var(--espresso);
  color: var(--ivory);
}
.co-nav-arrow:disabled {
  opacity: .3;
  cursor: not-allowed;
}
/* ── 標題 ── */
.co-title {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 28px;
  letter-spacing: .08em;
  margin: var(--s1) 0 var(--s4);
}
.co-subtitle {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 18px;
  letter-spacing: .06em;
  margin: 0 0 var(--s2);
}

/* ── 表格 ── */
.co-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
  font-weight: 500;
  color: var(--espresso);
  margin-bottom: var(--s3);
}
.co-table th,
.co-table td {
  padding: var(--s2) var(--s1);
  border-bottom: 1px solid var(--hairline);
  text-align: left;
}
.co-table thead th {
  background: var(--paper);
  color: var(--espresso);
  font-weight: 600;
  letter-spacing: .08em;
  font-size: 14px;
}
.co-table tfoot td {
  border-top: 1px solid var(--espresso);
  border-bottom: none;
  font-weight: 700;
  color: var(--espresso);
}
.co-info-table th {
  color: var(--espresso);
  font-weight: 600;
  width: 120px;
}
.co-paid {
  color: var(--gold);
  font-weight: 700;
}

.co-total {
  text-align: right;
  font-size: 16px;
  font-weight: 600;
  color: var(--espresso);
  margin-bottom: var(--s4);
}
.co-total .theme-price {
  font-size: 24px;
  font-weight: 700;
  margin-left: var(--s1);
}

/* ── 表單 ── */
.co-form {
  margin-top: var(--s4);
}
.co-field {
  margin-bottom: var(--s3);
}
.co-field label {
  display: block;
  text-align: left;
  margin-bottom: var(--s1);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: .1em;
  color: var(--espresso);
}
.co-field label .required {
  color: var(--rose);
  margin-left: 4px;
}
.co-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--hairline);
  background: var(--paper);
  color: var(--espresso);
  font-family: var(--sans);
  font-weight: 500;
  font-size: 16px;
}
.co-input:focus {
  outline: none;
  border-color: var(--gold);
}
.co-input.is-invalid {
  border-color: var(--rose);
}
.co-error {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--rose);
}

.co-actions {
  text-align: right;
  margin-top: var(--s2);
}
.co-actions.center {
  text-align: center;
  margin-top: var(--s4);
}

/* ── 付款成功 ── */
.co-success {
  text-align: center;
}
.co-success .co-title {
  margin-top: var(--s2);
}
.co-success-lead {
  font-size: 16px;
  font-weight: 600;
  color: var(--espresso);
  margin-bottom: var(--s2);
}
.co-order-no {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: .06em;
  color: var(--espresso);
  margin-bottom: var(--s5);
}
.co-order-no span {
  font-family: var(--latin);
  color: var(--espresso);
  font-weight: 700;
  font-size: 20px;
}
.co-copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  color: var(--muted);
  font-size: 15px;
  cursor: pointer;
  transition: color .2s ease;
}
.co-copy-btn:hover {
  color: var(--gold);
}
.co-success-detail {
  text-align: left;
}
.co-success-user {
  margin-top: var(--s4);
}
</style>
