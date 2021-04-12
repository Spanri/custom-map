export interface Hooks {
	afterInit?: (self: any) => {}
	afterZoom?: (self: any) => {}
	afterCenter?: (self: any) => {}
}

export interface VisibleTiles {
	xMin: number
	xMax: number
	yMin: number
	yMax: number
}

export interface InitialData {
	center?: number[]
	zoom?: number
	minZoom?: number
	maxZoom?: number
	tileUrl?: ((z: number, y: number, x: number) => string) | null
	xCount?: number
	yCount?: number
	minZoomTileSize?: number
	hooks?: Hooks
	plugins?: {}[]
}
