let t=0,e=0,i=0,s=0,o=!1;function l(t,e){o=!1}function n(t,e,i){e.addEventListener?e.addEventListener(t,i,!1):e.attachEvent?e.attachEvent("on"+t,i):e[t]=i}function a(a,r,h){n("mousedown",a,(l=>function(l,n){l||(l=window.event),l.target&&"IMG"===l.target.nodeName?l.preventDefault():l.srcElement&&"IMG"===l.srcElement.nodeName&&(l.returnValue=!1),i=l.clientX+n.scrollLeft,s=l.clientY+n.scrollTop,t=0,e=0,o=!0}(l,a))),n("mousemove",a,(l=>function(l,n,a,r){o&&(l||(l=window.event),t=i-(l.clientX+n.scrollLeft),e=s-(l.clientY+n.scrollTop),n.scrollLeft+=t,n.scrollTop+=e,a(r))}(l,a,r,h))),n("mouseup",a,(t=>l())),n("mouseup",window,(t=>l()))}function r(t){const e=t._el.getElementsByClassName("cm-plugin")[0],i=e.getElementsByClassName("cm-zoom-in")[0],s=e.getElementsByClassName("cm-zoom-out")[0];t._zoom<=t._minZoom?(i.removeAttribute("disabled"),s.setAttribute("disabled","")):t._zoom>=t._maxZoom?(i.setAttribute("disabled",""),s.removeAttribute("disabled")):(i.removeAttribute("disabled"),s.setAttribute("disabled",""))}var h={hooks:{afterInit:t=>{const e=t._el.getElementsByClassName("cm-plugin")[0];e.insertAdjacentHTML("beforeend",'\n        <div class="cm-zoom">\n          <button class="cm-zoom-out">-</button>\n\t\t\t\t\t<button class="cm-zoom-in">+</button>\n        </div>\n      ');e.getElementsByClassName("cm-zoom-in")[0].addEventListener("click",(()=>{t.setZoom(t._zoom+1)}));e.getElementsByClassName("cm-zoom-out")[0].addEventListener("click",(()=>{t.setZoom(t._zoom-1)})),r(t)},afterZoom:t=>{r(t)}}},c={Core:class{constructor(t,{center:e,zoom:i,minZoom:s,maxZoom:o,tileUrl:l,xCount:n,yCount:r,minZoomTileSize:h,hooks:c,plugins:m}){this._ctx=null,this._tileUrl=null,this._cache=[],this._el=t,this._zoom=i||0,this._minZoom=s||0,this._maxZoom=o||5,this._tileUrl=l||null,this._minZoomTileSize=h||200,this._xCount=n||2,this._yCount=r||2,this._center=e||[this._xCount/2,this._yCount/2],this._hooks=c||{},this._cache=[],t.classList.add("cm");const d=document.createElement("CANVAS");d.width=400,d.height=400,d.classList.add("cm-canvas");const u=document.createElement("div");u.classList.add("cm-canvas-wrapper"),u.appendChild(d),this._el.appendChild(u),this._ctx=d.getContext("2d");const _=document.createElement("div");_.classList.add("cm-plugin"),this._el.appendChild(_),this.setPlugins(m),a(u,this.drawTiles,this),this._hooks&&this._hooks.afterInit&&this._hooks.afterInit(this)}load(){this.handleCenter(),this.initCache(),this._ctx.clearRect(0,0,this._minZoomTileSize*this._xCount,this._minZoomTileSize*this._yCount),this.drawTiles()}drawTiles(t=this){if(t._tileUrl)for(let e=t.visibleTiles.yMin;e<=t.visibleTiles.yMax;e++)for(let i=t.visibleTiles.xMin;i<=t.visibleTiles.xMax;i++)if(!t._cache[e][i]){const s=new Image;s.onload=()=>{setTimeout((()=>{t._ctx.drawImage(s,t.currentTileSize*i,t.currentTileSize*e,t.currentTileSize-3,t.currentTileSize-3),t._ctx.fill()}),150)},s.src=t._tileUrl(t._zoom,e,i),t._cache[e][i]=!0}}handleCenter(){this.elCanvasWrapper.scrollLeft=this._center[0]*this.currentTileSize-this.elRect.width/2,this.elCanvasWrapper.scrollTop=this._center[1]*this.currentTileSize-this.elRect.width/2}initCache(){this.visibleTiles.yMax,this.visibleTiles.yMin,this.visibleTiles.xMax,this.visibleTiles.xMin;this._cache=Array.from(Array(this._yCount+2)).map((()=>Array.from(Array(this._xCount+2).map((t=>!1)))))}get elCanvasWrapper(){return this._el.getElementsByClassName("cm-canvas-wrapper")[0]}get elRect(){const t=this.elCanvasWrapper.getBoundingClientRect(),e=getComputedStyle(this.elCanvasWrapper),i=parseFloat(e.paddingLeft)+parseFloat(e.paddingRight),s=parseFloat(e.paddingTop)+parseFloat(e.paddingBottom),o=parseFloat(e.borderLeftWidth)+parseFloat(e.borderRightWidth),l=parseFloat(e.borderTopWidth)+parseFloat(e.borderBottomWidth);return{...t,width:this.elCanvasWrapper.offsetWidth-i-o,height:this.elCanvasWrapper.offsetHeight-s-l}}get currentTileSize(){return 0==this._minZoom?this._minZoomTileSize/((this._zoom+1)/(this._minZoom+1)):this._minZoomTileSize/(this._zoom/this._minZoom)}get visibleTiles(){return{xMin:Math.floor(this.elCanvasWrapper.scrollLeft/this.currentTileSize),xMax:Math.min(Math.floor((this.elCanvasWrapper.scrollLeft+this.elRect.width-1)/this.currentTileSize),this._xCount+1),yMin:Math.floor(this.elCanvasWrapper.scrollTop/this.currentTileSize),yMax:Math.min(Math.floor((this.elCanvasWrapper.scrollTop+this.elRect.height-1)/this.currentTileSize),this._yCount+1)}}setHooks(t){this._hooks=t}setPlugins(t){t&&t.length&&t.forEach((t=>{Object.entries(t).forEach((([t,e])=>{this["_"+t]=e}))}))}setTileUrl(t){this._tileUrl=t}setCenter([t,e]){this._center=[t,e],this._hooks&&this._hooks.afterCenter&&this._hooks.afterCenter(this)}setZoom(t){this._ctx.clearRect(0,0,this._minZoomTileSize*this._xCount,this._minZoomTileSize*this._yCount),this._zoom=t,this.initCache(),this.drawTiles(),this._hooks&&this._hooks.afterZoom&&this._hooks.afterZoom(this)}},zoomPlugin:h};export default c;
