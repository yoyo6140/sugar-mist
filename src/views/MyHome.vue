<template>
  <loading-spinner v-if="isLoad"></loading-spinner>

  <div v-else class="container">
    <my-navbar></my-navbar>
    <hero-carousel></hero-carousel>
    <omamori-intro></omamori-intro>
    <router-view></router-view>
    <my-footer></my-footer>
    <router-link :to="{ name: 'UserGoods' }" class="cart-btn" title="前往購物">
      <div>
        <img :src="buyIcon" alt="產品" class="cart-icon" />
        <span class="carts bg-warning">{{ cartCount }}</span>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import MyNavbar from "@/components/MyNavbar.vue";
import HeroCarousel from "@/components/HeroCarousel.vue";
import OmamoriIntro from "@/components/OmamoriIntro.vue";
import MyFooter from "@/components/MyFooter.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { API } from "@/constants/api";
import buyIcon from "@/assets/buy.png";

const route = useRoute();

const isLoad = ref(true); // 初始為 true，表示頁面正在載入
const cartCount = ref(0);

async function updateCartCount() {
  try {
    const httpRes = await fetch(API.cart());
    const res = await httpRes.json();
    const carts = res?.data?.carts || [];
    cartCount.value = carts.reduce(
      (total, item) => total + (item.qty || 0),
      0
    );
  } catch {
    cartCount.value = 0;
  }
}

// 每次路由變化都重置 isLoad
watch(route, () => {
  isLoad.value = true;
  setTimeout(() => {
    isLoad.value = false;
  }, 500); // 你的特效持續時間
  updateCartCount();
});

onMounted(() => {
  // 模擬頁面載入完成，2秒後關閉 spinner
  setTimeout(() => {
    isLoad.value = false;
  }, 2000);
  updateCartCount();
});
</script>

<style scoped>
.cart-btn {
  position: fixed;

  bottom: 60px;
  right: 30px;
  width: 100px;
  height: 100px;
  background-color: bisque;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-decoration: none;
}

.cart-icon {
  width: 70%;
  height: 70%;
  object-fit: contain;
}

.cart-btn div {
  position: relative;
}

.carts {
  position: absolute;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  right: -9px;
  top: -8px;
  font-size: 0.75rem;
}
</style>
