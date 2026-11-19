<template>
  <my-navbar></my-navbar>

  <section class="lookup-page theme-wrap">
    <p class="kicker">Suivi de Commande</p>
    <h2 class="lookup-title">查詢訂單<span class="fr">Order lookup</span></h2>
    <p class="lookup-lead">輸入結帳完成後取得的訂單單號，查詢訂單狀態與明細。</p>

    <form class="lookup-form" @submit.prevent="lookupOrder">
      <input
        type="text"
        class="lookup-input"
        v-model.trim="orderIdInput"
        placeholder="請輸入訂單單號"
      >
      <button type="submit" class="theme-btn solid" :disabled="isSearching">查詢</button>
    </form>

    <div v-if="result" class="lookup-result">
      <div class="lookup-result-head">
        <span>訂單單號：<b>{{ result.id }}</b></span>
        <span class="lookup-status" :class="{ paid: result.is_paid }">
          {{ result.is_paid ? '付款完成' : '尚未付款' }}
        </span>
      </div>

      <table class="lookup-table">
        <thead>
          <tr>
            <th>商品</th>
            <th>單價</th>
            <th>數量</th>
            <th>小計</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, key) in result.products || {}" :key="key">
            <td>{{ item.product?.title }}</td>
            <td>{{ item.product?.price || item.product?.origin_price }}</td>
            <td>{{ item.qty }}</td>
            <td>{{ item.final_total || (item.product?.price * item.qty) }}</td>
          </tr>
        </tbody>
      </table>
      <p class="lookup-total">總計 <span class="theme-price">NT$ {{ result.total || 0 }}</span></p>

      <table class="lookup-table lookup-info-table">
        <tbody>
          <tr>
            <th width="120">收件人</th>
            <td>{{ result.user?.name }}</td>
          </tr>
          <tr>
            <th>電話</th>
            <td>{{ result.user?.tel }}</td>
          </tr>
          <tr>
            <th>地址</th>
            <td>{{ result.user?.address }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 聯絡資訊 -->
    <div class="lookup-contact">
      <p class="kicker">Nous Contacter</p>
      <h3 class="lookup-subtitle">聯絡資訊</h3>
      <p>如果你有任何問題或建議，歡迎透過以下電子郵件與我們聯絡：</p>
      <p><a href="mailto:xxxxoooo@gmail.com">xxxxoooo@gmail.com</a></p>
      <p class="lookup-note">本作品使用圖案來自 https://zh.lovepik.com/graphics/png/</p>
      <p class="lookup-note">本網站僅為作品，無任何營利用途，如擅自盜用，後果自負。</p>
    </div>
  </section>

  <my-footer></my-footer>
</template>

<script setup>
import { ref } from 'vue'
import MyNavbar from '@/components/MyNavbar.vue'
import MyFooter from '@/components/MyFooter.vue'
import { API } from '@/constants/api'
import { notify } from '@/components/MessageToast.vue'

const orderIdInput = ref('')
const result = ref(null)
const isSearching = ref(false)

async function lookupOrder() {
  if (!orderIdInput.value) {
    notify.warn('請輸入訂單單號')
    return
  }
  isSearching.value = true
  result.value = null
  try {
    const httpRes = await fetch(API.orderById(orderIdInput.value))
    const res = await httpRes.json()
    if (res?.success === false || !res?.order) {
      notify.error('查無此訂單，請確認單號是否正確')
      return
    }
    result.value = res.order
  } catch (err) {
    notify.error('查詢訂單失敗')
  } finally {
    isSearching.value = false
  }
}
</script>

<style scoped>
.lookup-page {
  padding: var(--s4) 0 var(--s6);
  max-width: 760px;
  margin: 0 auto;
}
.lookup-title {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 32px;
  letter-spacing: .08em;
  margin: var(--s1) 0 var(--s2);
}
.lookup-title .fr {
  display: block;
  font-size: 18px;
  color: var(--muted);
  letter-spacing: .01em;
  margin-top: 4px;
}
.lookup-lead {
  color: var(--muted);
  margin-bottom: var(--s4);
}

.lookup-form {
  display: flex;
  gap: var(--s2);
  margin-bottom: var(--s5);
}
.lookup-input {
  flex: 1;
  padding: 12px 14px;
  border: 1px solid var(--hairline);
  background: var(--paper);
  color: var(--espresso);
  font-family: var(--sans);
  font-size: 16px;
}
.lookup-input:focus {
  outline: none;
  border-color: var(--gold);
}

.lookup-result {
  border: 1px solid var(--hairline);
  background: var(--paper);
  padding: var(--s3);
  margin-bottom: var(--s6);
}
.lookup-result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--s2);
  margin-bottom: var(--s3);
  padding-bottom: var(--s2);
  border-bottom: 1px solid var(--hairline);
  font-size: 15px;
}
.lookup-status {
  font-size: 13px;
  letter-spacing: .08em;
  color: var(--muted);
  padding: 4px 10px;
  border: 1px solid var(--hairline);
}
.lookup-status.paid {
  color: var(--gold);
  border-color: var(--gold);
}

.lookup-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
  margin-bottom: var(--s3);
}
.lookup-table th,
.lookup-table td {
  padding: var(--s2) var(--s1);
  border-bottom: 1px solid var(--hairline);
  text-align: left;
}
.lookup-table thead th {
  color: var(--muted);
  font-weight: 400;
  letter-spacing: .08em;
  font-size: 13px;
}
.lookup-info-table th {
  color: var(--muted);
  font-weight: 400;
}
.lookup-total {
  text-align: right;
  margin-bottom: var(--s3);
}
.lookup-total .theme-price {
  font-size: 20px;
  margin-left: var(--s1);
}

.lookup-contact {
  padding-top: var(--s5);
  border-top: 1px solid var(--hairline);
}
.lookup-subtitle {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 22px;
  letter-spacing: .06em;
  margin: var(--s1) 0 var(--s3);
}
.lookup-contact p {
  color: var(--muted);
  margin-bottom: var(--s1);
}
.lookup-contact a {
  color: var(--espresso);
}
.lookup-note {
  font-size: 12px;
}

@media (max-width: 600px) {
  .lookup-form {
    flex-direction: column;
  }
}
</style>
