<script lang="ts" setup>
import { ref } from 'vue'
import { ItemType } from '@/interface';
import { copy } from '@/utils'
import emojAllData from '@/emoj/emoj-all.txt?raw'

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

function getAllEmojIconData() {
  const categorizedEmojiIds: {
    [category: string]: { [subcategory: string]: Array<string> }
  } = {}
  const categoryStack = []
  for (const { type, value } of getUnicodeEmojiFromText(emojAllData)) {
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

  return categorizedEmojiIds
}

const emojAllItems = ref()
emojAllItems.value = getAllEmojIconData()

const itemClick = (item: ItemType) => {
  copy(item.emoj!)
}

const keyWords = ref('')
const searchByKeyWords = (keyWords: string) => {
  emojAllItems.value = getAllEmojIconData()
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
</script>

<template>
  <div class="layout">
    <el-input v-model="keyWords"></el-input>
    <el-tabs type="border-card" tab-position="bottom">
      <el-tab-pane v-for="(emojItems, key) in emojAllItems" :label="key">
        <div class="emoj-items">
          <span v-for="emojItem in emojItems" class="emoj-item">
            <span v-for="emoj in emojItem" class="emoj">
              {{ emoj }}
            </span>
          </span>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.layout {
  width: 600px;
}

.emoj-items {
  height: 200px;
  overflow-y: auto;
}

.emoj {
  font-size: 20px;
}
</style>
