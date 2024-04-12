<script lang="ts" setup>
import {ref, watch} from 'vue'
import {ItemType} from '@/interface';
import {emojItems} from '@/emoj'
import {copy} from '@/utils'

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

  emojAllItems.value = [{emoj: '👓', name: '筛选结果', children: results}]
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
    <div class="search-input">
      <el-input v-model="keyWords"></el-input>
    </div>
    <el-tabs type="border-card" tab-position="bottom">
      <el-tab-pane v-for="tabs in emojAllItems" :key="tabs.name" :label="tabs.emoj">
        <span v-for="emojItem in tabs.children" :key="emojItem.name" class="emoj-table">
          <span class="emoj-table-item" @click="itemClick(emojItem)"  :title="emojItem.name">{{ emojItem.emoj }} </span>
        </span>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
.layout {
  background: #333;
  width: 380px;
  position: relative;
  z-index: 0;
  cursor: pointer;
}

.search-input {
  padding: 8px 6px 0 6px;
}

.el-input__wrapper:hover {
  box-shadow: none;
}

.el-tabs {
  background: #333;
}

.el-tabs--border-card {
  border: none;
}

.el-tabs__content {
  padding: 4px !important;
  height: 300px;
  overflow-y: auto;
}

.emoj-table-item {
  background: #333;
  display: inline-block;
  text-align: center;
  width: 23px;
  height: 23px;
  padding: 4px;
  font-size: 20px;
}

.emoj-table-item:hover {
  border-radius: 4px;
  background: #ccc;
  box-shadow: 0px 0px 12px #141414;
}
</style>
