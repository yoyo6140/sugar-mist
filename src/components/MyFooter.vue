<template>
  <footer class="theme-footer">
    <div class="theme-wrap">
      <div class="top">
        <div class="brand">
          <span class="en">SUGAR MIST</span>
          <span class="zh">糖霧・甜點與茶</span>
        </div>
        <div class="social">
          <button type="button" class="social-btn" @click="goTo('Instagram')" aria-label="Instagram">
            <i class="bi bi-instagram"></i>
          </button>
          <button type="button" class="social-btn" @click="goTo('Facebook')" aria-label="Facebook">
            <i class="bi bi-facebook"></i>
          </button>
          <button type="button" class="social-btn" @click="goTo('LINE')" aria-label="LINE">
            <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
              <path d="M19 3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3v3.2c0 .45.52.7.87.41L13.5 17H19a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="bottom">
        <p>© 2026 Sugar Mist Pâtisserie</p>
        <p>本網站所呈現之商品均非真實販售商品，網站內容僅為個人作品集展示之用。</p>
        <router-link class="footer-admin" to="/admin/products">管理登入</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup>
function goTo(name) {
  alert(`已前往 ${name}`)
}
</script>

<style scoped>
.top {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--s3);
}
.social {
  display: flex;
  align-items: center;
  gap: var(--s2);
  margin-left: 20px;
}
.social-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(201, 168, 110, .4);
  border-radius: 50%;
  background: none;
  color: var(--on-dark-muted);
  font-size: 16px;
  cursor: pointer;
  transition: color .25s ease, border-color .25s ease;
}
.social-btn:hover {
  color: var(--gold-light);
  border-color: var(--gold-light);
}
.footer-admin {
  font-size: 13px;
  letter-spacing: .2em;
  color: var(--on-dark-muted);
  text-decoration: none;
  transition: color .25s ease;
}
.footer-admin:hover {
  color: var(--gold-light);
}
</style>
