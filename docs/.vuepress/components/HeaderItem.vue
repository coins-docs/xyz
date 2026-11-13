<template>
  <li class="header-item" :class="[`level-${header.level}`, { 'has-children': hasChildren, 'is-expanded': isExpanded, 'is-active': isActive }]">
    <div class="header-content" @click="handleToggle">
      <!-- 标题链接 -->
      <a 
        :href="'#' + header.slug"
        class="header-link"
        :class="{ 'active': isActive }"
        @click.stop.prevent="$emit('scroll-to', header.slug)"
      >
        <span class="header-text">{{ header.title }}</span>
      </a>
      
      <!-- 展开/折叠按钮 - 移动到右侧 -->
      <button 
        v-if="hasChildren"
        class="expand-btn"
        :class="{ 'expanded': isExpanded }"
        @click.stop="$emit('toggle', header.slug)"
      >
        <svg class="expand-icon" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z"/>
        </svg>
      </button>
    </div>
    
    <!-- 子标题列表 -->
    <transition name="slide">
      <ul v-if="hasChildren && isExpanded" class="children-list">
        <HeaderItem 
          v-for="child in header.children" 
          :key="child.slug"
          :header="child"
          :active-slug="activeSlug"
          :expanded-headers="expandedHeaders"
          @scroll-to="$emit('scroll-to', $event)"
          @toggle="$emit('toggle', $event)"
        />
      </ul>
    </transition>
  </li>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  header: Object,
  activeSlug: String,
  expandedHeaders: Set
})

const emit = defineEmits(['scroll-to', 'toggle'])

const hasChildren = computed(() => {
  return props.header.children && props.header.children.length > 0
})

const isExpanded = computed(() => {
  return props.expandedHeaders.has(props.header.slug)
})

const isActive = computed(() => {
  return props.activeSlug === props.header.slug
})

const handleToggle = () => {
  emit('toggle', props.header.slug)
}
</script>

<style lang="scss" scoped>
.header-item {
  position: relative;
  
  &.level-1 {
    --indent: 0rem;
    --text-size: 0.95rem;
    --text-weight: 600;
  }
  
  &.level-2 {
    --indent: 0.7rem;
    --text-size: 0.9rem;
    --text-weight: 500;
  }
  
  &.level-3 {
    --indent: 1.3rem;
    --text-size: 0.85rem;
    --text-weight: 500;
  }
  
  &.level-4 {
    --indent: 2rem;
    --text-size: 0.8rem;
    --text-weight: 400;
  }
  
  &.level-5 {
    --indent: 3rem;
    --text-size: 0.8rem;
    --text-weight: 400;
  }
  
  &.level-6 {
    --indent: 4rem;
    --text-size: 0.75rem;
    --text-weight: 400;
  }
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: var(--indent);
  padding: 0;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
  min-height: 1.5rem;
  
  &:hover {
    background-color: rgba(25, 118, 210, 0.05);
  }
}

.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-left: 8px;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #999999;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background-color: rgba(25, 118, 210, 0.1);
    color: #1976d2;
  }
  
  &.expanded {
    .expand-icon {
      transform: rotate(90deg);
    }
  }
}

.expand-icon {
  transition: transform 0.2s ease;
}

.header-link {
  flex: 1;
  display: block;
  color: #495057;
  text-decoration: none;
  font-size: var(--text-size);
  font-weight: var(--text-weight);
  line-height: 1.4;
  transition: all 0.2s ease;
  padding: 8px 12px;
  min-width: 0; // 允许文本缩小
  
  &:hover {
    color: #131B26;
  }
  
  &.active {
    color: #131B26;
    font-weight: 600;
    position: relative;
  }
}

.header-text {
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.4;
  display: block;
  width: 100%;
}

.children-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

// 展开/折叠动画
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  transform-origin: top;
}

.slide-enter-from {
  opacity: 0;
  transform: scaleY(0);
  max-height: 0;
}

.slide-leave-to {
  opacity: 0;
  transform: scaleY(0);
  max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: scaleY(1);
  max-height: 1000px;
}

// 暗色主题适配
:global(.dark-theme) .header-item {
  .header-content:hover {
    background-color: rgba(100, 181, 246, 0.08);
  }
  
  .expand-btn {
    color: #a0a0a0;
    
    &:hover {
      background-color: rgba(100, 181, 246, 0.15);
      color: #64b5f6;
    }
  }
  
  .header-link {
    color: #e0e0e0;
    
    &:hover {
      color: #64b5f6;
    }
    
    &.active {
      color: #fff;
      
      &::before {
        background: linear-gradient(to bottom, #64b5f6, #42a5f5);
      }
    }
  }
}
</style>
