<template>
  <div class="theme-container" :class="containerClass">
    <!-- 移动端遮罩层 -->
    <div 
      class="sidebar-mask" 
      :class="{ 'show': isSidebarOpen }"
      @click="toggleSidebar"
    ></div>

    

    <!-- 主内容区域 -->
    <div class="main-container">
      <!-- 头部导航栏 -->
      <div class="navbar-container">
        <header class="navbar">
          <div class="navbar-content">
            <!-- 移动端菜单按钮 -->
          <button 
            class="sidebar-toggle"
            :class="{ 'active': isSidebarOpen }"
            @click="toggleSidebar"
            aria-label="Toggle sidebar"
          >
            <span class="toggle-line"></span>
            <span class="toggle-line"></span>
            <span class="toggle-line"></span>
          </button>

          <!-- 使用可信的本地 SVG，保留品牌图案并按主题调整文字颜色。 -->
          <div class="navbar-brand">
            <span class="navbar-logo" role="img" aria-label="Coins.xyz" v-html="coinsLogo"></span>
          </div>

          <!-- 中间导航链接 -->
          <nav class="navbar-nav">
            <router-link 
              v-for="item in navItems" 
              :key="item.link"
              :to="item.link" 
              class="nav-link"
              :class="{ 'is-active': isActiveNavItem(item.link) }"
            >
              {{ item.text }}
            </router-link>
          </nav>

          <!-- 右侧操作区域 -->
          <div class="navbar-actions">
            <button 
              class="theme-toggle"
              @click="toggleTheme"
              :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
            >
              <!-- 浅色主题图标 (太阳) -->
              <img v-if="isDark" class="theme-icon" :src="withBase('/icons/theme/sun.svg')" alt="Light theme" width="20" height="20" />
              <!-- 深色主题图标 (月亮) -->
              <img v-else class="theme-icon" :src="withBase('/icons/theme/moon.svg')" alt="Dark theme" width="20" height="20" />
            </button>
          </div>
        </div>
        
        <!-- 移动端导航菜单 -->
        <div class="mobile-nav" :class="{ 'show': isSidebarOpen }">
          <nav class="mobile-nav-list">
            <router-link 
              v-for="item in navItems" 
              :key="item.link"
              :to="item.link" 
              class="mobile-nav-link"
              :class="{ 'is-active': isActiveNavItem(item.link) }"
              @click="toggleSidebar"
            >
              {{ item.text }}
            </router-link>
          </nav>
        </div>
      </header>
    </div>
      <!-- 页面内容 -->
      <main class="page-content">
        <!-- 自定义侧边栏 -->
        <CustomSidebar :class="{ 'open': isSidebarOpen, 'mobile-hidden': true }" :is-dark="isDark" />
        <div class="content-wrapper">
          <!-- 面包屑导航 -->
          <nav class="breadcrumb" v-if="breadcrumbs.length > 1">
            <ol class="breadcrumb-list">
              <li 
                v-for="(crumb, index) in breadcrumbs" 
                :key="index"
                class="breadcrumb-item"
              >
                <router-link 
                  v-if="index < breadcrumbs.length - 1"
                  :to="crumb.link"
                  class="breadcrumb-link"
                >
                  {{ crumb.text }}
                </router-link>
                <span v-else class="breadcrumb-current">{{ crumb.text }}</span>
              </li>
            </ol>
          </nav>

          <!-- 页面主要内容 -->
          <div class="page-main">
            <Content />
          </div>

          <!-- 页面导航 -->
          <nav class="page-nav" v-if="prev || next">
            <div class="nav-links">
              <div class="nav-link-item prev" v-if="prev">
                <router-link :to="prev.link" class="nav-link-button">
                  <span class="nav-direction">← Previous</span>
                  <span class="nav-title">{{ prev.text }}</span>
                </router-link>
              </div>
              <div class="nav-link-item next" v-if="next">
                <router-link :to="next.link" class="nav-link-button">
                  <span class="nav-direction">Next →</span>
                  <span class="nav-title">{{ next.text }}</span>
                </router-link>
              </div>
            </div>
          </nav>
        </div>
      </main>

      <!-- 页脚 -->
      <footer class="page-footer">
        <div class="footer-content">
          
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { withBase } from 'vuepress/client'
import CustomSidebar from '../components/CustomSidebar.vue'
import coinsLogo from '../public/icons/coins-xyz-logo.svg?raw'

const route = useRoute()
const isSidebarOpen = ref(false)
const isDark = ref(false)

const navItems = [
  { text: 'Rest API', link: '/rest-api' },
  { text: 'Web Socket Streams', link: '/web-socket-streams' },
  { text: 'User Data Stream', link: '/user-data-stream' },
  { text: 'Errors', link: '/errors' }
]

const containerClass = computed(() => ({
  'sidebar-open': isSidebarOpen.value,
  'dark-theme': isDark.value
}))

const breadcrumbs = computed(() => {
  const path = route.path
  const crumbs = [{ text: 'Home', link: '/' }]
  
  const currentItem = navItems.find(item => item.link === path)
  if (currentItem && path !== '/') {
    crumbs.push({ text: currentItem.text, link: path })
  }
  
  return crumbs
})

const currentIndex = computed(() => {
  return navItems.findIndex(item => item.link === route.path)
})

const prev = computed(() => {
  const index = currentIndex.value
  return index > 0 ? navItems[index - 1] : null
})

const next = computed(() => {
  const index = currentIndex.value
  return index >= 0 && index < navItems.length - 1 ? navItems[index + 1] : null
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// 检测导航项是否为当前活跃项
const isActiveNavItem = (link) => {
  // 处理首页的特殊情况
  if (link === '/' && route.path === '/') {
    return true
  }
  // 对于其他页面，检查路径是否以链接开头（除了首页）
  if (link !== '/' && route.path.startsWith(link)) {
    return true
  }
  return false
}

// 处理窗口大小变化
const handleResize = () => {
  if (window.innerWidth > 768) {
    isSidebarOpen.value = false
  }
}

onMounted(() => {
  // 恢复主题设置
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
  
  // 调试路由信息
  console.log('Current route:', route.path)
  console.log('Nav items:', navItems)
  
  // 处理页面内的锚点链接
  const handleAnchorClick = (e) => {
    const link = e.target.closest('a[href^="#"]')
    if (link) {
      e.preventDefault()
      const hash = link.getAttribute('href')
      const targetId = hash.substring(1)
      const targetElement = document.getElementById(targetId)
      
      if (targetElement) {
        const navbar = document.querySelector('.navbar')
        const navbarHeight = navbar ? navbar.offsetHeight : 60
        const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset
        const scrollToPosition = elementTop - navbarHeight - 20 // 标题距离导航栏20px
        
        window.scrollTo({
          top: scrollToPosition,
          behavior: 'smooth'
        })
        
        // 更新URL hash
        window.history.replaceState(null, null, hash)
      }
    }
  }
  
  document.addEventListener('click', handleAnchorClick)
  window.addEventListener('resize', handleResize)
  
  // 清理函数将在onUnmounted中处理
  window._handleAnchorClick = handleAnchorClick
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (window._handleAnchorClick) {
    document.removeEventListener('click', window._handleAnchorClick)
    delete window._handleAnchorClick
  }
})
</script>

<style lang="scss" scoped>
.theme-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--c-bg);
  color: var(--c-text);
  transition: all 0.3s ease;
}

.sidebar-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  
  &.show {
    opacity: 1;
    visibility: visible;
  }
}

.main-container {
  flex: 1;
  margin-left: 0px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
  width: 100%;
  @media (max-width: 768px) {
    margin-left: 0;
  }
}
.navbar-container {
  background: white;
  border-bottom: 1px solid var(--c-border);
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100%;
  
  // 在移动端使用 fixed 定位确保滚动时不移动
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
  }
}
.navbar {
  // max-width: 1920px;
  border-bottom: none;
  box-shadow: none;
  .navbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    height: 60px;
    width: 100%;
    border-bottom: none;
    box-shadow: none;
    
    @media (min-width: 1200px) {
      padding: 0 3rem;
    }
    
    @media (max-width: 768px) {
      padding: 0 1rem;
    }

    // 窄屏优先保证导航栏不横向溢出；完整目录/搜索移动端改造可另行处理。
    @media (max-width: 480px) {
      padding: 0 0.5rem;
    }
  }
  
  .sidebar-toggle {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.75rem;
    margin-right: 1rem;
    width: 44px;
    height: 44px;
    position: relative;
    
    @media (max-width: 768px) {
      display: flex;
    }

    @media (max-width: 480px) {
      width: 40px;
      height: 40px;
      padding: 0.5rem;
      margin-right: 0.25rem;
    }
    
    .toggle-line {
      width: 20px;
      height: 2px;
      background: var(--c-text);
      margin: 2px 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: center;
      position: absolute;
      
      &:nth-child(1) {
        top: 16px;
      }
      
      &:nth-child(2) {
        top: 21px;
      }
      
      &:nth-child(3) {
        top: 26px;
      }
    }
    
    &.active {
      .toggle-line:nth-child(1) {
        transform: rotate(45deg);
        top: 21px;
      }
      .toggle-line:nth-child(2) {
        opacity: 0;
        transform: scale(0);
      }
      .toggle-line:nth-child(3) {
        transform: rotate(-45deg);
        top: 21px;
      }
    }
  }
  
  .navbar-brand {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    min-width: 0;
    
    .navbar-logo {
      display: block;
      width: 146px;
      max-width: 100%;
      line-height: 0;

      :deep(svg) {
        display: block;
        width: 100%;
        height: auto;
      }

      :deep(path:nth-of-type(-n + 2)) {
        fill: var(--c-text);
      }
    }
  }
  
  .navbar-nav {
    display: flex;
    flex: 1;
    margin: 0 2rem;
    justify-content: space-around;
    max-width: 900px;
    @media (max-width: 1024px) {
      margin: 0 1rem;
    }
    
    @media (max-width: 768px) {
      display: none;
    }
    
    .nav-link {
      color: var(--c-text);
      text-decoration: none;
      font-weight: 500;
      padding: 0.75rem;
      position: relative;
      transition: all 0.3s ease;
      border-radius: 4px;
      margin: 0 0.25rem;
      white-space: nowrap;
      
      @media (min-width: 1200px) {
        padding: 0.75rem 1.25rem;
        margin: 0 0.5rem;
        font-size: 1rem;
      }
      
      @media (min-width: 1600px) {
        padding: 0.75rem 1.5rem;
        margin: 0 0.75rem;
      }
      
      &:hover {
        color: #131B26;
        background-color: #FAFAFA;
      }
      
      &.is-active {
        color: #131B26;
        font-weight: 700;
        /* 下划线效果 */
        &::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          width: 24px;
          height: 3px;
          background: #131B26;
          border-radius: 2px;
          animation: slideIn 0.3s ease-out;
          transform: translateX(-50%);
        }
        
        &:hover {
          color: #131B26;
          background-color: #FAFAFA;
        }
      }
    }
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(-50%) scaleX(0);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) scaleX(1);
      opacity: 1;
    }
  }
  
  .navbar-actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    
    .theme-toggle {
      background: none;
      border-radius: 6px;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      height: 40px;

      @media (max-width: 480px) {
        min-width: 36px;
        height: 36px;
        padding: 0.4rem;
      }
      
      &:hover {
        background: var(--c-bg-light);
      }
      
      .theme-icon {
        font-size: 1.2rem;
      }
    }
  }
}

.page-content {
  flex: 1;
  // 固定导航栏高度，避免内容顶到导航栏（桌面端和移动端一致）
  padding-top: 60px;
  
  .content-wrapper {
    margin-left: 300px;
    max-width: calc(100% - 300px);
    padding: 2rem;
    // 与左侧搜索框顶部对齐（搜索区距导航栏 24px）
    padding-top: 1.5rem;
    .page-main{
      margin: 0 auto;
      max-width: 1920px;
      // 首个标题不再额外下移，保证和搜索框顶端齐平
      > :first-child,
      > div > :first-child {
        margin-top: 0;
      }
    }
    @media (max-width: 1024px) {
      padding: 1.5rem;
    }
    
    @media (max-width: 768px) {
      margin-left: 0;
      max-width: 100%;
      padding: 1rem;
      padding-top: 1.5rem;
    }
  }
}

.breadcrumb {
  margin-bottom: 2rem;
  
  .breadcrumb-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    
    .breadcrumb-item {
      &:not(:last-child)::after {
        content: '/';
        margin: 0 0.5rem;
        color: var(--c-text-light);
      }
      
      .breadcrumb-link {
        color: var(--c-brand);
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
      
      .breadcrumb-current {
        color: var(--c-text-light);
      }
    }
  }
}

.page-nav {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--c-border);
  
  .nav-links {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
    
    .nav-link-item {
      &.next {
        text-align: right;
        
        @media (max-width: 768px) {
          text-align: left;
        }
      }
      
      .nav-link-button {
        display: block;
        padding: 1rem;
        background: var(--c-bg-light);
        border: 1px solid var(--c-border);
        border-radius: 8px;
        text-decoration: none;
        transition: all 0.3s ease;
        
        &:hover {
          background: var(--c-brand-light);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
        }
        
        .nav-direction {
          font-size: 0.9rem;
          color: var(--c-text-light);
          display: block;
          margin-bottom: 0.25rem;
        }
        
        .nav-title {
          font-weight: 600;
          color: var(--c-text);
        }
      }
    }
  }
}

.page-footer {
  background: var(--c-bg-light);
  border-top: 1px solid var(--c-border);
  padding: 2rem;
  
  .footer-content {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }
    
    .footer-info {
      p {
        margin: 0.25rem 0;
        color: var(--c-text-light);
        font-size: 0.9rem;
      }
    }
    
    .footer-links {
      display: flex;
      gap: 1rem;
      
      a {
        color: var(--c-brand);
        text-decoration: none;
        font-size: 0.9rem;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

// 暗色主题
.dark-theme {
  .navbar-title {
    color: #fff!important;
  }
  .header-text {
    color: #fff!important;
  }
  .navbar-container {
    background: var(--c-bg-light);
  }
  .navbar {
    background: var(--c-bg-light);
    
    .navbar-nav {
      .nav-link {
        &:hover {
          color: #74b9ff;
          background-color: rgba(116, 185, 255, 0.08);
        }
        
        &.is-active {
          color: #FAFAFA;
          font-weight: 700;
          
          &::after {
            background: #FAFAFA;
          }
          
          &:hover {
            color: #54a3ff;
            background-color: rgba(116, 185, 255, 0.16);
          }
        }
      }
    }
  }
  
  .mobile-nav {
    background: var(--c-bg-light);
    
    .mobile-nav-link {
      color: #e0e0e0;
      
      &:hover {
        color: #74b9ff;
        background-color: rgba(116, 185, 255, 0.08);
        border-left-color: #74b9ff;
      }
      
      &.is-active {
        color: #74b9ff;
        background-color: rgba(116, 185, 255, 0.12);
        border-left-color: #74b9ff;
      }
    }
  }
  
  .nav-link-button:hover {
    .nav-direction {
      color: rgba(255, 255, 255, 0.8);
    }
    
    .nav-title {
      color: white;
    }
  }
}

// 移动端导航菜单
.mobile-nav {
  display: none;
  background: white;
  border-top: 1px solid var(--c-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 60px; // 导航栏高度
    left: 0;
    right: 0;
    z-index: 998; // 比导航栏稍低
  }
  
  &.show {
    max-height: 300px;
  }
  
  .mobile-nav-list {
    padding: 1rem 0;
    
    .mobile-nav-link {
      display: block;
      color: var(--c-text);
      text-decoration: none;
      font-weight: 500;
      padding: 0.75rem 2rem;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
      
      &:hover {
        color: var(--c-brand);
        background-color: rgba(25, 118, 210, 0.05);
        border-left-color: var(--c-brand);
      }
      
      &.is-active {
        color: var(--c-brand);
        font-weight: 700;
        background-color: rgba(25, 118, 210, 0.08);
        border-left-color: var(--c-brand);
      }
    }
  }
}

// 移动端隐藏自定义侧边栏
@media (max-width: 768px) {
  .mobile-hidden {
    display: none !important;
  }
}
</style>
