/**
 * Custom Brushes: Pencil, Crayon & Marker
 * By Bill Dai
 * 2026-10
 */
let cw = 800 // canvasWidth
let ch = cw // canvasHeight
let brushLayer // drawingCanvas
let brush
let brushColor
let paper // backgroundCanvas
let r = cw/40
let maxR = r*2
let minR = r/2
let oldR = minR

let oldX, oldY // 前一影格位置
let stepX, stepY // 補間位置

function setup() {
	createCanvas(cw, ch);
	background("#A0937D");
	brushLayer = createGraphics(cw/12*9, ch/12*9)
	brush = "pencil"
	brushColor = colors.pencil[0]
	paper = createGraphics(cw/12*9, ch/12*9)
	updatePaper()
	angleMode(DEGREES)
}

function mousePressed() {
	// 先把這些位置初始化
	oldX = mouseX
	oldY = mouseY
	stepX = mouseX
	setpY = mouseY
}

function draw() {
	background("#A0937D")
	if (mouseIsPressed) {
		// 存滑鼠新舊位置之間的距離
		let d = dist(oldX, oldY, mouseX, mouseY)
		// 存補間數量 (距離/2px)=補幾個點
		let steps = max(floor(d/2), 1)
		// 把距離映射成粗細，距離近就粗，距離遠就細
		let mapR = map(d, 0, 10, maxR, minR)
		// 將粗細限制在最大最小之間
		let conR = constrain(mapR, minR, maxR)
		// 將粗細更接近前一影格的粗細（平滑化）
		conR = lerp(oldR, conR, 0.1)
		
		// 遍歷數量，把每個要補的點位置做出來
		for (let i=0; i<=steps; i++) {
			stepX = lerp(oldX, mouseX, i/steps)
			stepY = lerp(oldY, mouseY, i/steps)
			// 麥克筆用「移動會影響粗細」的conR，其他筆刷用原本的r
			if (brush == "marker") {
				drawStamp(brushLayer, stepX-cw/4, stepY, conR)
			}else{
				drawStamp(brushLayer, stepX-cw/4, stepY, r)
			}
		}
		// 存這一影格的粗細
		oldR = conR
		// print(brushColor)
	}
	oldX = mouseX // 存這一影格位置
	oldY = mouseY

	drawBrushes()
	drawColors()
	
	image(paper, cw/12*3, 0)
	image(brushLayer, cw/12*3, 0)
}

