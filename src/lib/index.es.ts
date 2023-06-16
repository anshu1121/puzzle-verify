import { defineComponent as G, ref as c, computed as P, reactive as A, unref as n, openBlock as M, createElementBlock as R, normalizeClass as N, normalizeStyle as V, createElementVNode as i, toDisplayString as S, createCommentVNode as z, createTextVNode as J, pushScopeId as Q, popScopeId as U } from "vue";
const h = Math.PI, W = (e, o, s, f) => {
  e.beginPath(), e.moveTo(o, s), e.arc(o + 50 / 2, s - 8 + 2, 8, 0.72 * h, 2.26 * h), e.lineTo(o + 50, s), e.arc(o + 50 + 8 - 2, s + 50 / 2, 8, 1.21 * h, 2.78 * h), e.lineTo(o + 50, s + 50), e.lineTo(o, s + 50), e.arc(o + 8 - 2, s + 50 / 2, 8 + 0.4, 2.76 * h, 1.24 * h, !0), e.lineTo(o, s), e.lineWidth = 0, e.fillStyle = "rgba(255, 255, 255, .85)", e.strokeStyle = "rgba(255, 255, 255, .8)", e.stroke(), e[f](), e.globalCompositeOperation = "destination-over";
}, Y = (e) => (Q("data-v-713f0316"), e = e(), U(), e), Z = {
  key: 0,
  class: "iconfont mask"
}, ee = /* @__PURE__ */ Y(() => /* @__PURE__ */ i("div", { class: "rotate" }, "", -1)), te = { class: "img-box" }, se = ["src"], ae = { class: "tip-text" }, oe = {
  key: 0,
  class: "light"
}, le = { class: "iconfont arrow" }, ie = {
  name: "PuzzleVerify"
}, re = /* @__PURE__ */ G({
  ...ie,
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
  setup(e, { expose: o, emit: s }) {
    const f = e, u = c(!1), m = c(!1), E = P(() => ({ width: `${f.width}px` })), y = c(), d = c(), H = A({
      isOk: !1,
      isKeep: !1,
      clipBarx: 0
    }), k = c(), v = c(), r = c(!1), C = c(), t = A({
      left: 0,
      startX: 0,
      isMoving: !1,
      imgX: 0
    }), L = P(() => ({ left: `${n(t.left)}px` })), O = (l) => {
      r.value || (t.startX = l.x, t.isMoving = !0);
    }, $ = (l) => {
      if (t.isMoving) {
        const a = l.x - t.startX;
        t.left = a, d.value.style.left = a + "px", v.value.style.width = 40 + a + "px";
      }
    }, T = (l) => {
      if (l.type === "mouseup" && (Math.abs(t.imgX - t.left) < f.diffDistance ? (r.value = !0, s("success", { moveDistance: t.left, pointX: t.imgX })) : (f.autoRefresh && (u.value = !0), m.value = !0, s("fail", { moveDistance: t.left, pointX: t.imgX }))), l.type === "mouseup" && f.autoRefresh) {
        t.isMoving = !1;
        return;
      }
      t.isMoving && !r.value && (n(v).style.transition = "width .5s", n(C).style.transition = "all .5s", n(d).style.transition = "left .5s", I()), t.isMoving = !1;
    }, x = () => {
      u.value = !0, s("refresh");
    }, I = () => {
      m.value = !1, r.value = !1, t.left = 0, t.startX = 0, n(d).style.left = 0, n(v) && (n(v).style.width = 0), setTimeout(() => {
        n(C).style.transition = "", n(v).style.transition = "", n(d).style.transition = "";
      }, 500);
    };
    o({ reset: I });
    const F = () => {
      I(), u.value = !1;
      const l = 50, a = k.value.height, _ = k.value.width, D = Math.floor(Number(f.width) / 2), B = 25, K = 20, b = D + Math.floor(Math.random() * (D - l - B));
      let p = B + Math.floor(
        Math.random() * (a - l - B - K)
      );
      y.value.setAttribute("width", _), y.value.setAttribute("height", a), y.value.style.display = "block";
      const j = y.value.getContext("2d");
      W(j, b, p, "fill"), H.clipBarx = b, t.imgX = b;
      const g = d.value;
      g.setAttribute("width", _), g.setAttribute("height", a), g.style.display = "block";
      const X = l + 8 * 2 + 3, w = g.getContext("2d");
      w.clearRect(0, 0, _, a), W(w, b, p, "clip"), w.drawImage(k.value, 0, 0, _, a), p = p - 8 * 2 - 1;
      const q = w.getImageData(b, p, X, X);
      g.setAttribute("width", X), g.setAttribute("height", a), w.putImageData(q, 0, p);
    };
    return (l, a) => (M(), R("div", {
      class: N(["puzzle-verify", e.wrapper]),
      style: V(E.value)
    }, [
      u.value ? (M(), R("div", Z, [
        ee,
        i("span", null, S(m.value ? "验证失败，请重试" : "加载中"), 1)
      ])) : z("", !0),
      i("div", te, [
        e.showRefresh && !r.value ? (M(), R("span", {
          key: 0,
          class: "iconfont refresh",
          onClick: a[0] || (a[0] = (_) => x())
        }, "")) : z("", !0),
        i("img", {
          src: e.imgSrc,
          ref_key: "imgRef",
          ref: k,
          onLoad: F
        }, null, 40, se),
        i("canvas", {
          ref_key: "mainCanvasRef",
          ref: y,
          class: "main-canvas"
        }, null, 512),
        i("canvas", {
          ref_key: "moveCanvasRef",
          ref: d,
          class: "move-canvas"
        }, null, 512)
      ]),
      i("div", {
        class: "drag-box",
        onMousemove: $,
        onMouseleave: T
      }, [
        i("div", ae, [
          J(S(r.value ? "" : e.tip) + " ", 1),
          r.value ? z("", !0) : (M(), R("div", oe))
        ]),
        i("div", {
          class: N(["progress-bar", { "progress-bar-passed": r.value, "progress-bar-fail": m.value }]),
          ref_key: "progressBarRef",
          ref: v
        }, S(r.value ? e.successTip : ""), 3),
        i("div", {
          class: "drag-bar",
          style: V(L.value),
          ref_key: "dragBarRef",
          ref: C,
          onMousedown: O,
          onMouseup: T
        }, [
          i("span", le, S(r.value ? "" : ""), 1)
        ], 36)
      ], 32)
    ], 6));
  }
});
const ne = (e, o) => {
  const s = e.__vccOpts || e;
  for (const [f, u] of o)
    s[f] = u;
  return s;
}, ce = /* @__PURE__ */ ne(re, [["__scopeId", "data-v-713f0316"]]);
export {
  ce as default
};
