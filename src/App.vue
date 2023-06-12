<template>
  <div class="app">
    <PuzzleVerify :width="360" @success="onSuccess" @fail="onFail" @refresh="onRefresh" :imgSrc="imgSrc" :autoRefresh="false" ref="puzzleRef"  />
    <div @click="reset">reset</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import PuzzleVerify from './packages/PuzzleVerify'
const puzzleRef = ref()
const imgSrc = ref('../src/assets/images/verificationImg1.jpg')
function onSuccess (params: any) {
  console.log(params)
}

function onFail (params: any) {
  console.log(params)
}

function reset () {
  puzzleRef.value.reset()
}

async function onRefresh () {
  const res = await reloadImg()
  imgSrc.value = res
}

function reloadImg (): any {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newImgSrc = imgSrc.value === '../src/assets/images/verificationImg1.jpg' ? '../src/assets/images/verificationImg2.jpg' : '../src/assets/images/verificationImg1.jpg'
      resolve(newImgSrc)
    }, 500);
  })
}
</script>
