function handleZoom(self: any) {
	const pluginElement = self._el.getElementsByClassName("cm-plugin")[0]
	const zoomInElement = pluginElement.getElementsByClassName("cm-zoom-in")[0]
	const zoomOutElement = pluginElement.getElementsByClassName("cm-zoom-out")[0]

	if (self._zoom <= self._minZoom) {
		zoomInElement.removeAttribute("disabled")
		zoomOutElement.setAttribute("disabled", "")
	} else if (self._zoom >= self._maxZoom) {
		zoomInElement.setAttribute("disabled", "")
		zoomOutElement.removeAttribute("disabled")
	} else {
		zoomInElement.removeAttribute("disabled")
		zoomOutElement.setAttribute("disabled", "")
	}
}

export default {
	hooks: {
		afterInit: (self: any) => {
			const zoomElement: any = `
        <div class="cm-zoom">
          <button class="cm-zoom-in">-</button>
          <button class="cm-zoom-out">+</button>
        </div>
      `

			const pluginElement = self._el.getElementsByClassName("cm-plugin")[0]
			pluginElement.insertAdjacentHTML("beforeend", zoomElement)

			const zoomInElement = pluginElement.getElementsByClassName("cm-zoom-in")[0]
			zoomInElement.addEventListener("click", () => {
				self.setZoom(self._zoom + 1)
			})

			const zoomOutElement = pluginElement.getElementsByClassName("cm-zoom-out")[0]
			zoomOutElement.addEventListener("click", () => {
				self.setZoom(self._zoom - 1)
			})

			handleZoom(self)
		},

		afterZoom: (self: any) => {
			console.log("after zoom")
			handleZoom(self)
		}
	}
}
