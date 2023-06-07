<template>
  <div class="puzzle-verify" :style="wrapperStyle">
    <!-- <div class="img" style="width: 100%; height: 280px; background-color: cadetblue;"></div> -->
    <div class="img-box">
      <div v-if="maskShow" class="iconfont mask">
        <div class="rotate">&#xe602;</div>
        <span>加载中</span>
      </div>
      <span class="iconfont refresh" @click="reset()">&#xe65e;</span>
      <img 
        src="../../assets/images/verificationImg1.jpg" 
        ref="imgRef"
        @load="onImgLoad"
      />
      <canvas
        ref="mainCanvasRef"
        class="main-canvas"
      ></canvas>
      <canvas
        ref="moveCanvasRef"
        :class="{goFirst: canvasInfo.isOk, goKeep: canvasInfo.isKeep}"
        class="move-canvas"
      ></canvas>
      <!-- <div class="passText" :class="{passed: isPassing}">验证成功</div> -->
    </div>
    <div 
      class="drag-box"
      :class="{ 'drag-passing': isPassing }"
      @mousemove="dragMove"
      @mouseleave="dragEnd"
    >
      <div 
        class="tip-text"
        :style="tipTextStyle"
        ref="tipText"
      >
        {{ isPassing ? '验证成功': '拖动滑块完成验证' }}
        <div v-if="!isPassing" class="light" />
      </div>
      <template v-if="!isPassing">
        <div class="progress-bar" :style="progressBarStyle" ref="progressBarRef"></div>
        <div class="drag-bar" :style="dragBarStyle" ref="dragBarRef" @mousedown="dragStart" @mouseup="dragEnd">
          <span class="iconfont arrow">&#xe618;</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, unref } from 'vue'

const props = defineProps({
  width: {
    type: Number,
    default: 360
  },
  dragBarHeight: {
    type: Number,
    default: 40
  },
  dragBarWidth: {
    type: Number,
    default: 50
  }
})

const maskShow = ref(false)

// wrapper样式
const wrapperStyle = computed(() => {
  return {
    width: `${props.width}px`
  }
})

const mainCanvasRef = ref()
const moveCanvasRef = ref()
const canvasInfo = reactive({
  isOk: false,
  isKeep: false,
  clipBarx: 0
})
const imgRef = ref()

const tipText = ref()
const tipTextStyle = computed(() => {
  return {
    lineHeight: `${props.dragBarHeight}px`
  }
})

const progressBarRef = ref()
// 进度条样式
const progressBarStyle = computed(() => {
  return {
    height: `${props.dragBarHeight}px`,
    // width: `${props.dragBarWidth - 10 + dragBarInfo.left}px`,
    borderRadius: `${props.dragBarHeight}px`,
  }
})

const isPassing = ref(false)
const dragBarRef = ref()

// 拖动块位置信息
const dragBarInfo = reactive({
  left: 0,
  startX: 0,
  isMoving: false,
  imgX: 0
})

// 拖动块样式
const dragBarStyle = computed(() => {
  return {
    width: `${props.dragBarWidth}px`,
    height: `${props.dragBarHeight}px`,
    left: `${unref(dragBarInfo.left)}px`,
    lineHeight: `${props.dragBarHeight}px`,
    borderRadius: `${props.dragBarHeight}px`,
  }
})

// 拖动事件开始
const dragStart = (e: { x: number; }) => {
  if (isPassing.value) return
  dragBarInfo.startX = e.x
  dragBarInfo.isMoving = true
}

// 拖动中
const dragMove = (e: { x: number; }) => {
  if (!dragBarInfo.isMoving) return
  const distance = e.x - dragBarInfo.startX
  dragBarInfo.left = distance
  moveCanvasRef.value.style.left = distance + 'px' // 更改canvas位置
  progressBarRef.value.style.width = props.dragBarWidth - 10 + distance + 'px'
}

// 拖动结束（超出拖动范围、松开鼠标）
const dragEnd = (e) => {
  if (e.type === 'mouseup') {
    const diff = Math.abs(dragBarInfo.imgX - dragBarInfo.left)
    if (diff < 5) {
      isPassing.value = true
      console.log(tipText.value.style.property)
    }
  }
  if (dragBarInfo.isMoving && !isPassing.value) {
    unref(progressBarRef).style.transition = 'width .5s'
    unref(dragBarRef).style.transition = 'all .5s'
    unref(moveCanvasRef).style.transition = 'left .5s'
    reset(true)
  }
  dragBarInfo.isMoving = false
}

// 重置
const reset = (flag?: boolean) => {
  if(!flag) {
    maskShow.value = true
    setTimeout(() => {
      imgRef.value.src = '../../../src/assets/images/verificationImg1.jpg'
      maskShow.value = false
    }, 1000);
  }
  isPassing.value = false
  dragBarInfo.left = 0
  dragBarInfo.startX = 0
  unref(moveCanvasRef).style.left = 0
  if (unref(progressBarRef)) unref(progressBarRef).style.width = 0
  flag && setTimeout(() => {
    unref(dragBarRef).style.transition = 'background .3s linear'
    unref(progressBarRef).style.transition = ''
    unref(moveCanvasRef).style.transition = ''
  }, 500)
}

const draw = (ctx, x, y, operation) => {
  var l = props.dragBarWidth;
  var r = 8;
  const PI = Math.PI;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
  ctx.lineTo(x + l, y);
  ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
  ctx.lineTo(x + l, y + l);
  ctx.lineTo(x, y + l);
  ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
  ctx.lineTo(x, y);
  ctx.lineWidth = 0;
  ctx.fillStyle = "rgba(255, 255, 255, .85)";
  ctx.strokeStyle = "rgba(255, 255, 255, .8)";
  ctx.stroke();
  ctx[operation]();
  ctx.globalCompositeOperation = "destination-over";
}

// 图片加载完成
const onImgLoad = () => {
  // 生成图片缺失位置
  const barWidth = props.dragBarWidth;
  const imgHeight = imgRef.value.height;
  const imgWidth = imgRef.value.width;
  const halfWidth = Math.floor(props.width / 2);
  const refreshHeigth = 25;
  const tipHeight = 20;
  const x = halfWidth + Math.floor(Math.random() * (halfWidth - barWidth - refreshHeigth));
  let y =
    refreshHeigth +
    Math.floor(
      Math.random() * (imgHeight - barWidth - refreshHeigth - tipHeight)
    );
  mainCanvasRef.value.setAttribute("width", imgWidth);
  mainCanvasRef.value.setAttribute("height", imgHeight);
  mainCanvasRef.value.style.display = "block";
  const canvasCtx = mainCanvasRef.value.getContext("2d");
  draw(canvasCtx, x, y, "fill");
  canvasInfo.clipBarx = x;
  dragBarInfo.imgX = x
  console.log(x)

  // 生成图块
  const moveCanvas = moveCanvasRef.value;
  moveCanvas.setAttribute("width", imgWidth);
  moveCanvas.setAttribute("height", imgHeight);
  moveCanvas.style.display = "block";
  const L = barWidth + 8 * 2 + 3; //实际宽度
  const moveCtx = moveCanvas.getContext("2d");
  moveCtx.clearRect(0, 0, imgWidth, imgHeight);
  draw(moveCtx, x, y, "clip");
  moveCtx.drawImage(imgRef.value, 0, 0, imgWidth, imgHeight);
  y = y - 8 * 2 - 1;
  const ImageData = moveCtx.getImageData(x, y, L, L);
  moveCanvas.setAttribute("width", L);
  moveCanvas.setAttribute("height", imgHeight);
  moveCtx.putImageData(ImageData, 0, y);
}
</script>

<style lang="scss" scoped>
.puzzle-verify {
  width: 360px;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #FFF;
  transition: all 2s;

  .img-box {
    position: relative;
    overflow: hidden;
    .mask {
      position: absolute;
      z-index: 999;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      color: #000;
      background: rgba($color: #FFF, $alpha: .8);
      .rotate {
        animation: rotate 2s linear infinite;
      }
      span {
        margin-top: 5px;
        font-size: 14px;
      }
    }
    
    .refresh {
      position: absolute;
      z-index: 4;
      right: 5px;
      top: 5px;
      width: 30px;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      text-align: center;
      font-weight: bold;
      background: rgba($color: #000, $alpha: .3);
      color: #FFF;
      user-select: none;
    }
    >img {
      width: 100%;
    }
    .main-canvas {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .move-canvas {
      position: absolute;
      top: 0;
      left: 0;
    }
    .passText {
      position: absolute;
      bottom: -30px;
      left: 0;
      width: 100%;
      background-color: aquamarine;
      color: #FFF;
      font-size: 14px;
      text-align: center;
      line-height: 30px;
      transition: all .5s;
    }
  }

  .drag-box {
    position: relative;
    width: 100%;
    height: 40px;
    margin: 5px auto;
    line-height: 40px;
    border-radius: 40px;
    font-size: 12px;
    color: #000;
    background-color: #F0F4F9;
    text-align: center;
    overflow: hidden;
    transition: background .5s linear;
    .tip-text {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
      width: 100%;
      height: 100%;
      text-align: center;
      user-select: none;
      .light {
        position: absolute;
        top: 0;
        left: -30px;
        width: 30px;
        height: 100%;
        background: linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%);
        animation: slide 3s linear infinite;
      }
    }
    .progress-bar {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      background-color: aqua;
    }

    .drag-bar {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 3;
      width: 50px;
      height: 40px;
      line-height: 40px;
      border-radius: 40px;
      background-color: #FFF;
      color: #999;
      text-align: center;
      cursor: pointer;
      user-select: none;
      // filter: drop-shadow(0 0 2px blue);
      transition: background .3s linear;
      &:hover {
        // filter: drop-shadow(0 0 5px blue);
        background: paleturquoise
      }
      .arrow {
        font-size: 18px;
      }
    }
  }
  .drag-passing {
    background-color: aquamarine;
  }
}
@keyframes slide {
  from {
    left: -200px;
  }
  to {
    left: 100%;
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>