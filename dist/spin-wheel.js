/**
 * spin-wheel v4.1.1
 * https://github.com/CrazyTim/spin-wheel#readme
 * Copyright (c) CrazyTim 2023.
 * Distributed under the MIT license.
 */
var p=Math.pow;function w(s=0,e=0,t=14){return parseFloat((Math.random()*(e-s)+s).toFixed(t))}function d(s=0){return s*Math.PI/180}function M(s,e,t){return e<t?e<=s&&s<t:e<=s||s<t}function S(s,e,t,i){i.save(),i.font=`1px ${e}`;let r=i.measureText(s).width;return i.restore(),t/r}function y(s={x:0,y:0},e,t,i){return p(s.x-e,2)+p(s.y-t,2)<=p(i,2)}function R(s={x:0,y:0},e={},t=1){let i=e.getBoundingClientRect();return{x:(s.x-i.left)*t,y:(s.y-i.top)*t}}function x(s,e,t,i){let r=s-t,n=e-i,a=Math.atan2(-n,-r);return a*=180/Math.PI,a<0&&(a+=360),a}function V(s=0,e=0){let t=s+e,i;return t>0?i=t%360:i=360+t%360,i===360&&(i=0),i}function E(s=0,e=0){let t=180-e;return 180-V(s,t)}function I(s=0,e=0,t=1){let i=(s%360+e)%360;return i=D(i),i=(t===1?360-i:360+i)%360,i*=t,s+i}function b(s){return typeof s=="object"&&!Array.isArray(s)&&s!==null}function h(s){return typeof s=="number"&&!Number.isNaN(s)}function l({val:s,isValid:e,errorMessage:t,defaultValue:i,action:r=null}){if(e)return r?r():s;if(s===void 0)return i;throw new Error(t)}function C(s){return s&&s.complete&&s.naturalWidth!==0&&s.naturalHeight!==0}function D(s=0){return Number(s.toFixed(9))}function A(s){return Math.sin(s*Math.PI/2)}function c(s,e,t={}){let i=new CustomEvent(e,{bubbles:!0,cancelable:!0,detail:t});return s.dispatchEvent(i)}var B=Object.freeze({left:"left",right:"right",center:"center"}),o=Object.freeze({wheel:{borderColor:"#000",borderWidth:1,debug:!1,image:null,isInteractive:!0,itemBackgroundColors:["#fff"],itemLabelAlign:B.right,itemLabelBaselineOffset:0,itemLabelColors:["#000"],itemLabelFont:"sans-serif",itemLabelFontSizeMax:500,itemLabelRadius:.85,itemLabelRadiusMax:.2,itemLabelRotation:0,items:[],lineColor:"#000",lineWidth:1,pixelRatio:0,radius:.95,rotation:0,rotationResistance:-35,rotationSpeedMax:300,offset:{w:0,h:0},onCurrentIndexChange:null,onRest:null,onSpin:null,overlayImage:null,pointerAngle:0},item:{backgroundColor:null,image:null,imageRadius:.5,imageRotation:0,imageScale:1,label:"",labelColor:null,value:null,weight:1}}),_=Object.freeze({pointerLineColor:"#ff00ff",labelOutlineColor:"#ff00ff",labelRadiusColor:"#00ff00",dragEventHue:200}),f=Object.freeze({currentIndexChange:"spin-wheel:current-index-change",rest:"spin-wheel:rest",spin:"spin-wheel:spin"});function T(s={}){j(s),s._handler_onResize=t=>s.resize(t),window.addEventListener("resize",s._handler_onResize);let e=()=>{s.resize(),matchMedia(`(resolution: ${pr}dppx)`).addEventListener("change",e,{once:!0})}}function P(s={}){let e=s.canvas;"PointerEvent"in window?(e.removeEventListener("pointerdown",s._handler_onPointerDown),e.removeEventListener("pointermove",s._handler_onPointerMoveRefreshCursor)):(e.removeEventListener("touchstart",s._handler_onTouchStart),e.removeEventListener("mousedown",s._handler_onMouseDown),e.removeEventListener("mousemove",s._handler_onMouseMoveRefreshCursor)),window.removeEventListener("resize",s._handler_onResize)}function j(s={}){let e=s.canvas;s._handler_onPointerMoveRefreshCursor=(t={})=>{let i={x:t.clientX,y:t.clientY};s.isCursorOverWheel=s.wheelHitTest(i),s.refreshCursor()},s._handler_onMouseMoveRefreshCursor=(t={})=>{let i={x:t.clientX,y:t.clientY};s.isCursorOverWheel=s.wheelHitTest(i),s.refreshCursor()},s._handler_onPointerDown=(t={})=>{let i={x:t.clientX,y:t.clientY};if(!s.isInteractive||!s.wheelHitTest(i))return;t.preventDefault(),s.dragStart(i),e.setPointerCapture(t.pointerId),e.addEventListener("pointermove",r),e.addEventListener("pointerup",n),e.addEventListener("pointercancel",n),e.addEventListener("pointerout",n);function r(a={}){a.preventDefault(),s.dragMove({x:a.clientX,y:a.clientY})}function n(a={}){a.preventDefault(),e.releasePointerCapture(a.pointerId),e.removeEventListener("pointermove",r),e.removeEventListener("pointerup",n),e.removeEventListener("pointercancel",n),e.removeEventListener("pointerout",n),s.dragEnd()}},s._handler_onMouseDown=(t={})=>{let i={x:t.clientX,y:t.clientY};if(!s.isInteractive||!s.wheelHitTest(i))return;s.dragStart(i),document.addEventListener("mousemove",r),document.addEventListener("mouseup",n);function r(a={}){a.preventDefault(),s.dragMove({x:a.clientX,y:a.clientY})}function n(a={}){a.preventDefault(),document.removeEventListener("mousemove",r),document.removeEventListener("mouseup",n),s.dragEnd()}},s._handler_onTouchStart=(t={})=>{let i={x:t.targetTouches[0].clientX,y:t.targetTouches[0].clientY};if(!s.isInteractive||!s.wheelHitTest(i))return;t.preventDefault(),s.dragStart(i),e.addEventListener("touchmove",r),e.addEventListener("touchend",n),e.addEventListener("touchcancel",n);function r(a={}){a.preventDefault(),s.dragMove({x:a.targetTouches[0].clientX,y:a.targetTouches[0].clientY})}function n(a={}){a.preventDefault(),e.removeEventListener("touchmove",r),e.removeEventListener("touchend",n),e.removeEventListener("touchcancel",n),s.dragEnd()}},"PointerEvent"in window?(e.addEventListener("pointerdown",s._handler_onPointerDown),e.addEventListener("pointermove",s._handler_onPointerMoveRefreshCursor)):(e.addEventListener("touchstart",s._handler_onTouchStart),e.addEventListener("mousedown",s._handler_onMouseDown),e.addEventListener("mousemove",s._handler_onMouseMoveRefreshCursor))}var v=class{constructor(e,t={}){if(!b(e))throw new Error("wheel must be an instance of Wheel");if(!b(t)&&t!==null)throw new Error("props must be an Object or null");this._wheel=e;for(let i of Object.keys(o.item))this["_"+i]=o.item[i];t?this.init(t):this.init(o.item)}init(e={}){this.backgroundColor=e.backgroundColor,this.image=e.image,this.imageRadius=e.imageRadius,this.imageRotation=e.imageRotation,this.imageScale=e.imageScale,this.label=e.label,this.labelColor=e.labelColor,this.value=e.value,this.weight=e.weight}get backgroundColor(){return this._backgroundColor}set backgroundColor(e){typeof e=="string"?this._backgroundColor=e:this._backgroundColor=o.item.backgroundColor,this._wheel.refresh()}get image(){var e,t;return(t=(e=this._image)==null?void 0:e.src)!=null?t:null}set image(e){let t;typeof e=="string"?(t=new Image,t.src=e,t.onload=i=>this._wheel.refresh()):t=o.item.image,this._image=t,this._wheel.refresh()}get imageObj(){return this._image}get imageRadius(){return this._imageRadius}set imageRadius(e){typeof e=="number"?this._imageRadius=e:this._imageRadius=o.item.imageRadius,this._wheel.refresh()}get imageRotation(){return this._imageRotation}set imageRotation(e){typeof e=="number"?this._imageRotation=e:this._imageRotation=o.item.imageRotation,this._wheel.refresh()}get imageScale(){return this._imageScale}set imageScale(e){typeof e=="number"?this._imageScale=e:this._imageScale=o.item.imageScale,this._wheel.refresh()}get label(){return this._label}set label(e){typeof e=="string"?this._label=e:this._label=o.item.label,this._wheel.refresh()}get labelColor(){return this._labelColor}set labelColor(e){typeof e=="string"?this._labelColor=e:this._labelColor=o.item.labelColor,this._wheel.refresh()}get value(){return this._value}set value(e){e!==void 0?this._value=e:this._value=o.item.value}get weight(){return this._weight}set weight(e){typeof e=="number"?this._weight=e:this._weight=o.item.weight}getIndex(){let e=this._wheel.items.findIndex(t=>t===this);if(e===-1)throw new Error("Item not found in parent Wheel");return e}getCenterAngle(){let e=this._wheel.getItemAngles()[this.getIndex()];return e.start+(e.end-e.start)/2}getStartAngle(){return this._wheel.getItemAngles()[this.getIndex()].start}getEndAngle(){return this._wheel.getItemAngles()[this.getIndex()].end}getRandomAngle(){return w(this.getStartAngle(),this.getEndAngle())}};window.customElements.define("spin-wheel",class extends HTMLElement{constructor(){super();let e=this.attachShadow({mode:"open"});e.innerHTML=`
      <style>
        :host {
          display: block;
        }
      </style>`,this.canvas=document.createElement("canvas"),e.appendChild(this.canvas),this._context=this.canvas.getContext("2d"),this._frameRequestId=null,this._rotationSpeed=0,this._rotationDirection=1,this._lastSpinFrameTime=void 0;for(let t of Object.keys(o.wheel))this["_"+t]=o.wheel[t];this.init(o.wheel)}connectedCallback(){T(this)}disconnectedCallback(){P(this)}adoptedCallback(){}init(e={}){if(!b(e)&&e!==null)throw new Error("props must be an Object or null");this._isInitialising=!0,this.borderColor=e.borderColor,this.borderWidth=e.borderWidth,this.debug=e.debug,this.image=e.image,this.isInteractive=e.isInteractive,this.itemBackgroundColors=e.itemBackgroundColors,this.itemLabelAlign=e.itemLabelAlign,this.itemLabelBaselineOffset=e.itemLabelBaselineOffset,this.itemLabelColors=e.itemLabelColors,this.itemLabelFont=e.itemLabelFont,this.itemLabelFontSizeMax=e.itemLabelFontSizeMax,this.itemLabelRadius=e.itemLabelRadius,this.itemLabelRadiusMax=e.itemLabelRadiusMax,this.itemLabelRotation=e.itemLabelRotation,this.items=e.items,this.lineColor=e.lineColor,this.lineWidth=e.lineWidth,this.pixelRatio=e.pixelRatio,this.rotationSpeedMax=e.rotationSpeedMax,this.radius=e.radius,this.rotation=e.rotation,this.rotationResistance=e.rotationResistance,this.offset=e.offset,this.overlayImage=e.overlayImage,this.pointerAngle=e.pointerAngle}resize(){let e=this.clientWidth*this.getActualPixelRatio(),t=this.clientHeight*this.getActualPixelRatio(),i=Math.min(e,t),r={w:i-i*this.offset.w,h:i-i*this.offset.h},n=Math.min(e/r.w,t/r.h);this._size=Math.max(r.w*n,r.h*n),this.canvas.style.width=this.clientWidth+"px",this.canvas.style.height=this.clientHeight+"px",this.canvas.width=e,this.canvas.height=t,this._center={x:e/2+e*this.offset.w,y:t/2+t*this.offset.h},this._actualRadius=this._size/2*this.radius,this.itemLabelFontSize=this.itemLabelFontSizeMax*(this._size/500),this.labelMaxWidth=this._actualRadius*(this.itemLabelRadius-this.itemLabelRadiusMax);for(let a of this._items)this.itemLabelFontSize=Math.min(this.itemLabelFontSize,S(a.label,this.itemLabelFont,this.labelMaxWidth,this._context));this.refresh()}draw(e=0){this._frameRequestId=null;let t=this._context;t.clearRect(0,0,this.canvas.width,this.canvas.height),this.animateRotation(e);let i=this.getItemAngles(this._rotation),r=this.getActualBorderWidth();t.textBaseline="middle",t.textAlign=this.itemLabelAlign,t.font=this.itemLabelFontSize+"px "+this.itemLabelFont,t.save();for(let[n,a]of i.entries()){let u=new Path2D;u.moveTo(this._center.x,this._center.y),u.arc(this._center.x,this._center.y,this._actualRadius-r/2,d(a.start+-90),d(a.end+-90)),this._items[n].path=u}this.drawItemBackgrounds(t,i),this.drawItemImages(t,i),this.drawItemLines(t,i),this.drawItemLabels(t,i),this.drawBorder(t),this.drawImage(t,this._image,!1),this.drawImage(t,this._overlayImage,!0),this.drawPointerLine(t),this.drawDragEvents(t),this._isInitialising=!1}drawItemBackgrounds(e,t=[]){var i;for(let[r,n]of t.entries()){let a=this._items[r];e.fillStyle=(i=a.backgroundColor)!=null?i:this._itemBackgroundColors[r%this._itemBackgroundColors.length],e.fill(a.path)}}drawItemImages(e,t=[]){for(let[i,r]of t.entries()){let n=this._items[i];if(!C(n.imageObj))continue;e.save(),e.clip(n.path);let a=r.start+(r.end-r.start)/2;e.translate(this._center.x+Math.cos(d(a+-90))*(this._actualRadius*n.imageRadius),this._center.y+Math.sin(d(a+-90))*(this._actualRadius*n.imageRadius)),e.rotate(d(a+n.imageRotation));let u=this._size/500*n.imageObj.width*n.imageScale,m=this._size/500*n.imageObj.height*n.imageScale,F=-u/2,k=-m/2;e.drawImage(n.imageObj,F,k,u,m),e.restore()}}drawImage(e,t,i=!1){if(!C(t))return;e.translate(this._center.x,this._center.y),i||e.rotate(d(this._rotation));let r=i?this._size:this._size*this.radius,n=-(r/2);e.drawImage(t,n,n,r,r),e.resetTransform()}drawPointerLine(e){!this.debug||(e.translate(this._center.x,this._center.y),e.rotate(d(this._pointerAngle+-90)),e.beginPath(),e.moveTo(0,0),e.lineTo(this._actualRadius*2,0),e.strokeStyle=_.pointerLineColor,e.lineWidth=2,e.stroke(),e.resetTransform())}drawBorder(e){if(this._borderWidth<=0)return;let t=this.getActualBorderWidth(),i=this._borderColor||"transparent";e.beginPath(),e.strokeStyle=i,e.lineWidth=t,e.arc(this._center.x,this._center.y,this._actualRadius-t/2,0,2*Math.PI),e.stroke(),this.debug&&(e.beginPath(),e.strokeStyle=e.strokeStyle=_.labelRadiusColor,e.lineWidth=1,e.arc(this._center.x,this._center.y,this._actualRadius*this.itemLabelRadius,0,2*Math.PI),e.stroke(),e.beginPath(),e.strokeStyle=e.strokeStyle=_.labelRadiusColor,e.lineWidth=1,e.arc(this._center.x,this._center.y,this._actualRadius*this.itemLabelRadiusMax,0,2*Math.PI),e.stroke())}drawItemLines(e,t=[]){if(this._lineWidth<=0)return;let i=this._lineWidth/500*this._size,r=this.getActualBorderWidth();e.translate(this._center.x,this._center.y);for(let n of t)e.rotate(d(n.start+-90)),e.beginPath(),e.moveTo(0,0),e.lineTo(this._actualRadius-r,0),e.strokeStyle=this.lineColor,e.lineWidth=i,e.stroke(),e.rotate(-d(n.start+-90));e.resetTransform()}drawItemLabels(e,t=[]){let i=this.itemLabelFontSize*-this.itemLabelBaselineOffset;for(let[r,n]of t.entries()){let a=this._items[r],u=a.labelColor||this._itemLabelColors[r%this._itemLabelColors.length]||"transparent";if(a.label.trim()===""||u==="transparent")continue;e.save(),e.clip(a.path);let m=n.start+(n.end-n.start)/2;e.translate(this._center.x+Math.cos(d(m+-90))*(this._actualRadius*this.itemLabelRadius),this._center.y+Math.sin(d(m+-90))*(this._actualRadius*this.itemLabelRadius)),e.rotate(d(m+-90)),e.rotate(d(this.itemLabelRotation)),this.debug&&(e.beginPath(),e.moveTo(0,0),e.lineTo(-this.labelMaxWidth,0),e.strokeStyle=_.labelOutlineColor,e.lineWidth=1,e.stroke(),e.strokeRect(0,-this.itemLabelFontSize/2,-this.labelMaxWidth,this.itemLabelFontSize)),e.fillStyle=u,e.fillText(a.label,0,i),e.restore()}}drawDragEvents(e){var i;if(!this.debug||!((i=this.dragEvents)!=null&&i.length))return;let t=[...this.dragEvents].reverse();for(let[r,n]of t.entries()){let a=r/this.dragEvents.length*100;e.beginPath(),e.arc(n.x,n.y,5,0,2*Math.PI),e.fillStyle=`hsl(${_.dragEventHue},100%,${a}%)`,e.strokeStyle="#000",e.lineWidth=.5,e.fill(),e.stroke()}}animateRotation(e=0){if(this._spinToTimeEnd!==void 0){if(e>=this._spinToTimeEnd){this.rotation=this._spinToEndRotation,this._spinToTimeEnd=void 0,c(this,f.rest,{currentIndex:this._currentIndex,rotation:this._rotation});return}let t=this._spinToTimeEnd-this._spinToTimeStart,i=(e-this._spinToTimeStart)/t;i=i<0?0:i;let r=this._spinToEndRotation-this._spinToStartRotation;this.rotation=this._spinToStartRotation+r*this._spinToEasingFunction(i),this.refresh();return}if(this._lastSpinFrameTime!==void 0){let t=e-this._lastSpinFrameTime;t>0&&(this.rotation+=t/1e3*this._rotationSpeed%360,this._rotationSpeed=this.getRotationSpeedPlusDrag(t),this._rotationSpeed===0?(c(this,f.rest,{currentIndex:this._currentIndex,rotation:this._rotation}),this._lastSpinFrameTime=void 0):this._lastSpinFrameTime=e),this.refresh();return}}getRotationSpeedPlusDrag(e=0){let t=this._rotationSpeed+this.rotationResistance*(e/1e3)*this._rotationDirection;return this._rotationDirection===1&&t<0||this._rotationDirection===-1&&t>=0?0:t}spin(e=0){if(!h(e))throw new Error("rotationSpeed must be a number");this.beginSpin(e,"spin")}spinTo(e=0,t=0,i=null){if(!h(e))throw new Error("Error: rotation must be a number");if(!h(t))throw new Error("Error: duration must be a number");this.stop(),this.animate(e,t,i),c(this,f.spin,{duration:t,method:"spinto",targetRotation:e})}spinToItem(e=0,t=0,i=!0,r=1,n=1,a=null){this.stop();let u=i?this.items[e].getCenterAngle():this.items[e].getRandomAngle(),m=I(this.rotation,u-this._pointerAngle,n);m+=r*360*n,this.animate(m,t,a),c(this,f.spin,{duration:t,method:"spintoitem",targetItemIndex:e,targetRotation:m})}animate(e,t,i){this._spinToStartRotation=this.rotation,this._spinToEndRotation=e,this._spinToTimeStart=performance.now(),this._spinToTimeEnd=this._spinToTimeStart+t,this._spinToEasingFunction=i||A,this.refresh()}stop(){this._rotationSpeed=0,this._spinToTimeEnd=void 0}getActualBorderWidth(){return this._borderWidth/500*this._size}getActualPixelRatio(){return this._pixelRatio!==0?this._pixelRatio:window.devicePixelRatio}wheelHitTest(e={x:0,y:0}){let t=R(e,this.canvas,this.getActualPixelRatio());return y(t,this._center.x,this._center.y,this._actualRadius)}refreshCursor(){if(this.isInteractive){if(this.isDragging){this.canvas.style.cursor="grabbing";return}if(this.isCursorOverWheel){this.canvas.style.cursor="grab";return}}this.canvas.style.cursor=""}getAngleFromCenter(e={x:0,y:0}){return(x(this._center.x,this._center.y,e.x,e.y)+90)%360}getCurrentIndex(){return this._currentIndex}refreshCurrentIndex(e=[]){this._items.length===0&&(this._currentIndex=-1);for(let[t,i]of e.entries())if(!!M(this._pointerAngle,i.start%360,i.end%360)){if(this._currentIndex===t)break;this._currentIndex=t,this._isInitialising||c(this,f.currentIndexChange,{currentIndex:this._currentIndex});break}}getItemAngles(e=0){let t=0;for(let u of this.items)t+=u.weight;let i=360/t,r,n=e,a=[];for(let u of this._items)r=u.weight*i,a.push({start:n,end:n+r}),n+=r;return this._items.length>1&&(a[a.length-1].end=a[0].start+360),a}refresh(){this._frameRequestId===null&&(this._frameRequestId=window.requestAnimationFrame(e=>this.draw(e)))}limitSpeed(e=0,t=0){let i=Math.min(e,t);return Math.max(i,-t)}beginSpin(e=0,t=""){this.stop(),this._rotationSpeed=this.limitSpeed(e,this._rotationSpeedMax),this._lastSpinFrameTime=performance.now(),this._rotationDirection=this._rotationSpeed>=0?1:-1,this._rotationSpeed!==0&&c(this,f.spin,{method:t,rotationResistance:this._rotationResistance,rotationSpeed:this._rotationSpeed}),this.refresh()}get borderColor(){return this._borderColor}set borderColor(e){this._borderColor=l({val:e,isValid:typeof e=="string",errorMessage:"Wheel.borderColor must be a string",defaultValue:o.wheel.borderColor}),this.refresh()}get borderWidth(){return this._borderWidth}set borderWidth(e){this._borderWidth=l({val:e,isValid:h(e),errorMessage:"Wheel.borderWidth must be a number",defaultValue:o.wheel.borderWidth}),this.refresh()}get debug(){return this._debug}set debug(e){this._debug=l({val:e,isValid:typeof e=="boolean",errorMessage:"Wheel.debug must be a boolean",defaultValue:o.wheel.debug}),this.refresh()}get image(){var e,t;return(t=(e=this._image)==null?void 0:e.src)!=null?t:null}set image(e){this._image=l({val:e,isValid:typeof e=="string"||e===null,errorMessage:"Wheel.image must be a url (string) or null",defaultValue:o.wheel.image,action:()=>{if(e===null)return null;let t=new Image;return t.src=e,t.onload=i=>this.refresh(),t}}),this.refresh()}get isInteractive(){return this._isInteractive}set isInteractive(e){this._isInteractive=l({val:e,isValid:typeof e=="boolean",errorMessage:"Wheel.isInteractive must be a boolean",defaultValue:o.wheel.isInteractive}),this.refreshCursor()}get itemBackgroundColors(){return this._itemBackgroundColors}set itemBackgroundColors(e){this._itemBackgroundColors=l({val:e,isValid:Array.isArray(e),errorMessage:"Wheel.itemBackgroundColors must be an array",defaultValue:o.wheel.itemBackgroundColors}),this.refresh()}get itemLabelAlign(){return this._itemLabelAlign}set itemLabelAlign(e){this._itemLabelAlign=l({val:e,isValid:typeof e=="string",errorMessage:"Wheel.itemLabelAlign must be a string",defaultValue:o.wheel.itemLabelAlign}),this.refresh()}get itemLabelBaselineOffset(){return this._itemLabelBaselineOffset}set itemLabelBaselineOffset(e){this._itemLabelBaselineOffset=l({val:e,isValid:h(e),errorMessage:"Wheel.itemLabelBaselineOffset must be a number",defaultValue:o.wheel.itemLabelBaselineOffset}),this.resize()}get itemLabelColors(){return this._itemLabelColors}set itemLabelColors(e){this._itemLabelColors=l({val:e,isValid:Array.isArray(e),errorMessage:"Wheel.itemLabelColors must be an array",defaultValue:o.wheel.itemLabelColors}),this.refresh()}get itemLabelFont(){return this._itemLabelFont}set itemLabelFont(e){this._itemLabelFont=l({val:e,isValid:typeof e=="string",errorMessage:"Wheel.itemLabelFont must be a string",defaultValue:o.wheel.itemLabelFont}),this.resize()}get itemLabelFontSizeMax(){return this._itemLabelFontSizeMax}set itemLabelFontSizeMax(e){this._itemLabelFontSizeMax=l({val:e,isValid:h(e),errorMessage:"Wheel.itemLabelFontSizeMax must be a number",defaultValue:o.wheel.itemLabelFontSizeMax}),this.resize()}get itemLabelRadius(){return this._itemLabelRadius}set itemLabelRadius(e){this._itemLabelRadius=l({val:e,isValid:h(e),errorMessage:"Wheel.itemLabelRadius must be a number",defaultValue:o.wheel.itemLabelRadius}),this.resize()}get itemLabelRadiusMax(){return this._itemLabelRadiusMax}set itemLabelRadiusMax(e){this._itemLabelRadiusMax=l({val:e,isValid:h(e),errorMessage:"Wheel.itemLabelRadiusMax must be a number",defaultValue:o.wheel.itemLabelRadiusMax}),this.resize()}get itemLabelRotation(){return this._itemLabelRotation}set itemLabelRotation(e){this._itemLabelRotation=l({val:e,isValid:h(e),errorMessage:"Wheel.itemLabelRotation must be a number",defaultValue:o.wheel.itemLabelRotation}),this.refresh()}get items(){return this._items}set items(e){this._items=l({val:e,isValid:Array.isArray(e),errorMessage:"Wheel.items must be an array of Items",defaultValue:o.wheel.items,action:()=>{let t=[];for(let i of e)t.push(new v(this,{backgroundColor:i.backgroundColor,image:i.image,imageRadius:i.imageRadius,imageRotation:i.imageRotation,imageScale:i.imageScale,label:i.label,labelColor:i.labelColor,value:i.value,weight:i.weight}));return t}}),this.refreshCurrentIndex(this.getItemAngles(this._rotation)),this.resize()}get lineColor(){return this._lineColor}set lineColor(e){this._lineColor=l({val:e,isValid:typeof e=="string",errorMessage:"Wheel.lineColor must be a string",defaultValue:o.wheel.lineColor}),this.refresh()}get lineWidth(){return this._lineWidth}set lineWidth(e){this._lineWidth=l({val:e,isValid:h(e),errorMessage:"Wheel.lineWidth must be a number",defaultValue:o.wheel.lineWidth}),this.refresh()}get offset(){return this._offset}set offset(e){this._offset=l({val:e,isValid:b(e),errorMessage:"Wheel.offset must be an object",defaultValue:o.wheel.offset}),this.resize()}get overlayImage(){var e,t;return(t=(e=this._overlayImage)==null?void 0:e.src)!=null?t:null}set overlayImage(e){this._overlayImage=l({val:e,isValid:typeof e=="string"||e===null,errorMessage:"Wheel.overlayImage must be a url (string) or null",defaultValue:o.wheel.overlayImage,action:()=>{if(e===null)return null;let t=new Image;return t.src=e,t.onload=i=>this.refresh(),t}}),this.refresh()}get pixelRatio(){return this._pixelRatio}set pixelRatio(e){this._pixelRatio=l({val:e,isValid:h(e),errorMessage:"Wheel.pixelRatio must be a number",defaultValue:o.wheel.pixelRatio}),this.resize()}get pointerAngle(){return this._pointerAngle}set pointerAngle(e){this._pointerAngle=l({val:e,isValid:h(e)&&e>=0,errorMessage:"Wheel.pointerAngle must be a number between 0 and 360",defaultValue:o.wheel.pointerAngle,action:()=>e%360}),this.debug&&this.refresh()}get radius(){return this._radius}set radius(e){this._radius=l({val:e,isValid:h(e),errorMessage:"Wheel.radius must be a number",defaultValue:o.wheel.radius}),this.resize()}get rotation(){return this._rotation}set rotation(e){this._rotation=l({val:e,isValid:h(e),errorMessage:"Wheel.rotation must be a number",defaultValue:o.wheel.rotation}),this.refreshCurrentIndex(this.getItemAngles(this._rotation)),this.refresh()}get rotationResistance(){return this._rotationResistance}set rotationResistance(e){this._rotationResistance=l({val:e,isValid:h(e),errorMessage:"Wheel.rotationResistance must be a number",defaultValue:o.wheel.rotationResistance})}get rotationSpeed(){return this._rotationSpeed}get rotationSpeedMax(){return this._rotationSpeedMax}set rotationSpeedMax(e){this._rotationSpeedMax=l({val:e,isValid:h(e)&&e>=0,errorMessage:"Wheel.rotationSpeedMax must be a number >= 0",defaultValue:o.wheel.rotationSpeedMax})}dragStart(e={x:0,y:0}){let t=R(e,this.canvas,this.getActualPixelRatio());this.isDragging=!0,this.stop(),this.dragEvents=[{distance:0,x:t.x,y:t.y,now:performance.now()}],this.refreshCursor()}dragMove(e={x:0,y:0}){let t=R(e,this.canvas,this.getActualPixelRatio()),i=this.getAngleFromCenter(t),r=this.dragEvents[0],n=this.getAngleFromCenter(r),a=E(n,i);this.dragEvents.unshift({distance:a,x:t.x,y:t.y,now:performance.now()}),this.debug&&this.dragEvents.length>=40&&this.dragEvents.pop(),this.rotation+=a}dragEnd(){this.isDragging=!1;let e=0,t=performance.now();for(let[i,r]of this.dragEvents.entries()){if(!this.isDragEventTooOld(t,r)){e+=r.distance;continue}this.dragEvents.length=i;break}this.refreshCursor(),e!==0&&this.beginSpin(e*(1e3/250),"interact")}isDragEventTooOld(e=0,t={}){return e-t.now>250}});
//# sourceMappingURL=spin-wheel.js.map
