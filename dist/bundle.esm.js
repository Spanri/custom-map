let e=0,t=0,i=0,o=0,s=!1;function l(e,t){s=!1}function n(e,t,i){t.addEventListener?t.addEventListener(e,i,!1):t.attachEvent?t.attachEvent("on"+e,i):t[e]=i}function r(r,a,h){n("mousedown",r,(l=>function(l,n){l||(l=window.event),l.target&&"IMG"===l.target.nodeName?l.preventDefault():l.srcElement&&"IMG"===l.srcElement.nodeName&&(l.returnValue=!1),i=l.clientX+n.scrollLeft,o=l.clientY+n.scrollTop,e=0,t=0,s=!0}(l,r))),n("mousemove",r,(l=>function(l,n,r,a){s&&(l||(l=window.event),e=i-(l.clientX+n.scrollLeft),t=o-(l.clientY+n.scrollTop),n.scrollLeft+=e,n.scrollTop+=t,r(a))}(l,r,a,h))),n("mouseup",r,(e=>l())),n("mouseup",window,(e=>l()))}function a(e){const t=e._el.getElementsByClassName("cm-plugin")[0],i=t.getElementsByClassName("cm-zoom-in")[0],o=t.getElementsByClassName("cm-zoom-out")[0];e._zoom<=e._minZoom?(i.removeAttribute("disabled"),o.setAttribute("disabled","")):e._zoom>=e._maxZoom?(i.setAttribute("disabled",""),o.removeAttribute("disabled")):(i.removeAttribute("disabled"),o.setAttribute("disabled",""))}var h={hooks:{afterInit:e=>{const t=e._el.getElementsByClassName("cm-plugin")[0];t.insertAdjacentHTML("beforeend",'\n        <div class="cm-zoom">\n          <button class="cm-zoom-in">-</button>\n          <button class="cm-zoom-out">+</button>\n        </div>\n      ');t.getElementsByClassName("cm-zoom-in")[0].addEventListener("click",(()=>{e.setZoom(e._zoom+1)}));t.getElementsByClassName("cm-zoom-out")[0].addEventListener("click",(()=>{e.setZoom(e._zoom-1)})),a(e)},afterZoom:e=>{console.log("after zoom"),a(e)}}},m={Core:class{constructor(e,{center:t,zoom:i,minZoom:o,maxZoom:s,tileUrl:l,xCount:n,yCount:a,minZoomTileSize:h,hooks:m,plugins:c}){this._ctx=null,this._tileUrl=null,this._el=e,this._zoom=i||0,this._minZoom=o||0,this._maxZoom=s||5,this._tileUrl=l||null,this._minZoomTileSize=h||200,this._xCount=n||2,this._yCount=a||2,this._center=t||[this._xCount/2,this._yCount/2],this._hooks=m||{};const d=document.createElement("CANVAS");d.width=400,d.height=400,d.classList.add("cm-canvas");const u=document.createElement("div");u.classList.add("cm-canvas-wrapper"),u.appendChild(d),this._el.appendChild(u),this._ctx=d.getContext("2d");const p=document.createElement("div");p.classList.add("cm-plugin"),this._el.appendChild(p),this.setPlugins(c),r(u,this.drawTiles,this),this._hooks&&this._hooks.afterInit&&this._hooks.afterInit(this)}load(){this.handleCenter(),this.drawTiles()}drawTiles(e=this){if(e._ctx.clearRect(0,0,e._minZoomTileSize*e._xCount,e._minZoomTileSize*e._yCount),console.log({visibleTiles:e.visibleTiles}),e._tileUrl)for(let t=e.visibleTiles.yMin;t<=e.visibleTiles.yMax;t++)for(let i=e.visibleTiles.xMin;i<=e.visibleTiles.xMax;i++){console.log("x="+i+" y="+t);const o=new Image;o.onload=()=>{e._ctx.drawImage(o,e.currentTileSize*i,e.currentTileSize*t,e.currentTileSize-3,e.currentTileSize-3),e._ctx.fill()},o.src=e._tileUrl(e._zoom,t,i)}}handleCenter(){this.elCanvasWrapper.scrollLeft=this._center[0]*this.currentTileSize-this.elRect.width/2,this.elCanvasWrapper.scrollTop=this._center[1]*this.currentTileSize-this.elRect.width/2}get elCanvasWrapper(){return this._el.getElementsByClassName("cm-canvas-wrapper")[0]}get elRect(){const e=this.elCanvasWrapper.getBoundingClientRect(),t=getComputedStyle(this.elCanvasWrapper),i=parseFloat(t.paddingLeft)+parseFloat(t.paddingRight),o=parseFloat(t.paddingTop)+parseFloat(t.paddingBottom),s=parseFloat(t.borderLeftWidth)+parseFloat(t.borderRightWidth),l=parseFloat(t.borderTopWidth)+parseFloat(t.borderBottomWidth);return{...e,width:this.elCanvasWrapper.offsetWidth-i-s,height:this.elCanvasWrapper.offsetHeight-o-l}}get currentTileSize(){return 0==this._minZoom?this._minZoomTileSize/((this._zoom+1)/(this._minZoom+1)):this._minZoomTileSize/(this._zoom/this._minZoom)}get visibleTiles(){return{xMin:Math.floor(this.elCanvasWrapper.scrollLeft/this.currentTileSize),xMax:Math.min(Math.floor((this.elCanvasWrapper.scrollLeft+this.elRect.width-1)/this.currentTileSize),this._xCount-1),yMin:Math.floor(this.elCanvasWrapper.scrollTop/this.currentTileSize),yMax:Math.min(Math.floor((this.elCanvasWrapper.scrollTop+this.elRect.height-1)/this.currentTileSize),this._yCount-1)}}setHooks(e){this._hooks=e}setPlugins(e){e&&e.length&&e.forEach((e=>{Object.entries(e).forEach((([e,t])=>{this["_"+e]=t}))}))}setTileUrl(e){this._tileUrl=e}setCenter([e,t]){this._center=[e,t],this._hooks&&this._hooks.afterCenter&&this._hooks.afterCenter(this)}setZoom(e){this._zoom=e,this.drawTiles(),this._hooks&&this._hooks.afterZoom&&this._hooks.afterZoom(this)}},zoomPlugin:h};export default m;