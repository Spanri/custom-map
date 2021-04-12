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
		this._el.appendChild(canvas)
		this._ctx = canvas.getContext("2d")

		const pluginElement = document.createElement("div")
		pluginElement.classList.add("cm-plugin")
		this._el.appendChild(pluginElement)

		this.setPlugins(plugins)

		handleDrag(this._el, this.drawTiles)

		if (hooks && hooks.afterInit) {
			hooks.afterInit(this)
		}
	}

	load() {
		this.handleCenter()
		this.drawTiles()
	}

	drawTiles() {
		this._ctx!.clearRect(0, 0, this._minZoomTileSize * this._xCount, this._minZoomTileSize * this._yCount)

		if (this._tileUrl) {
			console.log({ visibleTiles: this.visibleTiles })
			for (let y = this.visibleTiles.yMin; y <= this.visibleTiles.yMax; y++) {
				for (let x = this.visibleTiles.xMin; x <= this.visibleTiles.xMax; x++) {
					console.log("x=" + x + " y=" + y)
					const tileImage = new Image()
					tileImage.onload = () => {
						this._ctx!.drawImage(
							tileImage,
							this.currentTileSize * x,
							this.currentTileSize * y,
							this.currentTileSize - 3,
							this.currentTileSize - 3
						)
						this._ctx!.fill()
					}
					tileImage.src = this._tileUrl!(this._zoom, y, x)
				}
			}
		}
	}

	handleCenter() {
		this._el.scrollLeft = this._center[0] * this.currentTileSize - this.elRect.width / 2
		this._el.scrollTop = this._center[1] * this.currentTileSize - this.elRect.width / 2
	}

	get elRect(): DOMRect {
		const rect = this._el.getBoundingClientRect()

		const cs = getComputedStyle(this._el)
		const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
		const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
		const borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth)
		const borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth)

		return {
			...rect,
			width: this._el.offsetWidth - paddingX - borderX,
			height: this._el.offsetHeight - paddingY - borderY
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
			xMin: Math.floor(this._el.scrollLeft / this.currentTileSize),
			xMax: Math.floor((this._el.scrollLeft + this.elRect.width - 1) / this.currentTileSize),
			yMin: Math.floor(this._el.scrollTop / this.currentTileSize),
			yMax: Math.floor((this._el.scrollTop + this.elRect.height - 1) / this.currentTileSize)
		}
	}

	setHooks(hooks: Hooks) {
		this._hooks = hooks
	}

	setPlugins(plugins?: {}[]) {
		if (plugins && plugins.length) {
			plugins.forEach(plugin => {
				Object.entries(plugin).forEach(([key, value]: [string, any]) => {
					;(this as any)[key] = value
				})
			})

			console.log(this)
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
