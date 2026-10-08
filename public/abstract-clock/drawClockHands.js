function drawMh(clr, wght, isCurrent) {
	for (let i=60; i>0; i--) {
		let angle = i*6 + angleStart
		
		let mhx = cos(angle) * md + cx
		let mhy = sin(angle) * md + cy
		
		let x1 = cos(angleS + angle) * mhOffset + mhx
		let y1 = sin(angleS + angle) * mhOffset + mhy

		let x2 = cos(angleS + 180 + angle) * mhOffset + mhx
		let y2 = sin(angleS + 180 + angle) * mhOffset + mhy

		noFill()
		strokeJoin(ROUND)

		if (isCurrent) {
			if (i<=m) {
				stroke(clr)
				strokeWeight(wght)
				triangle(x1, y1, x2, y2, cx, cy)
			}
		}else {
			if (i>m) {
				stroke(clr)
				strokeWeight(wght)
				triangle(x1, y1, x2, y2, cx, cy)
			}
		}
	}
}

function drawHh(clr, wght, isCurrent) {
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

		noFill()
		strokeJoin(ROUND)

		if (isCurrent) {
			if (i<=hr){
				stroke(clr)
				strokeWeight(wght)
				beginShape()
				vertex(x1, y1)
				vertex(x2, y2)
				vertex(x3, y3)
				vertex(x4, y4)
				endShape(CLOSE)
			}
		}else{
			if (i>hr){
				stroke(clr)
				strokeWeight(wght)
				beginShape()
				vertex(x1, y1)
				vertex(x2, y2)
				vertex(x3, y3)
				vertex(x4, y4)
				endShape(CLOSE)
			}
		}
	}
}
