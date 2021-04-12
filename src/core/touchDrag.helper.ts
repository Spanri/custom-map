let diffx = 0
let diffy = 0
let startx = 0
let starty = 0
let isDragging = false

function onMouseDown(event: any, el: HTMLElement) {
	if (!event) event = window.event

	if (event.target && event.target.nodeName === "IMG") {
		event.preventDefault()
	} else if (event.srcElement && event.srcElement.nodeName === "IMG") {
		event.returnValue = false
	}
	startx = event.clientX + el.scrollLeft
	starty = event.clientY + el.scrollTop
	diffx = 0
	diffy = 0
	isDragging = true
}

function onMouseMove(event: any, el: HTMLElement, callback: () => void) {
	if (!isDragging) return

	if (!event) event = window.event

	diffx = startx - (event.clientX + el.scrollLeft)
	diffy = starty - (event.clientY + el.scrollTop)
	el.scrollLeft += diffx
	el.scrollTop += diffy

	callback()
}

function onMouseUp(event: any, el: HTMLElement) {
	if (!event) event = window.event
	isDragging = false
}

function addEvent(name: string, el: any, func: (event: any) => void) {
	if (el.addEventListener) {
		el.addEventListener(name, func, false)
	} else if (el.attachEvent) {
		el.attachEvent("on" + name, func)
	} else {
		el[name] = func
	}
}

export function handleDrag(el: HTMLElement, callback: () => void) {
	addEvent("mousedown", el, (event: any) => onMouseDown(event, el))
	addEvent("mousemove", el, (event: any) => onMouseMove(event, el, callback))
	addEvent("mouseup", el, (event: any) => onMouseUp(event, el))
	addEvent("mouseup", window, (event: any) => onMouseUp(event, el))
}
