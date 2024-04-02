<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ItemType } from '@/interface';
import { copy } from '@/utils'
import { onMounted } from 'vue';
import emojAllData from '@/emoj/emoj-all.txt?raw'

const resetItems = () => {
  return null
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
      if (item.name.includes(keyWords)) {
        results.push(item);
      }
      if (item.children && item.children.length > 0) {
        searchEmojis(item.children);
      }
    });
  };
  searchEmojis(emojAllItems.value);
  emojAllItems.value = [
    {
      name: '',
      children: [
        { name: '筛选结果', children: results }
      ]
    }
  ]
}

function toTitleCase(text: string) {
  return text
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[a-zA-Z]+/g, word => word[0].toUpperCase() + word.slice(1))
}

function* getUnicodeEmojiFromText(text: string) {
  const lines = text.split('\n')
  for (const line of lines) {
    if (line.startsWith('@@')) {
      const value = line.substring(2)
      yield { type: 'category', value }
    } else if (line.startsWith('@')) {
      const value = line.substring(1)
      yield { type: 'subcategory', value }
    } else if (line.length) {
      const value = line
        .split('\t')[0]
        .split(' ')
        .map(_ => String.fromCodePoint(parseInt(_, 16)))
        .join('')
      yield { type: 'emoji', value }
    }
  }
}

function getData() {
  const categorizedEmojiIds: {
    [category: string]: { [subcategory: string]: Array<string> }
  } = {}
  const categoryStack = []
  for (const { type, value } of getUnicodeEmojiFromText(emojAllData)) {
    // console.log(type, value)
    switch (type) {
      case 'category': {
        while (categoryStack.length) categoryStack.pop()
        const title = toTitleCase(value)
        categoryStack.push(title)
        categorizedEmojiIds[title] = {}
        break
      }
      case 'subcategory': {
        if (categoryStack.length > 1) categoryStack.pop()
        const title = toTitleCase(value)
        categoryStack.push(title)
        categorizedEmojiIds[categoryStack[0]][title] = []
        break
      }
      case 'emoji': {
        const key = value.replace(/[\ufe00-\ufe0f\u200d]/g, '')
        const [category, subcategory] = categoryStack
        categorizedEmojiIds[category][subcategory].push(key)
        break
      }
      default:
        throw new Error(`Unexpected type ${JSON.stringify(type)}`)
    }
  }

  console.log(categorizedEmojiIds)
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

onMounted(() => {
  getData()
})
</script>

<template>
  <div class="layout">
    <div class="flex-column">
      <div v-for="tabs in emojAllItems" :key="tabs.name" class="emoj-tabs">
        <h3 class="emoj-tabs-title" v-if="tabs.children?.length > 0">{{ tabs.name }}</h3>
        <div v-for="item in tabs.children" :key="item.name" class="emoj-table">
          <h3 class="emoj-table-title" v-if="item.children?.length > 0">{{ item.name }}</h3>
          <div class="emoj-table-item">
            <span v-for="emojItem in item.children" :key="emojItem.name" @click="itemClick(emojItem)">
              {{ emojItem.emoj }}
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
