import { useEffect, useRef } from "react";
import { Leva, useControls } from "leva";

// 環境變數
const updateFps = 30;
const showMouse = true;

export default function CanvasParticles57() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef({
    value: 0,
    size: 16,
    burnY: 0.98,
    life: 60,
  });

  useControls(() => ({
    size: {
      value: controlsRef.current.size,
      min: 0,
      max: 32,
      step: 1,
      onChange: (value: number) => {
        controlsRef.current.size = value;
      },
    },
    burnY: {
      value: controlsRef.current.burnY,
      min: 0.9,
      max: 1.2,
      step: 0.01,
      onChange: (value: number) => {
        controlsRef.current.burnY = value;
      },
    },
    life: {
      value: controlsRef.current.life,
      min: 0,
      max: 120,
      step: 1,
      onChange: (value: number) => {
        controlsRef.current.life = value;
      },
    },
  }));

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const canvas: HTMLCanvasElement = canvasElement;

    const controls = controlsRef.current;
    // let time = 0;
    const bgColor = "black";

    // ====================
    // 共用粒子物件
    // ====================
    class Particle {
      // 物件結構
      constructor(options: Record<string, unknown>) {
        // 預設值
        const defaults = {
          p: new Vec2(),
          v: new Vec2(),
          a: new Vec2(),
          color: "#fff",
          life: 0,
          maxLife: controls.life + Math.random() * (controls.life / 2),
          startSize: controls.size,
        };
        // 讓預設值可以改成被傳進來的值，並且給 new 物件
        Object.assign(this, defaults, options);
      }
      p!: Vec2;
      v!: Vec2;
      a!: Vec2;
      color!: string;
      life!: number;
      maxLife!: number;
      startSize!: number;

      // 把物件畫出來的函數
      draw() {
        // t: 粒子的生命週期（進度）
        // 0.00 → 0.25 → 0.50 → 0.75 → 1.00
        const t = this.life / this.maxLife;
        // tColor: 比 t 快兩倍的時間變數，用來控制粒子的顏色
        // 0.00 → 0.50 → 1.00 → 1.00 → 1.00
        const tColor = Math.min(t * 2, 1);
        // tAlpha: t 超過 0.5 時，tAlpha 才開始從 0 變大
        // 0.00 → 0.00 → 0.00 → 0.50 → 1.00
        const tAlpha = Math.max((t - 0.5) / 0.5, 0);
        // 尺寸慢慢變小
        const size = this.startSize * (1 - t);
        // RGB 的 G 變化
        const g = Math.floor(255 * (1 - tColor));
        // 粒子的透明度變化（到後半段才開始變透明）
        const alpha = 1 - tAlpha;

        ctx.save();
        ctx.translate(this.p.x, this.p.y);
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, ${g}, 0, ${alpha})`;
        ctx.fill();
        ctx.restore();
      }

      // 物件更新的函數（物理）
      update() {
        this.p = this.p.add(this.v);
        // 可以控制粒子的加速度（越來越快或越來越慢）
        this.v.y *= controls.burnY;
        // 左右隨機晃
        this.v.x += (Math.random() - 0.5) * 0.1;
        this.life++;
      }

      // 判斷粒子死了沒，後面拿來刪掉已經死的粒子
      isDead() {
        return this.life >= this.maxLife;
      }
    }

    // ====================
    // Vec2 向量工具物件
    // ====================
    class Vec2 {
      x: number;
      y: number;
      constructor(x?: number, y?: number) {
        this.x = x || 0;
        this.y = y || 0;
      }
      set(x: number, y: number) {
        this.x = x;
        this.y = y;
      }
      move(x: number, y: number) {
        this.x += x;
        this.y += y;
      }
      add(v: Vec2) {
        return new Vec2(this.x + v.x, this.y + v.y);
      }
      sub(v: Vec2) {
        return new Vec2(this.x - v.x, this.y - v.y);
      }
      mul(s: number) {
        return new Vec2(this.x * s, this.y * s);
      }
      get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      }
      set length(nv: number) {
        const temp = this.unit.mul(nv);
        this.set(temp.x, temp.y);
      }
      clone() {
        return new Vec2(this.x, this.y);
      }
      toString() {
        return `${this.x}, ${this.y}`;
      }
      equal(v: Vec2) {
        return this.x == v.x && this.y == v.y;
      }
      get angle() {
        return Math.atan2(this.y, this.x);
      }
      get unit() {
        return this.mul(1 / this.length);
      }
    }

    // ====================
    // Canvas 設定
    // ====================
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D & {
      circle: (v: Vec2, r: number) => void;
      line: (v1: Vec2, v2: Vec2) => void;
    };
    if (!ctx) return;

    // 可以快速用的畫圓函數
    ctx.circle = function (v, r) {
      this.arc(v.x, v.y, r, 0, Math.PI * 2);
    };
    // 可以快速用的畫線函數
    ctx.line = function (v1, v2) {
      this.moveTo(v1.x, v1.y);
      this.lineTo(v2.x, v2.y);
    };

    let ww: number;
    let wh: number;

    // canvas 初始化
    function initCanvas() {
      ww = canvas.width = window.innerWidth;
      wh = canvas.height = window.innerHeight;
    }
    initCanvas();

    // 宣告變數，空陣列，讓後面可以塞東西進來
    let particles: Particle[] = [];

    // 邏輯初始化
    function init() {}

    // 遊戲邏輯更新
    function update() {
      // time++;
      // 用 concat 把多個陣列接起來
      particles = particles.concat(
        // 產生指定長度的陣列
        Array.from({ length: 1 }, (d, i) => {
          void d;
          void i;
          // 在這邊生成 new Particle 物件
          return new Particle({
            p: mousePos.clone(),
            v: new Vec2(Math.random() * 4 - 2, -3 - Math.random() * 2),
          });
        }),
      );

      // update 這些 particle 物件
      particles.forEach((p) => p.update());

      // 迴圈，把太小的粒子清掉。（因為會砍東西，倒著迴圈才能都檢查到）
      // for (let i=particles.length-1; i>=0; i--){
      //   if (particles[i].r < 0.1){
      //     particles.splice(i, 1)
      //   }
      // }

      // 只留下沒死的粒子
      particles = particles.filter((p) => !p.isDead());
    }

    // 畫面更新
    let frameId = 0;
    function draw() {
      // 清空背景
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, ww, wh);

      // ====================
      // 在這裡繪製
      particles.forEach((p) => p.draw());
      // ====================

      // 滑鼠（紅十字）
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.circle(mousePos, 3);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.translate(mousePos.x, mousePos.y);
      ctx.strokeStyle = "red";
      const len = 20;
      ctx.line(new Vec2(-len, 0), new Vec2(len, 0));
      ctx.fillText(String(mousePos), 10, -10);
      ctx.rotate(Math.PI / 2);
      ctx.line(new Vec2(-len, 0), new Vec2(len, 0));
      ctx.stroke();
      ctx.restore();

      frameId = requestAnimationFrame(draw);
    }

    // 頁面載入時要做的事的函數
    function loaded() {
      initCanvas();
      init();
      frameId = requestAnimationFrame(draw);
      intervalId = setInterval(update, 1000 / updateFps);
    }

    // 滑鼠事件跟紀錄
    const mousePos = new Vec2(canvas.width / 2, canvas.height / 2);
    let mousePosDown = new Vec2(0, 0);
    let mousePosUp = new Vec2(0, 0);
    void mousePosDown;
    void mousePosUp;

    function mousemove(evt: MouseEvent) {
      mousePos.set(evt.x, evt.y);
      // console.log(mousePos)
    }
    function mouseup(evt: MouseEvent) {
      mousePos.set(evt.x, evt.y);
      mousePosUp = mousePos.clone();
    }
    function mousedown(evt: MouseEvent) {
      mousePos.set(evt.x, evt.y);
      mousePosDown = mousePos.clone();
    }

    // 載入、縮放的事件
    let intervalId: ReturnType<typeof setInterval>;
    window.addEventListener("resize", initCanvas);
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);
    window.addEventListener("mousedown", mousedown);

    loaded();

    void showMouse;

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(intervalId);
      window.removeEventListener("resize", initCanvas);
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
      window.removeEventListener("mousedown", mousedown);
    };
  }, []);

  return (
    <>
      <Leva
        titleBar={{ title: "粒子控制", drag: true, filter: false }}
        collapsed={false}
      />
      <canvas
        ref={canvasRef}
        id="mycanvas"
        className="absolute inset-0 h-full w-full max-w-full"
      />
    </>
  );
}
