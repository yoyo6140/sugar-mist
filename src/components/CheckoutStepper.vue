<template>
  <div class="stepper">
    <div
      v-for="s in steps"
      :key="s.n"
      :class="['step', current >= s.n ? 'active' : '', current > s.n ? 'done' : '']"
    >
      <div class="circle">{{ s.n }}</div>
      <div class="label">{{ s.label }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  current: { type: Number, required: true }
})

const steps = [
  { n: 1, label: '購物車' },
  { n: 2, label: '填寫資料' },
  { n: 3, label: '確認付款' },
]
</script>

<style scoped>
.stepper {
  display: flex;
  justify-content: space-between;
  flex: 1;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}
.step .circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--hairline);
  background: var(--paper);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--muted);
  font-family: var(--latin);
  font-weight: 500;
  z-index: 1;
}
.step .label {
  margin-top: var(--s1);
  text-align: center;
  font-size: 13px;
  letter-spacing: .08em;
  color: var(--muted);
}
.step.active .circle {
  border-color: var(--espresso);
  background: var(--espresso);
  color: var(--ivory);
}
.step.done .circle {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--ivory);
}
.step.active .label,
.step.done .label {
  color: var(--espresso);
}
.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  right: -50%;
  width: 100%;
  height: 1px;
  background: var(--hairline);
  z-index: 0;
}
.step.active:not(:last-child)::after,
.step.done:not(:last-child)::after {
  background: var(--gold);
}

@media (max-width: 600px) {
  .step .label {
    font-size: 11px;
  }
}
</style>
