function drawStamp(g, x, y, r) {
	switch(brush) {
		case "marker": drawStampM(g, x, y, r); break
		case "pencil": drawStampP(g, x, y, r); break
		case "crayon": drawStampC(g, x, y, r); break
		case "eraser": drawStampE(g, x, y, r); break
		case "clear": g.clear(); break
	}
}

// 鉛筆筆刷頭
function drawStampP(g, x, y, r) {
	g.fill(brushColor)
	g.noStroke()
	let pr = r/2 // 讓鉛筆頭小一點
	
	for (let i=0; i<100; i++) {
		// 隨機地在筆刷大小內撒點
		let textureX = random(pr) - pr/2 + x
		let textureY = random(pr) - pr/2 + y
		let textureSize = random(pr)/20
		g.ellipse(textureX, textureY, textureSize/2, textureSize)
	}
}

// 蠟筆筆刷頭
function drawStampC(g, x, y, r) {
	let c = color(brushColor)
	c.setAlpha(80)
	g.stroke(c)
	let cr = r/2
	
	for (let angle=0; angle<360; angle+=5) {
		// 要先開根號才能平均分布
		let radius = sqrt(random()) * cr
		let offset = sqrt(random())
		let textureX = cos(angle) * radius + x
		let textureY = sin(angle) * radius + y
		// ellipse(textureX, textureY, r/50, r/50)
		g.line(
			textureX, textureY, 
			textureX+offset, textureY+offset
		)
	}	
}

// 麥克筆刷頭
function drawStampM(g, x, y, r) {
	let c = color(brushColor)
	c.setAlpha(10)
	g.fill(c)
	g.noStroke()
	g.beginShape()
	// 利用三角函數畫筆頭
	for (let angle=0; angle<360; angle+=1) {
		let t = frameCount*0.1
		// 利用 noise 做不規則半徑
		let radius = r * (noise(angle+t)/2+0.5)
		let vx = x + cos(angle) * radius
		let vy = y + sin(angle) * radius
		g.vertex(vx,vy)
	}
	g.endShape()
}

// 橡皮擦
function drawStampE(g, x, y, r) {
	g.erase()
	g.circle(x, y, r)
	g.noErase()
}

