let brushW = cw/12*3
let brushH = ch/12
let brushX = -cw/12*1
let clearX = cw/12*0.6
let clearY = ch/12*0.6
let clearSize = brushH/4*3
let brushEY = ch/12*2
let brushPY = ch/12*4
let brushCY = ch/12*6
let brushMY = ch/12*8

function drawBrushes() {
	// 擦布按鈕
	if (
		mouseX > 0 && mouseX < brushX+brushW && 
		mouseY > brushEY && mouseY < brushEY+brushH
	) {
		drawBrushE(-brushX/2) // hover
		if (mouseIsPressed) brush = "eraser" // pressed
	}else{
		switch (brush) {
			case "eraser": drawBrushE(-brushX/2); break // isSelected
			default: drawBrushE(0) // isNotSelected
		}
	}
	// 鉛筆按鈕
	if (
		mouseX > 0 && mouseX < brushX+brushW && 
		mouseY > brushPY && mouseY < brushPY+brushH
	) {
		drawBrushP(-brushX/2) // hover
		if (mouseIsPressed) { // pressed
			brush = "pencil"
			brushColor = colors.pencil[colorIndex.pencil]
			updatePaper()
		}
	}else{
		switch (brush) {
			case "pencil": drawBrushP(-brushX/2); break // isSelected
			default: drawBrushP(0) // isNotSelected
		}
	}
	// 蠟筆按鈕
	if (
		mouseX > 0 && mouseX < brushX+brushW && 
		mouseY > brushCY && mouseY < brushCY+brushH
	) {
		drawBrushC(-brushX/2) // hover
		if (mouseIsPressed) { // pressed
			brush = "crayon"
			brushColor = colors.crayon[colorIndex.crayon]
			updatePaper()
		}
	}else{
		switch (brush) {
			case "crayon": drawBrushC(-brushX/2); break // isSelected
			default: drawBrushC(0) // isNotSelected
		}
	}
	// 麥克筆按鈕
	if (
		mouseX > 0 && mouseX < brushX+brushW && 
		mouseY > brushMY && mouseY < brushMY+brushH
	) {
		drawBrushM(-brushX/2) // hover
		if (mouseIsPressed) { // pressed
			brush = "marker"
			brushColor = colors.marker[colorIndex.marker]
			updatePaper()
		}
	}else{
		switch (brush) {
			case "marker": drawBrushM(-brushX/2); break // isSelected
			default: drawBrushM(0) // isNotSelected
		}
	}
	// 清除按鈕
	if (
		mouseX > clearX && mouseX < clearX+clearSize && 
		mouseY > clearY && mouseY < clearY+clearSize
	) {
		if (mouseIsPressed) brush = "clear"
	}
	drawClearBtn()
}
// 清除按鈕圖像
function drawClearBtn() {
	let x = clearX
	let y = clearY
	let size = clearSize
	text("🔄", x+size/2, y+size/2)
	textSize(size)
	textAlign(CENTER, CENTER)
}
// 麥克筆圖像
function drawBrushM(offset) {
	let c = color(colors.marker[colorIndex.marker])
	let darker = lerpColor(c, color("black"), 0.5)
	let x = brushX
	let y = brushMY
	let w = brushW
	let h = brushH
	noStroke() 
	fill("#EEEEEE") // 畫筆身
	rect(x+offset, y, w/10*4, h)
	fill("#AAAAAA") // 畫筆頭塑膠段
	beginShape()
	vertex(x+offset+w/10*4, y)
	vertex(x+offset+w/10*6, y+h/10*3)
	vertex(x+offset+w/10*6, y+h/10*7)
	vertex(x+offset+w/10*4, y+h)
	endShape(CLOSE)
	rect(x+offset+w/10*5, y+h/10*3, w/10*2.5, h/10*4)
	fill(darker) // 畫筆頭毛筆段
	beginShape()
	bezierVertex(x+offset+w/10*7.5, y+h/10*3.5)
	bezierVertex(x+offset+w/10*8.5, y+h/10*3.5)
	bezierVertex(x+offset+w/10*8.5, y+h/10*3.5)
	bezierVertex(x+offset+w/10*10, y+h/10*5)
	bezierVertex(x+offset+w/10*8.5, y+h/10*6.5)
	bezierVertex(x+offset+w/10*8.5, y+h/10*6.5)
	bezierVertex(x+offset+w/10*7.5, y+h/10*6.5)
	endShape(CLOSE)
}
// 蠟筆圖像
function drawBrushC(offset) {
	let c = color(colors.crayon[colorIndex.crayon])
	let lighter = lerpColor(c, color("white"), 0.3)
	let darker = lerpColor(c, color("black"), 0.1)
	let dark = lerpColor(c, color("black"), 0.8)
	let x = brushX
	let y = brushCY
	let w = brushW
	let h = brushH
	noStroke() 
	fill(lighter) // 畫筆身
	rect(x+offset, y, w/5*3, h)
	fill(dark) // 畫筆身上的線條
	rect(x+offset+w/20*8, y, w/20*1.5, h)
	rect(x+offset+w/20*6, y, w/20*1.5, h)
	fill(c) // 畫筆頭前一段
	rect(
		x+offset+w/10*6, y+h/20, 
		w/10, h/20*18
	)
	fill(darker) // 畫陰影
	rect(x+offset+w/10*6, y+h/20, 2, h/20*18)
	rect(x+offset+w/10*7-2, y+h/20, 2, h/20*18)
	fill(c) // 畫筆頭
	beginShape()
	vertex(x+offset+w/10*7, y+h/20*2)
	vertex(x+offset+w/10*10, y+h/20*8)
	vertex(x+offset+w/10*10, y+h/20*12)
	vertex(x+offset+w/10*7, y+h/20*18)
	endShape(CLOSE)
}
// 鉛筆圖像
function drawBrushP(offset) {
	let c = color(colors.pencil[colorIndex.pencil])
	let lighter = lerpColor(c, color("white"), 0.5)
	let darker = lerpColor(c, color("black"), 0.2)
	let x = brushX
	let y = brushPY
	let w = brushW
	let h = brushH
	noStroke()
	fill(c) // 畫筆頭
	rect(x+offset+w/5*4.5, y+h/5*2, w/5*0.5, h/5*1)
	fill("#D4A373") // 畫木頭
	beginShape()
	vertex(x+offset+w/5*3, y)
	vertex(x+offset+w/5*4.5, y+h/5*2)
	vertex(x+offset+w/5*4.5, y+h/5*3)
	vertex(x+offset+w/5*3, y+h)
	endShape(CLOSE)
	fill(lighter) // 畫筆身亮部
	rect(x+offset, y, w/5*3, h/4*2)
	fill(darker) // 畫筆身暗部
	rect(x+offset, y+h/4*2, w/5*3, h/4*2)
	fill(c) // 畫筆身中間調
	rect(x+offset, y+h/4*1, w/5*3, h/4*2)
}
// 擦布圖像
function drawBrushE(offset) {
	let x = brushX
	let y = brushEY
	let w = brushW
	let h = brushH 
	noStroke()
	fill("white") // 畫擦布本體
	rect(x+offset, y, w, h, 0, w/10, w/10, 0)
	fill("#003DA5") // 畫擦布包裝
	rect(x+offset, y, w/4*3, h/3)
	fill("#1A1A1A")
	rect(x+offset, y+h/3*2, w/4*3, h/3)
	fill("#BABABA")
	rect(x+offset+w/4*3, y, 1, h)
}