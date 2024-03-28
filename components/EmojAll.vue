<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ItemType } from '../interface';
import { emojItems } from '../emoj'

const resetItems = () => {
  return JSON.parse(JSON.stringify(emojItems))
}

const emojAllItems = ref()
emojAllItems.value = resetItems()

const itemClick = (item: ItemType) => {
  console.log('copy')
}

const keyWords = ref('')
const searchByKeyWords = (keyWords: string) => {
  emojAllItems.value = resetItems()
  const contents: ItemType[] = emojAllItems.value.map((tabs: ItemType) => {
    return tabs.children?.map((types: ItemType) => {
      return types.children?.filter((item: ItemType) => item.name.includes(keyWords))
    })
  })
  // emojAllItems.value = contents
  console.log(contents)
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
        <div v-if="tabs.children?.length > 0" v-for="item in tabs.children" :key="item.name" class="emoj-table">
          <h3 class="emoj-table-title" v-if="item.children?.length > 0">{{ item.name }}</h3>
          <div class="emoj-table-item">
            <span v-if="item.children?.length > 0" v-for="emojItem in item.children" :key="emojItem.name">
              {{  emojItem.emoj }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="search-box flex flex-align">
      <input type="text" v-model="keyWords" />
    </div>
  </div>
</template>

<style scoped>
.layout {
  background: #333;
  width: 600px;
  position: relative;
  z-index: 0;
  padding-bottom: 32px;
  cursor: pointer;
}

.emoj-tabs,
.emoj-table {
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
  width: 100%;
  padding-bottom: 4px;
  text-align: center;
}

.emoj-table-item span {
  display: inline-block;
  width: 28px;
  height: 28px;
  padding: 4px;
  font-size: 24px;
}

.emoj-table-item span:hover {
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
  color: #333;
  background: #ccc;
  width: 100%;
  margin: 0;
  height: 32px;
  border: 1px solid #333;
  border-radius: 0;
}

.search-box input:focus-visible {
  font-size: 20px;
  border: 1px solid #333;
  border-radius: 0 !important;
  outline: none;
}
</style>
