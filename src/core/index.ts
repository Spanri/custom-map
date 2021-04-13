import { InitialData, VisibleTiles, Hooks } from "./index.d"
import { handleDrag } from "./touchDrag.helper"

export default class Core {
	public _el: HTMLElement
	public _ctx: CanvasRenderingContext2D | null = null
	public _center: number[]
	public _zoom: number
	public _minZoom: number
	public _maxZoom: number
	public _tileUrl: ((z: number, y: number, x: number) => string) | null = null
	public _minZoomTileSize: number
	public _xCount: number
	public _yCount: number
	public _hooks: Hooks

	constructor(el: HTMLElement, { center, zoom, minZoom, maxZoom, tileUrl, xCount, yCount, minZoomTileSize, hooks, plugins }: InitialData) {
		this._el = el
		this._zoom = zoom || 0
		this._minZoom = minZoom || 0
		this._maxZoom = maxZoom || 5
		this._tileUrl = tileUrl || null
		this._minZoomTileSize = minZoomTileSize || 200
		this._xCount = xCount || 2
		this._yCount = yCount || 2
		this._center = center || [this._xCount / 2, this._yCount / 2]
		this._hooks = hooks || {}

		const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement("CANVAS")
		canvas.width = 400
		canvas.height = 400
		canvas.classList.add("cm-canvas")

		const canvasWrapperElement = document.createElement("div")
		canvasWrapperElement.classList.add("cm-canvas-wrapper")
		canvasWrapperElement.appendChild(canvas)

		this._el.appendChild(canvasWrapperElement)
		this._ctx = canvas.getContext("2d")

		const pluginElement = document.createElement("div")
		pluginElement.classList.add("cm-plugin")
		this._el.appendChild(pluginElement)
		this.setPlugins(plugins)

		handleDrag(canvasWrapperElement, this.drawTiles, this)

		if (this._hooks && this._hooks.afterInit) {
			this._hooks.afterInit(this)
		}
	}

	load() {
		this.handleCenter()
		this.drawTiles()
	}

	drawTiles(self: any = this) {
		self._ctx!.clearRect(0, 0, self._minZoomTileSize * self._xCount, self._minZoomTileSize * self._yCount)

		console.log({ visibleTiles: self.visibleTiles })

		if (self._tileUrl) {
			for (let y = self.visibleTiles.yMin; y <= self.visibleTiles.yMax; y++) {
				for (let x = self.visibleTiles.xMin; x <= self.visibleTiles.xMax; x++) {
					console.log("x=" + x + " y=" + y)
					const tileImage = new Image()
					tileImage.onload = () => {
						self._ctx!.drawImage(
							tileImage,
							self.currentTileSize * x,
							self.currentTileSize * y,
							self.currentTileSize - 3,
							self.currentTileSize - 3
						)
						self._ctx!.fill()
					}
					tileImage.src = self._tileUrl!(self._zoom, y, x)
				}
			}
		}
	}

	handleCenter() {
		this.elCanvasWrapper.scrollLeft = this._center[0] * this.currentTileSize - this.elRect.width / 2
		this.elCanvasWrapper.scrollTop = this._center[1] * this.currentTileSize - this.elRect.width / 2
	}

	get elCanvasWrapper(): HTMLElement {
		return <HTMLCanvasElement>this._el.getElementsByClassName("cm-canvas-wrapper")[0]
	}

	get elRect(): DOMRect {
		const rect = this.elCanvasWrapper.getBoundingClientRect()

		const cs = getComputedStyle(this.elCanvasWrapper)
		const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
		const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
		const borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth)
		const borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth)

		return {
			...rect,
			width: this.elCanvasWrapper.offsetWidth - paddingX - borderX,
			height: this.elCanvasWrapper.offsetHeight - paddingY - borderY
		}
	}

	get currentTileSize(): number {
		if (this._minZoom == 0) {
			return this._minZoomTileSize / ((this._zoom + 1) / (this._minZoom + 1))
		} else {
			return this._minZoomTileSize / (this._zoom / this._minZoom)
		}
	}

	get visibleTiles(): VisibleTiles {
		return {
			xMin: Math.floor(this.elCanvasWrapper.scrollLeft / this.currentTileSize),
			xMax: Math.min(Math.floor((this.elCanvasWrapper.scrollLeft + this.elRect.width - 1) / this.currentTileSize), this._xCount - 1),
			yMin: Math.floor(this.elCanvasWrapper.scrollTop / this.currentTileSize),
			yMax: Math.min(Math.floor((this.elCanvasWrapper.scrollTop + this.elRect.height - 1) / this.currentTileSize), this._yCount - 1)
		}
	}

	setHooks(hooks: Hooks) {
		this._hooks = hooks
	}

	setPlugins(plugins?: {}[]) {
		if (plugins && plugins.length) {
			plugins.forEach(plugin => {
				Object.entries(plugin).forEach(([key, value]: [string, any]) => {
					;(this as any)["_" + key] = value
				})
			})
		}
	}

	setTileUrl(func: Core["_tileUrl"]) {
		this._tileUrl = func
	}

	setCenter([x, y]: number[]) {
		this._center = [x, y]

		if (this._hooks && this._hooks.afterCenter) {
			this._hooks.afterCenter(this)
		}
	}

	setZoom(zoom: number) {
		this._zoom = zoom
		this.drawTiles()

		if (this._hooks && this._hooks.afterZoom) {
			this._hooks.afterZoom(this)
		}
	}
}
