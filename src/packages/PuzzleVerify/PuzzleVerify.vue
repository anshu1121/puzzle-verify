<template>
  <div class="puzzle-verify" :class="wrapper" :style="wrapperStyle">
    <div v-if="showMask" class="iconfont mask">
      <div class="rotate">&#xe602;</div>
      <span>{{ verifyFailed ? '验证失败，请重试': '加载中' }}</span>
    </div>
    <div class="img-box">
      <span v-if="showRefresh && !isPassed" class="iconfont refresh" @click="refreshImg()">&#xe65e;</span>
      <img
        :src="imgSrc"
        ref="imgRef"
        @load="onImgLoad"
      />
      <canvas ref="mainCanvasRef" class="main-canvas"></canvas>
      <canvas
        ref="moveCanvasRef"
        :class="{ goFirst: canvasInfo.isOk, goKeep: canvasInfo.isKeep }"
        class="move-canvas"
      >
      </canvas>
    </div>
    <div
      class="drag-box"
      @mousemove="dragMove"
      @mouseleave="dragEnd"
    >
      <div class="tip-text">
        {{ isPassed ? '' : tip }}
        <div v-if="!isPassed" class="light" />
      </div>
      <div
        class="progress-bar"
        :class="{'progress-bar-passed': isPassed, 'progress-bar-fail': verifyFailed }"
        ref="progressBarRef"
      >
        {{ isPassed ? successTip : '' }}
      </div>
      <div
        class="drag-bar"
        :style="dragBarStyle"
        ref="dragBarRef"
        @mousedown="dragStart"
        @mouseup="dragEnd"
      >
        <span class="iconfont arrow">
          {{ isPassed ? '&#xeaf1;' : '&#xe618;' }}  
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, unref } from 'vue'
import { draw } from './utils'
const props = defineProps({
  imgSrc: {
    type: String
  },
  wrapper: {
    type: String
  },
  width: {
    type: Number,
    default: 360,
  },
  tip: {
    type: String,
    default: '拖动滑块完成验证'
  },
  successTip: {
    type: String,
    default: '验证成功'
  },
  showRefresh: {
    type: Boolean,
    default: true
  },
  diffDistance: {
    type: Number,
    default: 5
  },
  autoRefresh: {
    type: Boolean,
    default: false
  }
});

const emmits = defineEmits(['success', 'fail', 'refresh'])

const showMask = ref(false)
const verifyFailed = ref(false)

// wrapper样式
const wrapperStyle = computed(() => {
  return {
    width: `${props.width}px`,
  };
});

const mainCanvasRef = ref();
const moveCanvasRef = ref();
const canvasInfo = reactive({
  isOk: false,
  isKeep: false,
  clipBarx: 0,
});
const imgRef = ref();

const progressBarRef = ref();

const isPassed = ref(false);
const dragBarRef = ref();

// 拖动块位置信息
const dragBarInfo = reactive({
  left: 0,
  startX: 0,
  isMoving: false,
  imgX: 0,
});

// 拖动块样式
const dragBarStyle = computed(() => {
  return {
    left: `${unref(dragBarInfo.left)}px`
  };
});

// 拖动事件开始
const dragStart = (e: { x: number }) => {
  if (isPassed.value) return;
  dragBarInfo.startX = e.x;
  dragBarInfo.isMoving = true;
};

// 拖动中
const dragMove = (e: { x: number }) => {
  if (!dragBarInfo.isMoving) return;
  const distance = e.x - dragBarInfo.startX;
  dragBarInfo.left = distance;
  moveCanvasRef.value.style.left = distance + "px"; // 更改canvas位置
  progressBarRef.value.style.width = 40 + distance + "px";
};

// 拖动结束（超出拖动范围、松开鼠标）
const dragEnd = (e: { type: string; }) => {
  if (e.type === "mouseup") {
    const diff = Math.abs(dragBarInfo.imgX - dragBarInfo.left);
    if (diff < props.diffDistance) {
      isPassed.value = true;
      emmits('success', { moveDistance: dragBarInfo.left, pointX: dragBarInfo.imgX })
    } else {
      if (props.autoRefresh) showMask.value = true
      verifyFailed.value = true
      emmits('fail', { moveDistance: dragBarInfo.left, pointX: dragBarInfo.imgX })
    }
  }
  if (e.type === "mouseup" && props.autoRefresh) {
    dragBarInfo.isMoving = false;
    return
  }
  if (dragBarInfo.isMoving && !isPassed.value) {
    unref(progressBarRef).style.transition = "width .5s";
    unref(dragBarRef).style.transition = "all .5s";
    unref(moveCanvasRef).style.transition = "left .5s";
    reset();
  }
  dragBarInfo.isMoving = false;
};

// 刷新拼图
const refreshImg = () => {
  showMask.value = true;
  emmits('refresh')
}

// 重置
const reset = () => {
  verifyFailed.value = false
  isPassed.value = false;
  dragBarInfo.left = 0;
  dragBarInfo.startX = 0;
  unref(moveCanvasRef).style.left = 0;
  if (unref(progressBarRef)) unref(progressBarRef).style.width = 0;
  setTimeout(() => {
    unref(dragBarRef).style.transition = "";
    unref(progressBarRef).style.transition = "";
    unref(moveCanvasRef).style.transition = "";
  }, 500);
};
defineExpose({ reset })

// 图片加载完成
const onImgLoad = () => {
  reset();
  showMask.value = false;
  // 生成图片缺失位置
  const barWidth = 50;
  const imgHeight = imgRef.value.height;
  const imgWidth = imgRef.value.width;
  const halfWidth = Math.floor(Number(props.width) / 2);
  const refreshHeigth = 25;
  const tipHeight = 20;
  const x =
    halfWidth +
    Math.floor(Math.random() * (halfWidth - barWidth - refreshHeigth));
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
  dragBarInfo.imgX = x;

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
};
</script>

<style lang="scss" scoped>
.puzzle-verify {
  position: relative;
  width: 360px;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  .mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #000;
    background: rgba($color: #fff, $alpha: 0.8);
    .rotate {
      animation: rotate 2s linear infinite;
    }
    span {
      margin-top: 5px;
      font-size: 14px;
    }
  }
  .img-box {
    position: relative;
    overflow: hidden;

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
      background: rgba($color: #000, $alpha: 0.3);
      color: #fff;
      user-select: none;
    }
    > img {
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
      color: #000;
      font-size: 14px;
      text-align: center;
      line-height: 30px;
      transition: all 0.5s;
    }
    .passed {
      bottom: 0;
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
    background-color: #f0f4f9;
    text-align: center;
    overflow: hidden;
    transition: background 0.5s linear;
    .tip-text {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
      width: 100%;
      height: 100%;
      line-height: 40px;
      text-align: center;
      user-select: none;
      .light {
        position: absolute;
        top: 0;
        left: -30px;
        width: 30px;
        height: 100%;
        background: linear-gradient(
          to right,
          transparent 0%,
          rgba(255, 255, 255, 0.8) 50%,
          transparent 100%
        );
        animation: slide 3s linear infinite;
      }
    }
    .progress-bar {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      height: 40px;
      border-radius: 40px;
      background-color: #ccc;
      color: #FFF;
    }
    .progress-bar-passed {
      background-color: rgb(118, 198, 29, .8);
    }
    .progress-bar-fail {
      background-color: red
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
      background-color: #fff;
      color: #999;
      text-align: center;
      cursor: pointer;
      user-select: none;
      box-shadow: inset 0 0 10px #ddd;
      transition: background 0.3s linear;
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
