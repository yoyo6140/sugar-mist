<template>
  <my-navbar></my-navbar>

  <section class="login-page theme-wrap">
    <div class="login-col">
      <p class="kicker">Espace Admin</p>
      <h2 class="login-title">管理者登入</h2>

      <form class="login-form" @submit.prevent="signIn">
        <div class="login-field">
          <label for="username">帳號</label>
          <input
            type="text"
            id="username"
            v-model="user.username"
            class="login-input"
            required
          >
        </div>

        <div class="login-field">
          <label for="password">密碼</label>
          <div class="login-password">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="user.password"
              class="login-input"
              autocomplete="current-password"
              required
            >
            <button
              type="button"
              class="login-eye-btn"
              :aria-label="showPassword ? '隱藏密碼' : '顯示密碼'"
              :title="showPassword ? '隱藏密碼' : '顯示密碼'"
              @click="showPassword = !showPassword"
            >
              <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <button type="submit" class="theme-btn solid login-submit">登入</button>

        <p v-if="errorMessage" class="login-error">{{ errorMessage }}</p>
      </form>

      <div class="login-demo">
        <p class="login-demo-label">測試用帳號（點一下自動填入）</p>
        <button type="button" class="login-demo-btn" @click="fillDemoAccount">
          <span>
            <span class="muted">帳號</span>
            <span class="mono">{{ demoEmail }}</span>
            <span class="muted">密碼</span>
            <span class="mono">{{ demoPassword }}</span>
          </span>
          <i class="bi bi-box-arrow-in-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MyNavbar from "@/components/MyNavbar.vue"
import Cookies from 'js-cookie'
import { API } from '@/constants/api'
import { notify } from '@/components/MessageToast.vue'

const router = useRouter()

const showPassword = ref(false)
const demoEmail = "abc1425367989@gmail.com"
const demoPassword = "test1234"
const user = ref({
  username: "",
  password: "",
})
const errorMessage = ref("")

function fillDemoAccount() {
  user.value.username = demoEmail
  user.value.password = demoPassword
}

async function signIn() {
  try {
    const httpRes = await fetch(API.adminSignIn(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user.value),
    })
    const res = await httpRes.json()

    if (res.success) {
      const { token, expired } = res
      Cookies.set('token', token, { expires: new Date(expired) })
      router.push("/admin/products")
      notify.success('登入成功')
    } else {
      notify.error(res.message || '登入失敗')
    }
  } catch (err) {
    notify.error('網路錯誤')
  }
}
</script>

<style scoped>
.login-page {
  padding: var(--s5) 0 var(--s6);
}
.login-col {
  max-width: 400px;
  margin: 0 auto;
}
.login-title {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 28px;
  letter-spacing: .08em;
  margin: var(--s1) 0 var(--s4);
}

.login-form {
  margin-bottom: var(--s4);
}
.login-field {
  margin-bottom: var(--s3);
}
.login-field label {
  display: block;
  text-align: left;
  margin-bottom: var(--s1);
  font-size: 13px;
  letter-spacing: .1em;
  color: var(--muted);
}
.login-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--hairline);
  background: var(--paper);
  color: var(--espresso);
  font-family: var(--sans);
  font-size: 15px;
}
.login-input:focus {
  outline: none;
  border-color: var(--gold);
}

.login-password {
  position: relative;
  display: flex;
}
.login-password .login-input {
  padding-right: 48px;
}
.login-eye-btn {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 44px;
  border: none;
  background: none;
  color: var(--muted);
  cursor: pointer;
}
.login-eye-btn:hover {
  color: var(--espresso);
}

.login-submit {
  width: 100%;
  justify-content: center;
  margin-top: var(--s2);
}

.login-error {
  margin-top: var(--s3);
  font-size: 14px;
  color: var(--rose);
}

.login-demo {
  padding-top: var(--s3);
  border-top: 1px solid var(--hairline);
}
.login-demo-label {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: var(--s2);
}
.login-demo-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s2);
  padding: 10px 14px;
  border: 1px solid var(--hairline);
  background: var(--paper);
  color: var(--espresso);
  font-size: 13px;
  cursor: pointer;
  transition: border-color .2s ease;
}
.login-demo-btn:hover {
  border-color: var(--gold);
}
.login-demo-btn .muted {
  color: var(--muted);
  margin-right: 6px;
}
.login-demo-btn .mono {
  font-family: var(--latin);
  margin-right: var(--s3);
}
</style>
