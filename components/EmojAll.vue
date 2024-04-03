<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ItemType } from '@/interface';
import { emojItems } from '@/emoj'
import { copy } from '@/utils'

const resetItems = () => {
  return JSON.parse(JSON.stringify(emojItems))
}

const emojAllItems = ref()
emojAllItems.value = resetItems()

const itemClick = (item: ItemType) => {
  copy(item.emoj!)
}

const keyWords = ref('')
const searchByKeyWords = (keyWords: string) => {
  emojAllItems.value = resetItems()
  const results: ItemType[] = [];
  const searchEmojis = (items: ItemType[]) => {
    items.forEach((item) => {
      if (item.name.includes(keyWords) && item.emoj) {
        results.push(item);
      }
      if (item.children && item.children.length > 0) {
        searchEmojis(item.children);
      }
    });
  };
  searchEmojis(emojAllItems.value);
  emojAllItems.value = [{ name: '筛选结果', children: results }]
}

watch(
  () => keyWords.value,
  (keyWords) => {
    if (keyWords && keyWords.trim().length > 0) {
      searchByKeyWords(keyWords)
    } else {
      emojAllItems.value = resetItems()
    }
  },
  {
    deep: true
  }
)
</script>

<template>
  <div class="layout">
    <div class="flex-column">
      <div v-for="tabs in emojAllItems" :key="tabs.name" class="emoj-tabs">
        <h3 class="emoj-tabs-title" v-if="tabs.children?.length > 0">{{ tabs.name }}</h3>
        <span v-for="emojItem in tabs.children" :key="emojItem.name" class="emoj-table">
          <span class="emoj-table-item" @click="itemClick(emojItem)">{{ emojItem.emoj }} </span>
        </span>
      </div>
    </div>
    <div class="search-box flex flex-align">
      <input type="text" v-model="keyWords" />
    </div>
  </div>
</template>

<style scoped>
.layout {
  background: #3c3c3c;
  width: 600px;
  position: relative;
  z-index: 0;
  padding-bottom: 32px;
  cursor: pointer;
}

.emoj-tabs {
  box-sizing: border-box;
  width: 100%;
  border-bottom: 1px solid #141414;
}

.emoj-tabs-title,
.emoj-table-title {
  color: #e6eaf2;
  text-align: center;
}

.emoj-table-item {
  display: inline-block;
  width: 28px;
  height: 28px;
  padding: 4px;
  font-size: 24px;
}

.emoj-table-item:hover {
  border-radius: 4px;
  box-shadow: 0px 0px 12px #141414;
}

.search-box {
  position: fixed;
  bottom: 0;
  z-index: 1;
  background: #e6eaf2;
  width: 100%;
  height: 32px;
  padding-bottom: 1px;
}

.search-box input {
  text-align: center;
  font-size: 20px;
  color: #3c3c3c;
  background: #ccc;
  width: 100%;
  margin: 0;
  height: 32px;
  border: 1px solid #3c3c3c;
  border-radius: 0;
}

.search-box input:focus-visible {
  font-size: 20px;
  border: 1px solid #3c3c3c;
  border-radius: 0 !important;
  outline: none;
}
</style>
