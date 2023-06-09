<template>
  <div class="app">
    <PuzzleVerify :width="500" @success="onSuccess" @refresh="refresh" v-model:imgSrc="imgSrc" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PuzzleVerify from './packages/PuzzleVerify'

const imgSrc = ref('../src/assets/images/verificationImg1.jpg')
function onSuccess (params) {
  console.log(params)
}

function refresh () {
  setTimeout(() => {
    imgSrc.value = imgSrc.value === '../src/assets/images/verificationImg1.jpg' ? '../src/assets/images/verificationImg2.jpg' : '../src/assets/images/verificationImg1.jpg'
  }, 500);
  
}
</script>
