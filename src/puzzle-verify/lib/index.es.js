import { defineComponent as G, ref as f, computed as N, reactive as V, unref as r, openBlock as S, createElementBlock as C, normalizeClass as x, normalizeStyle as W, createElementVNode as l, toDisplayString as I, createCommentVNode as D, createTextVNode as J, pushScopeId as Q, popScopeId as U } from "vue";
const y = Math.PI, E = (e, n, a, c) => {
  e.beginPath(), e.moveTo(n, a), e.arc(n + 50 / 2, a - 8 + 2, 8, 0.72 * y, 2.26 * y), e.lineTo(n + 50, a), e.arc(n + 50 + 8 - 2, a + 50 / 2, 8, 1.21 * y, 2.78 * y), e.lineTo(n + 50, a + 50), e.lineTo(n, a + 50), e.arc(n + 8 - 2, a + 50 / 2, 8 + 0.4, 2.76 * y, 1.24 * y, !0), e.lineTo(n, a), e.lineWidth = 0, e.fillStyle = "rgba(255, 255, 255, .85)", e.strokeStyle = "rgba(255, 255, 255, .8)", e.stroke(), e[c](), e.globalCompositeOperation = "destination-over";
}, Y = (e) => (Q("data-v-ca601280"), e = e(), U(), e), Z = {
  key: 0,
  class: "iconfont mask"
}, ee = /* @__PURE__ */ Y(() => /* @__PURE__ */ l("div", { class: "rotate" }, "", -1)), te = { class: "img-box" }, se = ["src"], ae = { class: "tip-text" }, oe = {
  key: 0,
  class: "light"
}, ne = { class: "iconfont arrow" }, le = {
  name: "PuzzleVerify"
}, ie = /* @__PURE__ */ G({
  ...le,
  props: {
    imgSrc: {
      type: String
    },
    wrapper: {
      type: String
    },
    width: {
      type: Number,
      default: 360
    },
    tip: {
      type: String,
      default: "拖动滑块完成验证"
    },
    successTip: {
      type: String,
      default: "验证成功"
    },
    showRefresh: {
      type: Boolean,
      default: !0
    },
    diffDistance: {
      type: Number,
      default: 5
    },
    autoRefresh: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["success", "fail", "refresh"],
  setup(e, { expose: n, emit: a }) {
    const c = e, d = f(!1), _ = f(!1), H = N(() => ({ width: `${c.width}px` })), b = f(), v = f(), L = V({
      isOk: !1,
      isKeep: !1,
      clipBarx: 0
    }), M = f(), h = f(), i = f(!1), T = f(), t = V({
      left: 0,
      startX: 0,
      isMoving: !1,
      imgX: 0
    }), O = N(() => ({ left: `${r(t.left)}px` })), P = (o) => {
      const { type: s } = o, u = s === "mousedown" ? o.x : o.touches[0].clientX;
      i.value || (t.startX = u, t.isMoving = !0);
    }, A = (o) => {
      if (t.isMoving) {
        const { type: s } = o, p = (s === "mousemove" ? o.x : o.touches[0].clientX) - t.startX;
        t.left = p, v.value.style.left = p + "px", h.value.style.width = 40 + p + "px";
      }
    }, R = (o) => {
      const { type: s } = o;
      if ((s === "mouseup" || s === "touchend") && (Math.abs(t.imgX - t.left) < c.diffDistance ? (i.value = !0, a("success", { moveDistance: t.left, pointX: t.imgX })) : (c.autoRefresh && (d.value = !0), _.value = !0, a("fail", { moveDistance: t.left, pointX: t.imgX }))), (s === "mouseup" || s === "touchend") && c.autoRefresh) {
        t.isMoving = !1;
        return;
      }
      t.isMoving && !i.value && (r(h).style.transition = "width .5s", r(T).style.transition = "all .5s", r(v).style.transition = "left .5s", X()), t.isMoving = !1;
    }, $ = () => {
      d.value = !0, a("refresh");
    }, X = () => {
      _.value = !1, i.value = !1, t.left = 0, t.startX = 0, r(v).style.left = 0, r(h) && (r(h).style.width = 0), setTimeout(() => {
        r(T).style.transition = "", r(h).style.transition = "", r(v).style.transition = "";
      }, 500);
    };
    n({ reset: X });
    const F = () => {
      X(), d.value = !1;
      const o = 50, s = M.value.height, u = M.value.width, p = Math.floor(Number(c.width) / 2), B = 25, K = 20, w = p + Math.floor(Math.random() * (p - o - B));
      let g = B + Math.floor(
        Math.random() * (s - o - B - K)
      );
      b.value.setAttribute("width", u), b.value.setAttribute("height", s), b.value.style.display = "block";
      const j = b.value.getContext("2d");
      E(j, w, g, "fill"), L.clipBarx = w, t.imgX = w;
      const m = v.value;
      m.setAttribute("width", u), m.setAttribute("height", s), m.style.display = "block";
      const z = o + 8 * 2 + 3, k = m.getContext("2d");
      k.clearRect(0, 0, u, s), E(k, w, g, "clip"), k.drawImage(M.value, 0, 0, u, s), g = g - 8 * 2 - 1;
      const q = k.getImageData(w, g, z, z);
      m.setAttribute("width", z), m.setAttribute("height", s), k.putImageData(q, 0, g);
    };
    return (o, s) => (S(), C("div", {
      class: x(["puzzle-verify", e.wrapper]),
      style: W(H.value)
    }, [
      d.value ? (S(), C("div", Z, [
        ee,
        l("span", null, I(_.value ? "验证失败，请重试" : "加载中"), 1)
      ])) : D("", !0),
      l("div", te, [
        e.showRefresh && !i.value ? (S(), C("span", {
          key: 0,
          class: "iconfont refresh",
          onClick: s[0] || (s[0] = (u) => $())
        }, "")) : D("", !0),
        l("img", {
          src: e.imgSrc,
          ref_key: "imgRef",
          ref: M,
          onLoad: F
        }, null, 40, se),
        l("canvas", {
          ref_key: "mainCanvasRef",
          ref: b,
          class: "main-canvas"
        }, null, 512),
        l("canvas", {
          ref_key: "moveCanvasRef",
          ref: v,
          class: "move-canvas"
        }, null, 512)
      ]),
      l("div", {
        class: "drag-box",
        onTouchmove: A,
        onTouchcancel: R,
        onMousemove: A,
        onMouseleave: R
      }, [
        l("div", ae, [
          J(I(i.value ? "" : e.tip) + " ", 1),
          i.value ? D("", !0) : (S(), C("div", oe))
        ]),
        l("div", {
          class: x(["progress-bar", { "progress-bar-passed": i.value, "progress-bar-fail": _.value }]),
          ref_key: "progressBarRef",
          ref: h
        }, I(i.value ? e.successTip : ""), 3),
        l("div", {
          class: "drag-bar",
          style: W(O.value),
          ref_key: "dragBarRef",
          ref: T,
          onTouchstart: P,
          onTouchend: R,
          onMousedown: P,
          onMouseup: R
        }, [
          l("span", ne, I(i.value ? "" : ""), 1)
        ], 36)
      ], 32)
    ], 6));
  }
});
const re = (e, n) => {
  const a = e.__vccOpts || e;
  for (const [c, d] of n)
    a[c] = d;
  return a;
}, ue = /* @__PURE__ */ re(ie, [["__scopeId", "data-v-ca601280"]]);
export {
  ue as default
};
