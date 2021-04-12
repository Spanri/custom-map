function handleZoom(self: any) {
	const pluginElement = self.el.getElementsByClassName("cm-plugin")[0]
	const zoomInElement = pluginElement.getElementsByClassName("cm-zoom-in")[0]
	const zoomOutElement = pluginElement.getElementsByClassName("cm-zoom-out")[0]

	if (self.zoom <= self.minZoom) {
		zoomInElement.removeAttribute("disabled")
		zoomOutElement.setAttribute("disabled", "")
	} else if (self.zoom >= self.maxZoom) {
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

			const pluginElement = self.el.getElementsByClassName("cm-plugin")[0]
			pluginElement.appendChild(zoomElement)

			const zoomInElement = pluginElement.getElementsByClassName("cm-zoom-in")[0]
			zoomInElement.addEventListener("click", () => {
				self.setZoom(self.zoom + 1)
			})

			const zoomOutElement = pluginElement.getElementsByClassName("cm-zoom-out")[0]
			zoomOutElement.addEventListener("click", () => {
				self.setZoom(self.zoom - 1)
			})

			handleZoom(self)
		},

		afterZoom: (self: any) => {
			console.log("after zoom")
			handleZoom(self)
		}
	}
}
