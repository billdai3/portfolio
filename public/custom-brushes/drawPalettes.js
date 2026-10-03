let colorX = cw/20
let colorY = ch/6*5
let colors = {
	pencil: [
		"#F3EF6F",
		"#FFD530",
		"#EF4650",
		"#CD3F5C",
		"#0B7DC2",
		"#506DB4",
		"#FCBC5F",
		"#895A47",
		"#3E4A5B",
		"#FFFFFF",
	],
	crayon: [
		"#FBE870",
		"#FF8833",
		"#ED0A3F",
		"#F653A6",
		"#0066FF",
		"#732E6C",
		"#01A368",
		"#AF593E",
		"#000000",
		"#FFFFFF",
	],
	marker: [
		"#FEE96C",
		"#FEC369",
		"#F15062",
		"#FDF3EA",
		"#0177C1",
		"#8754A1",
		"#14B37D",
		"#C1CCD2",
		"#634C3C",
		"#FFFFFF",
	]
}

let colorIndex = {
	pencil: 0,
	crayon: 0,
	marker: 0,
}

function drawColors() {
	stroke(0, 0, 0, 50)
	
	for (let i=0; i<10; i+=1){
		switch (brush) {
			case "pencil": fill(colors.pencil[i]); break
			case "crayon": fill(colors.crayon[i]); break
			case "marker": fill(colors.marker[i]); break
			default: noFill()
		}

		rect(
			colorX + i*2*cw/21, colorY, cw/20, cw/20,
			cw/80, cw/80, cw/80, cw/80 // 圓角
		)

		if (
			mouseX > colorX + i*2*cw/21 && 
			mouseX < colorX + i*2*cw/21 + cw/20 &&
			mouseY > colorY && 
			mouseY < colorY + cw/20 &&
			mouseIsPressed
		) {
			switch (brush) {
				case "pencil":
					brushColor = colors.pencil[i]
					colorIndex.pencil = i
					break
				case "crayon":
					brushColor = colors.crayon[i]
					colorIndex.crayon = i
					break
				case "marker":
					brushColor = colors.marker[i]
					colorIndex.marker = i
					break
			}
			// print(colorIndex)
		}
	}
}