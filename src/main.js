import { createApp } from 'vue'
import App from './App.vue'

// 引入 Bootstrap 5
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// 視覺主題（字體、顏色變數、共用樣式）
import './assets/theme.css'

// 引入 router
import router from './router'

// 滾動浮現效果（v-reveal）
import reveal from './directives/reveal'

// 建立 app 實例
const app = createApp(App)
app.directive('reveal', reveal)

// 掛載 router 與 app
app.use(router)
app.mount('#app')
