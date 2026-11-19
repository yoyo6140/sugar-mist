<template>
  <loading-spinner v-if="isLoad"></loading-spinner>

  <div v-else>
    <my-navbar></my-navbar>

    <!-- Hero -->
    <section class="home-hero">
      <div class="theme-wrap hero-grid">
        <div>
          <p class="kicker">Pâtisserie &amp; Salon de Thé</p>
          <h1 class="hero-title">午後三點，<br>留給一塊蛋糕<br>與一杯茶。</h1>
          <span class="fr hero-fr-title">L'heure du goûter</span>
          <p class="hero-lead">每日清晨手作的法式甜點，搭配細心沖泡的茶飲與咖啡。在糖霧，甜，是一件需要慢慢來的事。</p>
          <div class="hero-actions">
            <router-link class="theme-btn solid" :to="{ name: 'UserGoods' }">線上點餐</router-link>
          </div>
        </div>
        <div class="hero-media">
          <img class="main hero-main-img" :src="heroImg" alt="手作甜點與飲品">
          <div class="stamp" aria-hidden="true"><div>Fait<i>main</i>chaque jour</div></div>
        </div>
      </div>
    </section>

    <!-- 品牌理念 -->
    <section class="home-manifesto">
      <div class="theme-wrap" v-reveal>
        <div class="ornament" aria-hidden="true"><span></span></div>
        <p class="manifesto-big">我們只做每天賣得完的份量。<br>奶油選用<em>法國產區</em>，水果跟著季節走，<br>茶葉每一壺都現泡。</p>
        <p class="manifesto-sign fr">— Sugar Mist, depuis 2026</p>
      </div>
    </section>

    <!-- 手工甜點 -->
    <section class="theme-carousel-sec">
      <div class="theme-wrap">
        <div class="theme-head" v-reveal>
          <div>
            <p class="kicker">Les Pâtisseries</p>
            <h2>手工甜點<span class="fr">Cakes &amp; pastries</span></h2>
          </div>
          <router-link class="theme-link" :to="{ name: 'UserGoods' }">查看全部蛋糕 →</router-link>
        </div>
        <div class="theme-c-track-wrap" v-reveal>
          <button class="theme-c-arrow prev" @click="scrollCarousel(dessertTrackRef, -1)" aria-label="上一個">
            <i class="bi bi-chevron-left"></i>
          </button>
          <div class="theme-c-track" ref="dessertTrackRef">
            <router-link
              class="theme-c-card"
              v-for="item in dessertProducts"
              :key="item.id"
              :to="{ name: 'UserProduct', params: { id: item.id } }"
            >
              <img class="theme-c-photo r-45" :src="item.imageUrl" :alt="item.title" loading="lazy">
              <h3>{{ item.title }}</h3>
              <div class="row">
                <small>{{ item.description }}</small>
                <span class="theme-price">NT$ {{ item.price }}</span>
              </div>
            </router-link>
            <p v-if="!dessertProducts.length" class="text-muted">尚無商品</p>
          </div>
          <button class="theme-c-arrow next" @click="scrollCarousel(dessertTrackRef, 1)" aria-label="下一個">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- 精緻飲品 -->
    <section class="theme-carousel-sec alt">
      <div class="theme-wrap">
        <div class="theme-head" v-reveal>
          <div>
            <p class="kicker">Thés &amp; Boissons</p>
            <h2>精緻飲品<span class="fr">Tea, coffee &amp; chocolate</span></h2>
          </div>
          <router-link class="theme-link" :to="{ name: 'UserGoods' }">查看全部飲品 →</router-link>
        </div>
        <div class="theme-c-track-wrap" v-reveal>
          <button class="theme-c-arrow prev" @click="scrollCarousel(drinkTrackRef, -1)" aria-label="上一個">
            <i class="bi bi-chevron-left"></i>
          </button>
          <div class="theme-c-track" ref="drinkTrackRef">
            <router-link
              class="theme-c-card"
              v-for="item in drinkProducts"
              :key="item.id"
              :to="{ name: 'UserProduct', params: { id: item.id } }"
            >
              <img class="theme-c-photo r-45" :src="item.imageUrl" :alt="item.title" loading="lazy">
              <h3>{{ item.title }}</h3>
              <div class="row">
                <small>{{ item.description }}</small>
                <span class="theme-price">NT$ {{ item.price }}</span>
              </div>
            </router-link>
            <p v-if="!drinkProducts.length" class="text-muted">尚無商品</p>
          </div>
          <button class="theme-c-arrow next" @click="scrollCarousel(drinkTrackRef, 1)" aria-label="下一個">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- 品牌故事 -->
    <section class="theme-story" id="story">
      <div class="theme-wrap grid">
        <img class="story-img" :src="storyImg" alt="店內空間／甜點櫃" v-reveal>
        <div class="panel" v-reveal>
          <p class="kicker">Notre Histoire</p>
          <h2>從一間小廚房，<br>到一張安靜的午茶桌。</h2>
          <p>糖霧的甜點師在巴黎學藝，回到台灣後，想做一間不趕時間的店：甜點不追求浮誇，只講究層次與平衡。</p>
          <p>每一款甜點，都會配一杯我們認為最適合它的茶。</p>
          <div class="facts">
            <div><b>06:00</b><span>每日開始烘焙</span></div>
            <div><b>18</b><span>款甜點與茶飲</span></div>
            <div><b>0</b><span>人工香料</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 門市 -->
    <section class="theme-visit" id="visit">
      <div class="theme-wrap">
        <div class="theme-head" v-reveal>
          <div>
            <p class="kicker">Nous Trouver</p>
            <h2>門市資訊<span class="fr">Visit us</span></h2>
          </div>
        </div>
        <div class="grid" v-reveal>
          <div class="theme-info"><span class="kicker">Adresse</span><p>台北市○○區<br>○○路 123 號</p><small>捷運○○站 2 號出口，步行 3 分鐘</small></div>
          <div class="theme-info"><span class="kicker">Horaires</span><p>週二至週日<br>11:00 – 20:00</p><small>每週一公休・最後點餐 19:30</small></div>
          <div class="theme-info"><span class="kicker">Contact</span><p>02-1234-5678<br>LINE @sugarmist</p><small>內用不接受訂位，現場候位</small></div>
          <div class="ph r-169"><div class="ph-label"><b>Map</b><span>Google 地圖嵌入</span></div></div>
        </div>
      </div>
    </section>

    <my-footer></my-footer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import MyNavbar from "@/components/MyNavbar.vue";
import MyFooter from "@/components/MyFooter.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import heroImg from "@/assets/hero-desserts.jpg";
import storyImg from "@/assets/story-interior.jpg";
import { API } from "@/constants/api";
import { notify } from "@/components/MessageToast.vue";

const route = useRoute();

const products = ref([]);
const dessertProducts = computed(() => products.value.filter(p => p.category === "手工甜點"));
const drinkProducts = computed(() => products.value.filter(p => p.category === "精緻飲品"));

const dessertTrackRef = ref(null);
const drinkTrackRef = ref(null);

function scrollCarousel(trackEl, direction) {
  if (!trackEl) return;
  const amount = trackEl.clientWidth * 0.8;
  trackEl.scrollBy({ left: direction * amount, behavior: "smooth" });
}

async function getProducts() {
  try {
    const httpRes = await fetch(API.productsAll());
    const res = await httpRes.json();
    products.value = res.products || [];
  } catch (err) {
    notify.error("取得商品失敗");
  }
}

const isLoad = ref(true); // 初始為 true，表示頁面正在載入

// 每次路由變化都重置 isLoad
watch(route, () => {
  isLoad.value = true;
  setTimeout(() => {
    isLoad.value = false;
  }, 500); // 你的特效持續時間
});

onMounted(() => {
  // 模擬頁面載入完成，2秒後關閉 spinner
  setTimeout(() => {
    isLoad.value = false;
  }, 2000);
});

getProducts();
</script>

<style scoped>
.home-hero {
  padding: var(--s5) 0 var(--s6);
}
.hero-grid {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: var(--s5);
  align-items: center;
}
.hero-title {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 48px;
  line-height: 1.35;
  letter-spacing: .06em;
  margin: var(--s3) 0 0;
}
.hero-fr-title {
  display: block;
  font-size: 28px;
  color: var(--gold);
  margin: var(--s2) 0 var(--s3);
}
.hero-lead {
  color: var(--muted);
  max-width: 26em;
  margin-bottom: var(--s4);
}
.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--s4);
  flex-wrap: wrap;
}
.hero-media {
  position: relative;
  padding: 0 0 var(--s5) var(--s5);
}
.hero-media .main {
  width: 100%;
}
.hero-main-img {
  width: 100%;
  aspect-ratio: 4 / 4.8;
  object-fit: cover;
  display: block;
}
.story-img {
  width: 100%;
  height: 100%;
  min-height: 360px;
  object-fit: cover;
  display: block;
}
.theme-story {
  padding: var(--s4) 0 var(--s6);
}
.hero-media .inset {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 42%;
  outline: 10px solid var(--ivory);
}
.hero-media .stamp {
  position: absolute;
  right: -14px;
  top: 28px;
  width: 116px;
  height: 116px;
  border-radius: 50%;
  background: var(--espresso);
  color: var(--gold-light);
  display: grid;
  place-items: center;
  text-align: center;
  font-family: var(--latin);
  font-size: 14px;
  line-height: 1.3;
  letter-spacing: .1em;
}
.hero-media .stamp i {
  display: block;
  font-size: 22px;
  letter-spacing: 0;
}

.home-manifesto {
  text-align: center;
  padding: 0 0 var(--s6);
}
.home-manifesto .ornament {
  margin-bottom: var(--s4);
}
.manifesto-big {
  font-family: var(--serif);
  font-weight: 400;
  font-size: 24px;
  line-height: 1.9;
  letter-spacing: .08em;
  max-width: 30em;
  margin: 0 auto;
}
.manifesto-big em {
  font-style: normal;
  color: var(--rose);
}
.manifesto-sign {
  margin-top: var(--s3);
  font-size: 20px;
  color: var(--muted);
}

@media (max-width: 960px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
  .hero-title {
    font-size: 36px;
  }
  .hero-media {
    padding-left: var(--s4);
  }
  .hero-media .stamp {
    right: 8px;
    width: 96px;
    height: 96px;
    font-size: 12px;
  }
  .manifesto-big {
    font-size: 19px;
  }
}
</style>
