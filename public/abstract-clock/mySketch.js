/**
 * Abstract Clock
 * By Bill Dai
 * 2026-10
 */
let w = 600
let h = w
let cx = w / 2 // 中心點位置
let cy = h / 2 // 中心點位置
let hr, m, s
let ms, preS
let t

function syncSize() {
	w = window.innerWidth
	h = window.innerHeight
	cx = w / 2
	cy = h / 2
}

function setup() {
	syncSize()
	createCanvas(w, h)
	background(100)
	angleMode(DEGREES)
	ms = millis() // 先初始化
	preS = second() // 先初始化
}

function windowResized() {
	syncSize()
	resizeCanvas(w, h)
}

function draw() {
	background("black")
	t = frameCount / 100
	hr = hour() % 12
	m = minute()
	s = second()

	let angleStart = -90 // 12點鐘方向

	//=====================================
	//  先做每秒轉的角度（希望讓分針跟時針都會轉）
	//=====================================
	if (s !== preS) {
		// 當前秒離開前一秒，例：1->2
		ms = millis() // 記下當前的毫秒數，例如500
		preS = s // 把當前秒塞回給前一秒，同步一下，下一秒才會又再進入判斷
	}
	// millis用處，讓毫秒也有度數：例如600-500，等於0.1秒，轉了0.6度
	let angleS = (s + (millis() - ms) / 1000) * 6

	//=======
	//  時針
	//=======
	let hd = (w / 20) * 5 // 跟中心的距離
	let hdLg = w // 跟中心的距離（畫面外）
	let hhOffset = w / 20 // 跟內圈時針位置的偏移
	let hhLgOffset = w // 跟外圈時針位置的偏移
	for (let i = 0; i < 12; i++) {
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

		noFill()
		if (i <= hr) {
			stroke("white")
		} else {
			stroke("dimGray")
		}
		strokeWeight(2)
		beginShape()
		vertex(x1, y1)
		vertex(x2, y2)
		vertex(x3, y3)
		vertex(x4, y4)
		endShape(CLOSE)
	}

	//=======
	//  分針
	//=======
	let md = w / 5 // 跟中心的距離
	let mhOffset = w / 30 // 跟分針位置偏移的距離
	for (let i = 0; i < 60; i++) {
		let angle = i * 6 + angleStart

		let mhx = cos(angle) * md + cx
		let mhy = sin(angle) * md + cy

		let x1 = cos(angleS + angle) * mhOffset + mhx
		let y1 = sin(angleS + angle) * mhOffset + mhy

		let x2 = cos(angleS + 180 + angle) * mhOffset + mhx
		let y2 = sin(angleS + 180 + angle) * mhOffset + mhy

		noFill()
		strokeJoin(BEVEL)
		if (i <= m) {
			stroke("white")
		} else {
			stroke("dimGray")
		}
		strokeWeight(2)
		triangle(x1, y1, x2, y2, cx, cy)
	}

	//=======
	//  秒針
	//=======
	// 利用三角函數算出秒球的中心位置
	let sd = w / 4 // 跟中心的距離
	let sx = cos(angleStart + angleS) * sd + cx
	let sy = sin(angleStart + angleS) * sd + cy
	noStroke()
	fill("white")
	ellipse(sx, sy, 15)
}
