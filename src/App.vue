<template>
  <div class="app">
    <PuzzleVerify
      :width="360"
      
      :autoRefresh="false"
      ref="puzzleRef"
      @success="onSuccess"
      @fail="onFail"
      @refresh="onRefresh"
    />
    <div @click="reset">reset</div>
  </div>
</template>

<script setup lang="ts">
// import PuzzleVerify from './PuzzleVerify'
// import '../src/assets/iconfont.css'

import PuzzleVerify from 'puzzle-verify';
import 'puzzle-verify/lib/style.css';

import { ref } from 'vue'

const puzzleRef = ref()
const imgSrc = ref('../src/assets/images/verificationImg1.jpg')

function onSuccess (params: any) {
  console.log('success', params)
}

function onFail (params: any) {
  console.log('fail', params)
  // onRefresh()
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
