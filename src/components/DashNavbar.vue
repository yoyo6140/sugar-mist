<template>
  <header class="theme-header">
    <div class="theme-wrap theme-nav">
      <div class="nav-left"></div>
      <router-link class="theme-brand" :to="{ name: 'MyHome' }" aria-label="糖霧 Sugar Mist">
        <span class="en">SUGAR MIST</span>
        <span class="zh">管理後台</span>
      </router-link>
      <div class="nav-right">
        <ul>
          <li><router-link :to="{ name: 'AdminProducts' }">產品</router-link></li>
          <li><router-link :to="{ name: 'AdminOrders' }">訂單</router-link></li>
          <li><a href="#" @click.prevent="logout">登出</a></li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  Cookies.remove('token')
  router.push('/login')
}
</script>
