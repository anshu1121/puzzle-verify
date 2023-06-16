const PI = Math.PI;

export const draw = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  operation: 'clip' | 'fill' | 'stroke'
) => {
  const l = 50;
  const r = 8;

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
};
