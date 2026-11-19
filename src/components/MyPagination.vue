<template>
  <nav aria-label="Page navigation example" v-if="pages && pages.total_pages > 0">
    <ul class="pagination justify-content-center">
      <!-- 上一頁 -->
      <li class="page-item" :class="{ disabled: pages.current_page <= 1 }">
        <a class="page-link" href="#" @click.prevent="updatePage(pages.current_page - 1)">
          &laquo;
        </a>
      </li>

      <!-- 頁碼 -->
      <li class="page-item" 
          v-for="page in pages.total_pages" 
          :key="page"
          :class="{ active: page === pages.current_page }">
        <a class="page-link" href="#" @click.prevent="updatePage(page)">{{ page }}</a>
      </li>

      <!-- 下一頁 -->
      <li class="page-item" :class="{ disabled: pages.current_page >= pages.total_pages }">
        <a class="page-link" href="#" @click.prevent="updatePage(pages.current_page + 1)">
          &raquo;
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
defineProps(['pages'])
const emit = defineEmits(['emit-pages'])

function updatePage(page) {
  emit('emit-pages', page)
}
</script>

<style scoped>
.pagination {
  --bs-pagination-color: var(--espresso);
  --bs-pagination-bg: transparent;
  --bs-pagination-border-color: var(--hairline);
  --bs-pagination-hover-color: var(--ivory);
  --bs-pagination-hover-bg: var(--espresso);
  --bs-pagination-hover-border-color: var(--espresso);
  --bs-pagination-focus-color: var(--espresso);
  --bs-pagination-focus-bg: var(--paper);
  --bs-pagination-active-color: var(--ivory);
  --bs-pagination-active-bg: var(--espresso);
  --bs-pagination-active-border-color: var(--espresso);
  --bs-pagination-disabled-color: var(--muted);
  --bs-pagination-disabled-bg: transparent;
  --bs-pagination-disabled-border-color: var(--hairline);
}
</style>