function updatePaper() {
	switch(brush) {
		case "pencil": drawPaperP(); break
		case "crayon": drawPaperC(); break
		case "marker": drawPaperM()
	}
}

function drawPaperP() {
	paper.background("#C5AC90")
	
	let steps = cw/0.5
	
	for (let i=0; i<steps; i++) {
		let c = color("#7A6A58")
		c.setAlpha(50)		
		paper.stroke(c)
		paper.noFill()
		let w = cw/12*9
		let h = ch/12*9
		let start = random(360)
		let stop = start + random(30, 180)
		let deg = random(360)
		let textureX = random(w)
		let textureY = random(h)
		let textureW = random(w)/20
		let textureH = random(h)/20

		paper.push()
		paper.arc(
			textureX, textureY, textureW, textureH,
			start, stop
		)
		paper.rotate(deg)
		paper.pop()
	}
}

function drawPaperC() {
	paper.background("#3F4345")
	let c = color("#272A2B")
	c.setAlpha(50)	
	paper.strokeWeight(2)
	paper.stroke(c)

	let w = cw/12*9
	let h = ch/12*9
	let gap = 10
	let stepX = w / gap // 橫軸的點數量
	let stepY = h / gap // 縱軸的點數量
	for (let i=0; i<stepX; i++) {
		for (let j=0; j<stepY; j++) {
			paper.line(i*gap, j*gap, i*gap-6, j*gap+6)
		}
	}
}

function drawPaperM() {
	paper.background("#F5F5F5")
}