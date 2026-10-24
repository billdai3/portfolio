/**
 * Abstract Clock
 * By Bill Dai
 * 2026-10
 */
let w = window.innerWidth
let h = window.innerHeight
let cx = w/2 // 中心點位置
let cy = h/2 // 中心點位置
let hr, m, s
let ms, preS

function setup() {
	createCanvas(w, h);
	background(100);
	angleMode(DEGREES)
	ms = millis() // 先初始化
	preS = second() // 先初始化
}

function draw() {
	background("black");
	// 0點是0，12點是12
	if (hour() == 12) {
		hr = 12
	}else{
		hr = hour()  %  12
	}
	// 0分是完整的一圈，讓12點整是完整的太陽
	if (minute() == 0) {
		m = 60
	}else{
		m = minute() 
	}
	s = second()

	let angleStart = -90 // 12點鐘方向
	
	//===================================== 
	//  先做每秒轉的角度（希望讓分針跟時針都會轉）
	//===================================== 
	if (s !== preS) { // 當前秒離開前一秒，例：1->2
		ms = millis() // 記下當前的毫秒數，例如500
		preS = s // 把當前秒塞回給前一秒，同步一下，下一秒才會又再進入判斷
	}
	// millis用處，讓毫秒也有度數：例如600-500，等於0.1秒，轉了0.6度
	let angleS = (s + (millis()-ms)/1000) * 6 
	
	//=======
	//  分針
	//=======
	let md = w/20*4 // 跟中心的距離
	let mhOffset = w/20*1 // 跟分針位置偏移的距離
	push()
	for (let i=60; i>0; i--) {
		let angle = i*6 + angleStart
		
		let mhx = cos(angle) * md + cx
		let mhy = sin(angle) * md + cy
		
		let x1 = cos(angleS + angle) * mhOffset + mhx
		let y1 = sin(angleS + angle) * mhOffset + mhy

		let x2 = cos(angleS + 180 + angle) * mhOffset + mhx
		let y2 = sin(angleS + 180 + angle) * mhOffset + mhy

		let mGrad = drawingContext.createLinearGradient(cx, cy, mhx, mhy)
		mGrad.addColorStop(0, "rgba(255, 255, 255, 0.8)");
		mGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

		// noFill()
		strokeJoin(BEVEL)
		strokeWeight(2)
		if (i<=m) {
			stroke("white")
			drawingContext.fillStyle = mGrad;
		}else{
			stroke("rgba(255, 255, 255, 0.2)")
			fill("rgba(255, 255, 255, 0)")
		}
		triangle(x1, y1, x2, y2, cx, cy)
	}
	pop()
	
	//======= 
	//  時針
	//=======
	let hd = w/20*6 // 跟中心的距離
	let hdLg = w // 跟中心的距離（畫面外）
	let hhOffset = w/20*1 // 跟內圈時針位置的偏移
	let hhLgOffset = w // 跟外圈時針位置的偏移
	push()
	for (let i=12; i>0; i--) {
		let angle = i * 30 + angleStart
		// 時針位置
		let hhx = cos(angle) * hd + cx
		let hhy = sin(angle) * hd + cy
		
		let x1 = cos(angleS + angle) * hhOffset + hhx
		let y1 = sin(angleS + angle) * hhOffset + hhy

		let x2 = cos(angleS + 180 + angle) * hhOffset + hhx
		let y2 = sin(angleS + 180 + angle) * hhOffset + hhy

		let hhLgx = cos(angle) * hdLg + cx
		let hhLgy = sin(angle) * hdLg + cy

		let x3 = cos(angleS + angle) * hhLgOffset + hhLgx
		let y3 = sin(angleS + angle) * hhLgOffset + hhLgy

		let x4 = cos(angleS + 180 + angle) * hhLgOffset + hhLgx
		let y4 = sin(angleS + 180 + angle) * hhLgOffset + hhLgy

		let hGrad = drawingContext.createLinearGradient(cx, cy, hhLgx, hhLgy)
		hGrad.addColorStop(0, "rgba(255, 255, 255, 0.6)");
		hGrad.addColorStop(0.6, "rgba(255, 255, 255, 0)");

		strokeJoin(BEVEL)
		strokeWeight(2)
		if (i<=hr){
			stroke("white")
			drawingContext.fillStyle = hGrad;
		}else{
			stroke("rgba(255, 255, 255, 0.2)")
			fill("rgba(255, 255, 255, 0)")
		}
		beginShape()
		vertex(x1, y1)
		vertex(x2, y2)
		vertex(x3, y3)
		vertex(x4, y4)
		endShape(CLOSE)
	}
	pop()
	
	//=======
	//  秒針
	//=======
	// 利用三角函數算出秒球的中心位置
	// 跟中心的距離
	let sd = w/20*5
	let sx = cos(angleStart + angleS) * sd + cx
	let sy = sin(angleStart + angleS) * sd + cy
	
	noStroke()
	fill("white")

	ellipse(sx, sy, w/20*0.2)

	
}

function windowResized() {
	w = window.innerWidth
	h = window.innerHeight
	cx = w/2
	cy = h/2
	resizeCanvas(w, h)
}