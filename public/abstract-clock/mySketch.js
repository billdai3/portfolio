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
let angleStart, angleS
let md, mhOffset
let hd, hdLg, hhOffset, hhLgOffset
let clr_blue = "#1B1464"
let clr_purple = "#8D236B"
let clr_pink = "#FF3272"
let clr_orange = "#FF9A1F"
let clr_yellow = "#FFFF23"

function setup() {
	createCanvas(w, h);
	background(100);
	angleMode(DEGREES)
	ms = millis() // 先初始化
	preS = second() // 先初始化
}

function draw() {
	background(clr_blue);
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

	angleStart = -90 // 12點鐘方向
	
	//===================================== 
	//  先做每秒轉的角度（希望讓分針跟時針都會轉）
	//===================================== 
	if (s !== preS) { // 當前秒離開前一秒，例：1->2
		ms = millis() // 記下當前的毫秒數，例如500
		preS = s // 把當前秒塞回給前一秒，同步一下，下一秒才會又再進入判斷
	}
	// millis用處，讓毫秒也有度數：例如600-500，等於0.1秒，轉了0.6度
	angleS = (s + (millis()-ms)/1000) * 6 
	

	//=======
	//  畫指針
	//=======
	md = w/20*4 // 跟中心的距離
	mhOffset = w/20 // 跟分針位置偏移的距離
	
	hd = w/20*5 // 跟中心的距離
	hdLg = w // 跟中心的距離（畫面外）
	hhOffset = w/20 // 跟內圈時針位置的偏移
	hhLgOffset = w // 跟外圈時針位置的偏移
	
	drawMh(clr_purple, 5, false)	
	drawHh(clr_purple, 5, false)
	
	drawMh(clr_pink, 15, true)
	drawHh(clr_pink, 15, true)

	drawMh(clr_orange, 7, true)
	drawHh(clr_orange, 7, true)
	
	drawMh(clr_yellow, 3, true)
	drawHh(clr_yellow, 3, true)
	
}

function windowResized() {
	w = window.innerWidth
	h = window.innerHeight
	cx = w/2
	cy = h/2
	resizeCanvas(w, h)
}
