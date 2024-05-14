// @ts-check
import * as util from './util.js';
import * as Constants from './constants.js';
import {Defaults} from './constants.js';
import * as events from './events.js';
import {Item, ItemProps} from './item.js';

/**
 * @function getItemAngles
 * @param {string} [initialRotation]
 * @returns {Array<{start:number, end:number}>}
 */

/**
 * Interface for the Wheel class.
 * @typedef {object} IWheel
 * @prop {function(): void} refresh
 * @prop {function(): Array<{start:number, end:number}>} getItemAngles
 * @prop {Array<Item>} items
 */

/** @type {IWheel} */
export let IWheel;

/**
 * @typedef {"left" | "center" | "right"} ItemLabelAlign
 */

/** @type {ItemLabelAlign} */
export let ItemLabelAlign;

/**
 * @typedef {object} Point
 * @prop {number} x
 * @prop {number} y
 */

/** @type {Point} */
export let Point;

/**
 * @typedef {object} DragEvents
 * @prop {number} distance
 * @prop {number} x
 * @prop {number} y
 * @prop {number} now
 */

/** @type {DragEvents} */
export let DragEvents;

/**
 * @typedef {object} CurrentIndexChangeEvent
 * @prop {'currentIndexChange'} type
 * @prop {number} currentIndex The index of the item that the Pointer was pointing at. See Wheel.pointerAngle.
 */

/** @type {CurrentIndexChangeEvent} */
export let CurrentIndexChangeEvent;

/**
 * @typedef {object} RestEvent
 * @prop {'rest'} type
 * @prop {number} currentIndex The index of the item that the Pointer was pointing at. See Wheel.pointerAngle.
 * @prop {number} rotation The rotation of the wheel. See Wheel.rotation.
 */

/** @type {RestEvent} */
export let RestEvent;

/**
 * @typedef {object} WheelProps
 * @prop {string} [borderColor]
 * @prop {number} [borderWidth]
 * @prop {boolean} [debug]
 * @prop {?string} [image]
 * @prop {boolean} [isInteractive]
 * @prop {Array<string>} [itemBackgroundColors]
 * @prop {ItemLabelAlign} [itemLabelAlign]
 * @prop {number} [itemLabelBaselineOffset]
 * @prop {Array<string>} [itemLabelColors]
 * @prop {string} [itemLabelFont]
 * @prop {number} [itemLabelFontSizeMax]
 * @prop {number} [itemLabelRadius]
 * @prop {number} [itemLabelRadiusMax]
 * @prop {number} [itemLabelRotation]
 * @prop {string} [itemLabelStrokeColor]
 * @prop {number} [itemLabelStrokeWidth]
 * @prop {Array<ItemProps>} [items] // TODO: test
 * @prop {string} [lineColor]
 * @prop {number} [lineWidth]
 * @prop {Point} [offset] // TODO: test
 * @prop {?function(CurrentIndexChangeEvent): void} [onCurrentIndexChange] // TODO: test
 * @prop {?function(RestEvent): void} [onRest] // TODO: test
 * @prop {?function(): void} [onSpin] // TODO: test
 * @prop {?string} [overlayImage]
 * @prop {number} [pixelRatio]
 * @prop {number} [pointerAngle]
 * @prop {number} [radius]
 * @prop {number} [rotation]
 * @prop {number} [rotationResistance]
 * @prop {number} [rotationResistance]
 * @prop {number} [rotationSpeedMax]
*/

/** @type {WheelProps} */
export let WheelProps;

/**
 * @implements {IWheel}
 */
export class Wheel {

  /**
   * Create the wheel inside a container and initialise it with props.
   * @param {Element} container
   * @param {WheelProps} [props]
   */
  constructor(container, props = {}) {

    // Validate params.
    if (!(container instanceof Element)) throw new Error('container must be an instance of Element');
    if (!util.isObject(props) && props !== null) throw new Error('props must be an Object or null');

    // --------------------------------------------------
    // Init private vars.
    // --------------------------------------------------

    /**
     * @type {?number}
     * @private
     */
    this._frameRequestId = 0;

    /**
     * @type {number}
     * @private
     */
    this._rotationSpeed = 0;

    /**
     * 1 for clockwise or stationary, -1 for anti-clockwise.
     * @type {1|-1}
     * @private
     */
    this._rotationDirection = 1;

    /**
     * @type {?number}
     * @private
     */
    this._lastSpinFrameTime = null;

    /**
     * @type {boolean}
     * @private
     */
    this._isCursorOverWheel = false;

    /**
     * @type {number}
     * @private
     */
    this._actualRadius = 0;

    /**
     * @type {number}
     * @private
     */
    this._size = 0;

    /**
     * @type {number}
     * @private
     */
    this._spinToStartRotation = 0;

    /**
     * @type {number}
     * @private
     */
    this._spinToEndRotation = 0;

    /**
     * @type {number}
     * @private
     */
    this._spinToTimeStart = 0;

    /**
     * @type {?number}
     * @private
     */
    this._spinToTimeEnd = null;

    /**
     * @type {function(number): number}
     * @private
     */
    this._spinToEasingFunction = i => 0;

    /**
     * @type {number}
     * @private
     */
    this._currentIndex = -1;

    /**
     * @type {Point}
     * @private
     */
    this._center = {x: 0, y: 0};

    /**
     * @type {boolean}
     * @private
     */
    this._isInitialising = false;

    /**
     * @type {number}
     * @private
     */
    this._itemLabelFontSize = 0;

    /**
     * @type {?CanvasRenderingContext2D}
     * @private
     */
    this._context = null;

    /**
     * @type {?HTMLCanvasElement}
     * @private
     */
    this.canvas = null;

    /**
     * @type {number}
     * @private
     */
    this._labelMaxWidth = 0;

    /**
     * @type {?HTMLImageElement}
     * @private
     */
    this._imageObj = null;

    /**
     * @type {?HTMLImageElement}
     * @private
     */
    this._overlayImageObj = null;

    /**
     * @type {Array<DragEvents>}
     * @private
     */
    this._dragEvents = [];

    // --------------------------------------------------
    // Init private prop vars.
    // We only need to do this so we have nice types.
    // --------------------------------------------------

    /**
     * @type {string}
     * @private
     */
    this._borderColor = '';

    /**
     * @type {number}
     * @private
     */
    this._borderWidth = 0;

    /**
     * @type {boolean}
     * @private
     */
    this._debug = false;

    /**
     * @type {?string}
     * @private
     */
    this._image = '';

    /**
     * @type {boolean}
     * @private
     */
    this._isInteractive = false;

    /**
     * @type {Array<string>}
     * @private
     */
    this._itemBackgroundColors = [];

    /**
     * @type {ItemLabelAlign}
     * @private
     */
    this._itemLabelAlign = 'right';

    /**
     * @type {number}
     * @private
     */
    this._itemLabelBaselineOffset = 0;

    /**
     * @type {Array<string>}
     * @private
     */
    this._itemLabelColors = [];

    /**
     * @type {string}
     * @private
     */
    this._itemLabelFont = '';

    /**
     * @type {number}
     * @private
     */
    this._itemLabelFontSizeMax = 0;

    /**
     * @type {number}
     * @private
     */
    this._itemLabelRadius = 0;

    /**
     * @type {number}
     * @private
     */
    this._itemLabelRadiusMax = 0;

    /**
     * @type {number}
     * @private
     */
    this._itemLabelRotation = 0;

    /**
     * @type {string}
     * @private
     */
    this._itemLabelStrokeColor = '';

    /**
     * @type {number}
     * @private
     */
    this._itemLabelStrokeWidth = 0;

    /**
     * @type {Array<Item>}
     * @private
     */
    this._items = [];

    /**
     * @type {string}
     * @private
     */
    this._lineColor = '';

    /**
     * @type {number}
     * @private
     */
    this._lineWidth = 0;

    /**
     * @type {Point}
     * @private
     */
    this._offset = {x: 0, y: 0};

    /**
     * @type {?function(CurrentIndexChangeEvent): void}
     * @private
     */
    this._onCurrentIndexChange = i => null;

    /**
     * @type {?function(RestEvent): void}
     * @private
     */
    this._onRest = i => null;

    /**
     * @type {?function(object): void}
     * @private
     */
    this._onSpin = i => null;

    /**
     * @type {?string}
     * @private
     */
    this._overlayImage = '';

    /**
     * @type {number}
     * @private
     */
    this._pixelRatio = 0;

    /**
     * @type {number}
     * @private
     */
    this._pointerAngle = 0;

    /**
     * @type {number}
     * @private
     */
    this._radius = 0;

    /**
     * @type {number}
     * @private
     */
    this._rotation = 0;

    /**
     * @type {number}
     * @private
     */
    this._rotationResistance = 0;

    /**
     * @type {number}
     * @private
     */
    this._rotationSpeedMax = 0;

    this.add(container);

    // Assign default values.
    // This avoids null exceptions when we initialise each property one-by-one in `init()`.
    for (const i of Object.keys(Defaults.wheel)) {
      this['_' + i] = Defaults.wheel[i];
    }

    if (props) {
      this.init(props);
    } else {
      this.init(Defaults.wheel);
    }

  }

  /**
   * Initialise all properties.
   * @param {WheelProps} props
   */
  init(props = {}) {
    this._isInitialising = true;

    // @ts-ignore
    this.borderColor = props.borderColor;
    // @ts-ignore
    this.borderWidth = props.borderWidth;
    // @ts-ignore
    this.debug = props.debug;
    // @ts-ignore
    this.image = props.image;
    // @ts-ignore
    this.isInteractive = props.isInteractive;
    // @ts-ignore
    this.itemBackgroundColors = props.itemBackgroundColors;
    // @ts-ignore
    this.itemLabelAlign = props.itemLabelAlign;
    // @ts-ignore
    this.itemLabelBaselineOffset = props.itemLabelBaselineOffset;
    // @ts-ignore
    this.itemLabelColors = props.itemLabelColors;
    // @ts-ignore
    this.itemLabelFont = props.itemLabelFont;
    // @ts-ignore
    this.itemLabelFontSizeMax = props.itemLabelFontSizeMax;
    // @ts-ignore
    this.itemLabelRadius = props.itemLabelRadius;
    // @ts-ignore
    this.itemLabelRadiusMax = props.itemLabelRadiusMax;
    // @ts-ignore
    this.itemLabelRotation = props.itemLabelRotation;
    // @ts-ignore
    this.itemLabelStrokeColor = props.itemLabelStrokeColor;
    // @ts-ignore
    this.itemLabelStrokeWidth = props.itemLabelStrokeWidth;
    // @ts-ignore
    this.items = props.items;
    // @ts-ignore
    this.lineColor = props.lineColor;
    // @ts-ignore
    this.lineWidth = props.lineWidth;
    // @ts-ignore
    this.offset = props.offset;
    // @ts-ignore
    this.onCurrentIndexChange = props.onCurrentIndexChange;
    // @ts-ignore
    this.onRest = props.onRest;
    // @ts-ignore
    this.onSpin = props.onSpin;
    // @ts-ignore
    this.overlayImage = props.overlayImage;
    // @ts-ignore
    this.pixelRatio = props.pixelRatio;
    // @ts-ignore
    this.pointerAngle = props.pointerAngle;
    // @ts-ignore
    this.radius = props.radius;
    // @ts-ignore
    this.rotation = props.rotation;
    // @ts-ignore
    this.rotationResistance = props.rotationResistance;
    // @ts-ignore
    this.rotationSpeedMax = props.rotationSpeedMax;
  }

  /**
   * Add the wheel to the DOM and register event handlers.
   */
  add(container) {
    this._canvasContainer = container;
    this.canvas = document.createElement('canvas');
    this._context = this.canvas.getContext('2d');
    this._canvasContainer.append(this.canvas);
    events.register(this);
    if (this._isInitialising === false) this.resize(); // Initialise the canvas's dimensions (but not when called from the constructor).
  }

  /**
   * Remove the wheel from the DOM and unregister event handlers.
   */
  remove() {
    if (this.canvas === null) return;
    if (this._frameRequestId !== null) window.cancelAnimationFrame(this._frameRequestId);
    events.unregister(this);
    this._canvasContainer.removeChild(this.canvas);
    this._canvasContainer = null;
    this.canvas = null;
    this._context = null;
  }

  /**
   * Resize the wheel to fit inside it's container.
   * Call this after changing any property of the wheel that relates to it's size or position.
   * @private
   */
  resize() {
    if (this.canvas === null) return;

    // Set the dimensions of the canvas element to be the same as its container:
    this.canvas.style.width = this._canvasContainer.clientWidth + 'px';
    this.canvas.style.height = this._canvasContainer.clientHeight + 'px';

    // Calc the actual pixel dimensions that will be drawn:
    // See https://www.khronos.org/webgl/wiki/HandlingHighDPI
    const [w, h] = [
      this._canvasContainer.clientWidth * this.getActualPixelRatio(),
      this._canvasContainer.clientHeight * this.getActualPixelRatio(),
    ];
    this.canvas.width = w;
    this.canvas.height = h;

    // Calc the size that the wheel needs to be to fit in it's container:
    const min = Math.min(w, h);
    const wheelSize = {
      w: min - (min * this._offset.x),
      h: min - (min * this._offset.y),
    };
    const scale = Math.min(w / wheelSize.w, h / wheelSize.h);
    this._size = Math.max(wheelSize.w * scale, wheelSize.h * scale);

    // Calculate the center of the wheel:
    this._center = {
      x: w / 2 + (w * this._offset.x),
      y: h / 2 + (h * this._offset.y),
    };

    // Calculate the wheel radius:
    this._actualRadius = (this._size / 2) * this.radius;

    // Adjust the font size of labels so they all fit inside the wheel's radius:
    this._itemLabelFontSize = this.itemLabelFontSizeMax * (this._size / Constants.baseCanvasSize);
    this._labelMaxWidth = this._actualRadius * (this.itemLabelRadius - this.itemLabelRadiusMax);
    for (const item of this._items) {
      this._itemLabelFontSize = Math.min(this._itemLabelFontSize, util.getFontSizeToFit(item.label, this.itemLabelFont, this._labelMaxWidth, this._context));
    }

    this.refresh();

  }

  /**
   * Main animation loop.
   * @private
   */
  draw(now = 0) {

    this._frameRequestId = null;

    if (this._context === null || this.canvas === null) return;

    const ctx = this._context;

    // Clear canvas.
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.animateRotation(now);

    const angles = this.getItemAngles(this._rotation);

    const actualBorderWidth = this.getScaledNumber(this._borderWidth);

    // Set font:
    ctx.textBaseline = 'middle';
    ctx.textAlign = this.itemLabelAlign;
    ctx.font = this._itemLabelFontSize + 'px ' + this.itemLabelFont;

    ctx.save();

    // Build paths:
    for (const [i, a] of angles.entries()) {
      const item = this._items[i];

      const path = new Path2D();
      path.moveTo(this._center.x, this._center.y);
      path.arc(
        this._center.x,
        this._center.y,
        this._actualRadius - (actualBorderWidth / 2),
        util.degRad(a.start + Constants.arcAdjust),
        util.degRad(a.end + Constants.arcAdjust)
      );

      item.path = path;
    }

    this.drawItemBackgrounds(ctx, angles);
    this.drawItemImages(ctx, angles);
    this.drawItemLines(ctx, angles);
    this.drawItemLabels(ctx, angles);
    this.drawBorder(ctx);
    this.drawImage(ctx, this._imageObj, false);
    this.drawImage(ctx, this._overlayImageObj, true);
    this.drawPointerLine(ctx);
    this.drawDragEvents(ctx);

    this._isInitialising = false;

  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @private
   */
  drawItemBackgrounds(ctx, angles = []) {

    for (const [i, a] of angles.entries()) {

      const item = this._items[i];

      ctx.fillStyle = item.backgroundColor ?? (
        // Fall back to a value from the repeating set:
        this._itemBackgroundColors[i % this._itemBackgroundColors.length]
      );

      ctx.fill(item.path);

    }

  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @private
   */
  drawItemImages(ctx, angles = []) {

    for (const [i, a] of angles.entries()) {

      const item = this._items[i];

      if (item.imageObj === null) continue;
      if (!util.isImageLoaded(item.imageObj)) continue;

      ctx.save();

      ctx.clip(item.path);

      const angle = a.start + ((a.end - a.start) / 2);

      ctx.translate(
        this._center.x + Math.cos(util.degRad(angle + Constants.arcAdjust)) * (this._actualRadius * item.imageRadius),
        this._center.y + Math.sin(util.degRad(angle + Constants.arcAdjust)) * (this._actualRadius * item.imageRadius)
      );

      ctx.rotate(util.degRad(angle + item.imageRotation));

      ctx.globalAlpha = item.imageOpacity;

      const width = (this._size / 500) * item.imageObj.width * item.imageScale;
      const height = (this._size / 500) * item.imageObj.height * item.imageScale;
      const widthHalf = -width / 2;
      const heightHalf = -height / 2;

      ctx.drawImage(
        item.imageObj,
        widthHalf,
        heightHalf,
        width,
        height
      );

      ctx.restore();

    }

  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {?HTMLImageElement} image
   * @private
   */
  drawImage(ctx, image, isOverlay = false) {

    if (image === null) return;
    if (!util.isImageLoaded(image)) return;

    ctx.translate(
      this._center.x,
      this._center.y
    );

    if (!isOverlay) ctx.rotate(util.degRad(this._rotation));

    // Draw the image centered and scaled to fit the wheel's container:
    // For convenience, scale the 'normal' image to the size of the wheel radius
    // (so a change in the wheel radius won't require the image to also be updated).
    const size = isOverlay ? this._size : this._size * this.radius;
    const sizeHalf = -(size / 2);

    ctx.drawImage(
      image,
      sizeHalf,
      sizeHalf,
      size,
      size
    );

    ctx.resetTransform();

  }

  /**
   * @private
   */
  drawPointerLine(ctx) {

    if (!this.debug) return;

    ctx.translate(
      this._center.x,
      this._center.y
    );

    ctx.rotate(util.degRad(this._pointerAngle + Constants.arcAdjust));

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this._actualRadius * 2, 0);

    ctx.strokeStyle = Constants.Debugging.pointerLineColor;
    ctx.lineWidth = this.getScaledNumber(2);
    ctx.stroke();

    ctx.resetTransform();

  }

  /**
   * @private
   */
  drawBorder(ctx) {

    if (this._borderWidth <= 0) return;

    const actualBorderWidth = this.getScaledNumber(this._borderWidth);
    const actualBorderColor = this._borderColor || 'transparent';

    ctx.beginPath();
    ctx.strokeStyle = actualBorderColor;
    ctx.lineWidth = actualBorderWidth;
    ctx.arc(this._center.x, this._center.y, this._actualRadius - (actualBorderWidth / 2), 0, 2 * Math.PI);
    ctx.stroke();

    if (this.debug) {
      const actualDebugLineWidth = this.getScaledNumber(1);

      ctx.beginPath();
      ctx.strokeStyle = ctx.strokeStyle = Constants.Debugging.labelRadiusColor;
      ctx.lineWidth = actualDebugLineWidth;
      ctx.arc(this._center.x, this._center.y, this._actualRadius * this.itemLabelRadius, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = ctx.strokeStyle = Constants.Debugging.labelRadiusColor;
      ctx.lineWidth = actualDebugLineWidth;
      ctx.arc(this._center.x, this._center.y, this._actualRadius * this.itemLabelRadiusMax, 0, 2 * Math.PI);
      ctx.stroke();
    }

  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @private
   */
  drawItemLines(ctx, angles = []) {

    if (this._lineWidth <= 0) return;

    const actualLineWidth = this.getScaledNumber(this._lineWidth);
    const actualBorderWidth = this.getScaledNumber(this._borderWidth);

    ctx.translate(
      this._center.x,
      this._center.y
    );

    for (const angle of angles) {
      ctx.rotate(util.degRad(angle.start + Constants.arcAdjust));

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this._actualRadius - actualBorderWidth, 0);

      ctx.strokeStyle = this.lineColor;
      ctx.lineWidth = actualLineWidth;
      ctx.stroke();

      ctx.rotate(-util.degRad(angle.start + Constants.arcAdjust));
    }

    ctx.resetTransform();

  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @private
   */
  drawItemLabels(ctx, angles = []) {

    const actualItemLabelBaselineOffset = this._itemLabelFontSize * -this.itemLabelBaselineOffset;
    const actualDebugLineWidth = this.getScaledNumber(1);
    const actualLabelStrokeWidth = this.getScaledNumber(this._itemLabelStrokeWidth * 2);

    for (const [i, a] of angles.entries()) {

      const item = this._items[i];

      const actualLabelColor = item.labelColor
        || (this._itemLabelColors[i % this._itemLabelColors.length] // Fall back to a value from the repeating set.
        || 'transparent'); // Handle empty string/undefined.

      if (item.label.trim() === '' || actualLabelColor === 'transparent') continue;

      ctx.save();

      ctx.clip(item.path);

      const angle = a.start + ((a.end - a.start) / 2);

      ctx.translate(
        this._center.x + Math.cos(util.degRad(angle + Constants.arcAdjust)) * (this._actualRadius * this.itemLabelRadius),
        this._center.y + Math.sin(util.degRad(angle + Constants.arcAdjust)) * (this._actualRadius * this.itemLabelRadius)
      );

      ctx.rotate(util.degRad(angle + Constants.arcAdjust));

      ctx.rotate(util.degRad(this.itemLabelRotation));

      if (this.debug) {
        // Draw the outline of the label:
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-this._labelMaxWidth, 0);

        ctx.strokeStyle = Constants.Debugging.labelOutlineColor;
        ctx.lineWidth = actualDebugLineWidth;
        ctx.stroke();

        ctx.strokeRect(0, -this._itemLabelFontSize / 2, -this._labelMaxWidth, this._itemLabelFontSize);
      }

      if (this._itemLabelStrokeWidth > 0) {
        ctx.lineWidth = actualLabelStrokeWidth;
        ctx.strokeStyle = this._itemLabelStrokeColor;
        ctx.lineJoin = 'round';
        ctx.strokeText(item.label, 0, actualItemLabelBaselineOffset);
      }

      ctx.fillStyle = actualLabelColor;
      ctx.fillText(item.label, 0, actualItemLabelBaselineOffset);

      ctx.restore();

    }

  }

  /**
   * @private
   */
  drawDragEvents(ctx) {

    if (!this.debug || !this._dragEvents?.length) return;

    const dragEventsReversed = [...this._dragEvents].reverse();
    const actualLineWidth = this.getScaledNumber(0.5);
    const actualCircleDiameter = this.getScaledNumber(4);

    for (const [i, event] of dragEventsReversed.entries()) {
      const percent = (i / this._dragEvents.length) * 100;
      ctx.beginPath();
      ctx.arc(event.x, event.y, actualCircleDiameter, 0, 2 * Math.PI);
      ctx.fillStyle = `hsl(${Constants.Debugging.dragEventHue},100%,${percent}%)`;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = actualLineWidth;
      ctx.fill();
      ctx.stroke();
    }

  }

  /**
   * @private
   */
  animateRotation(now = 0) {

    // For spinTo()
    if (this._spinToTimeEnd !== null) {

      // Check if we should end the animation:
      if (now >= this._spinToTimeEnd) {
        this.rotation = this._spinToEndRotation;
        this._spinToTimeEnd = null;
        this.raiseEvent_onRest();
        return;
      }

      const duration = this._spinToTimeEnd - this._spinToTimeStart;
      let delta = (now - this._spinToTimeStart) / duration;
      delta = (delta < 0) ? 0 : delta; // Frame time may be before the start time.
      const distance = this._spinToEndRotation - this._spinToStartRotation;

      this.rotation = this._spinToStartRotation + distance * this._spinToEasingFunction(delta);

      this.refresh();

      return;

    }

    // For spin()
    if (this._lastSpinFrameTime !== null) {

      const delta = now - this._lastSpinFrameTime;

      if (delta > 0) {

        this.rotation += ((delta / 1000) * this._rotationSpeed) % 360; // TODO: very small rounding errors can accumulative here.
        this._rotationSpeed = this.getRotationSpeedPlusDrag(delta);

        // Check if we should end the animation:
        if (this._rotationSpeed === 0) {
          this.raiseEvent_onRest();
          this._lastSpinFrameTime = null;
        } else {
          this._lastSpinFrameTime = now;
        }

      }

      this.refresh();

    }

  }

  /**
   * @private
   */
  getRotationSpeedPlusDrag(delta = 0) {

    // Simulate drag:
    const newRotationSpeed = this._rotationSpeed + ((this.rotationResistance * (delta / 1000)) * this._rotationDirection);

    // Stop rotation once speed reaches 0.
    // Otherwise the wheel could rotate in the opposite direction next frame.
    if ((this._rotationDirection === 1 && newRotationSpeed < 0) || (this._rotationDirection === -1 && newRotationSpeed >= 0)) {
      return 0;
    }

    return newRotationSpeed;

  }

  /**
   * Spin the wheel by setting `rotationSpeed`.
   * The wheel will immediately start spinning, and slow down over time depending on the value of `rotationResistance`.
   * A positive number will spin clockwise, a negative number will spin anti-clockwise.
   */
  spin(rotationSpeed = 0) {
    if (!util.isNumber(rotationSpeed)) throw new Error('rotationSpeed must be a number');
    this._dragEvents = [];
    this.beginSpin(rotationSpeed, 'spin');
  }

  /**
   * Spin the wheel to a particular rotation.
   * The animation will occur over the provided `duration` (milliseconds).
   * The animation can be adjusted by providing an optional `easingFunction` which accepts a single parameter n, where n is between 0 and 1 inclusive.
   * If no easing function is provided, the default easeSinOut will be used.
   * For example easing functions see [easing-utils](https://github.com/AndrewRayCode/easing-utils).
   */
  spinTo(rotation = 0, duration = 0, easingFunction = null) {

    if (!util.isNumber(rotation)) throw new Error('Error: rotation must be a number');
    if (!util.isNumber(duration)) throw new Error('Error: duration must be a number');

    this.stop();

    this._dragEvents = [];

    this.animate(rotation, duration, easingFunction);

    this.raiseEvent_onSpin({method: 'spinto', targetRotation: rotation, duration});

  }

  /**
   * Spin the wheel to a particular item.
   * The animation will occur over the provided `duration` (milliseconds).
   * If `spinToCenter` is true, the wheel will spin to the center of the item, otherwise the wheel will spin to a random angle inside the item.
   * `numberOfRevolutions` controls how many times the wheel will rotate a full 360 degrees before resting on the item.
   * `direction` can be `1` (clockwise) or `-1` (anti-clockwise).
   * The animation can be adjusted by providing an optional `easingFunction` which accepts a single parameter n, where n is between 0 and 1 inclusive.
   * If no easing function is provided, the default easeSinOut will be used.
   * For example easing functions see [easing-utils](https://github.com/AndrewRayCode/easing-utils).
   */
  spinToItem(itemIndex = 0, duration = 0, spinToCenter = true, numberOfRevolutions = 1, direction = 1, easingFunction = null) {

    this.stop();

    this._dragEvents = [];

    const itemAngle = spinToCenter ? this.items[itemIndex].getCenterAngle() : this.items[itemIndex].getRandomAngle();

    let newRotation = util.calcWheelRotationForTargetAngle(this.rotation, itemAngle - this._pointerAngle, direction);
    newRotation += ((numberOfRevolutions * 360) * direction);

    this.animate(newRotation, duration, easingFunction);

    this.raiseEvent_onSpin({method: 'spintoitem', targetItemIndex: itemIndex, targetRotation: newRotation, duration});

  }

  /**
   * @private
   */
  animate(newRotation, duration, easingFunction) {
    this._spinToStartRotation = this.rotation;
    this._spinToEndRotation = newRotation;
    this._spinToTimeStart = performance.now();
    this._spinToTimeEnd = this._spinToTimeStart + duration;
    this._spinToEasingFunction = easingFunction || util.easeSinOut;
    this.refresh();
  }

  /**
   * Immediately stop the wheel from spinning, regardless of which method was used to spin it.
   */
  stop() {

    // Stop the wheel if it was spun via `spinTo()`.
    this._spinToTimeEnd = null;

    // Stop the wheel if it was spun via `spin()`.
    this._rotationSpeed = 0;
    this._lastSpinFrameTime = null;

  }

  /**
   * Return n scaled to the size of the canvas.
   * @private
   */
  getScaledNumber(n) {
    return (n / Constants.baseCanvasSize) * this._size;
  }

  /**
   * @private
   */
  getActualPixelRatio() {
    return (this._pixelRatio !== 0) ? this._pixelRatio : window.devicePixelRatio;
  }

  /**
   * Return true if the given point is inside the wheel.
   * @private
   */
  wheelHitTest(point = {x: 0, y: 0}) {
    if (this.canvas === null) return false;
    const p = util.translateXYToElement(point, this.canvas, this.getActualPixelRatio());
    return util.isPointInCircle(p, this._center.x, this._center.y, this._actualRadius);
  }

  /**
   * Refresh the cursor state.
   * Call this after the pointer moves.
   * @private
   */
  refreshCursor() {
    if (this.canvas === null) return;

    if (this.isInteractive) {

      if (this.isDragging) {
        this.canvas.style.cursor = 'grabbing';
        return;
      }

      if (this._isCursorOverWheel) {
        this.canvas.style.cursor = 'grab';
        return;
      }

    }

    this.canvas.style.cursor = '';
  }

  /**
   * Get the angle (in degrees) of the given point from the center of the wheel.
   * 0 is north.
   * @private
   */
  getAngleFromCenter(point = {x: 0, y: 0}) {
    return (util.getAngle(this._center.x, this._center.y, point.x, point.y) + 90) % 360;
  }

  /**
   * Get the index of the item that the Pointer is pointing at.
   * An item is considered "current" if `pointerAngle` is between it's start angle (inclusive)
   * and it's end angle (exclusive).
   * @returns {number}
   */
  getCurrentIndex() {
    return this._currentIndex;
  }

  /**
   * Calculate and set `currentIndex`
   * @private
   */
  refreshCurrentIndex(angles = []) {
    if (this._items.length === 0) this._currentIndex = -1;

    for (const [i, a] of angles.entries()) {

      if (!util.isAngleBetween(this._pointerAngle, a.start % 360, a.end % 360)) continue;

      if (this._currentIndex === i) break;

      this._currentIndex = i;

      if (!this._isInitialising) this.raiseEvent_onCurrentIndexChange();

      break;

    }
  }

  /**
   * Return an array of objects containing the start angle (inclusive) and end angle (inclusive) of each item.
   * @param {number} initialRotation
   * @returns {Array<{start:number, end:number}>}
   * @package
   */
  getItemAngles(initialRotation = 0) {

    let weightSum = 0;
    for (const i of this.items) {
      weightSum += i.weight;
    }
    const weightedItemAngle = 360 / weightSum;

    let itemAngle;
    let lastItemAngle = initialRotation;
    const angles = [];

    for (const item of this._items) {
      itemAngle = item.weight * weightedItemAngle;
      angles.push({
        start: lastItemAngle,
        end: lastItemAngle + itemAngle,
      });
      lastItemAngle += itemAngle;
    }

    // Ensure the difference between last angle.end and first angle.start is exactly 360 degrees.
    // Sometimes floating point arithmetic pushes the end value past 360 degrees by
    // a very small amount, which causes issues when calculating `currentIndex`.
    if (this._items.length > 1) {
      angles[angles.length - 1].end = angles[0].start + 360;
    }

    return angles;

  }

  /**
   * Schedule a redraw of the wheel on the canvas.
   * Call this after changing any property of the wheel that relates to it's appearance.
   */
  refresh() {
    if (this._frameRequestId === null) {
      this._frameRequestId = window.requestAnimationFrame(t => this.draw(t));
    }
  }

  /**
   * @private
   */
  limitSpeed(speed = 0, max = 0) {
    // Max is always a positive number, but speed may be positive or negative.
    const newSpeed = Math.min(speed, max);
    return Math.max(newSpeed, -max);
  }

  /**
   * @private
   */
  beginSpin(speed = 0, spinMethod = '') {
    this.stop();

    this._rotationSpeed = this.limitSpeed(speed, this._rotationSpeedMax);
    this._lastSpinFrameTime = performance.now();

    this._rotationDirection = (this._rotationSpeed >= 0) ? 1 : -1;

    if (this._rotationSpeed !== 0) {
      this.raiseEvent_onSpin({
        method: spinMethod,
        rotationSpeed: this._rotationSpeed,
        rotationResistance: this._rotationResistance,
      });
    }

    this.refresh();
  }

  /**
   * @private
   */
  refreshAriaLabel() {
    if (this.canvas === null) return;
    // See https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/img_role
    this.canvas.setAttribute('role', 'img');
    const wheelDescription = (this.items.length >= 2) ? ` The wheel has ${this.items.length} slices.` : '';
    this.canvas.setAttribute('aria-label', 'An image of a spinning prize wheel.' + wheelDescription);
  }

  /**
   * The [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) of the line around the circumference of the wheel.
   */
  get borderColor() {
    return this._borderColor;
  }
  set borderColor(val) {
    this._borderColor = util.setProp({
      val,
      isValid: typeof val === 'string',
      errorMessage: 'Wheel.borderColor must be a string',
      defaultValue: Defaults.wheel.borderColor,
    });

    this.refresh();
  }

  /**
   * The width (in pixels) of the line around the circumference of the wheel.
   */
  get borderWidth() {
    return this._borderWidth;
  }
  set borderWidth(val) {
    this._borderWidth = util.setProp({
      val,
      isValid: util.isNumber(val),
      errorMessage: 'Wheel.borderWidth must be a number',
      defaultValue: Defaults.wheel.borderWidth,
    });

    this.refresh();
  }

  /**
   * Show debugging info.
   * This is particularly helpful when fine-tuning labels.
   */
  get debug() {
    return this._debug;
  }
  set debug(val) {
    this._debug = util.setProp({
      val,
      isValid: typeof val === 'boolean',
      errorMessage: 'Wheel.debug must be a boolean',
      defaultValue: Defaults.wheel.debug,
    });

    this.refresh();
  }

  /**
   * The url of an image that will be drawn over the center of the wheel which will rotate with the wheel.
   * It will be automatically scaled to fit `radius`.
   */
  get image() {
    return this._image;
  }
  set image(val) {
    this._image = util.setProp({
      val,
      isValid: typeof val === 'string' || val === null,
      errorMessage: 'Wheel.image must be a url (string) or null',
      defaultValue: Defaults.wheel.image,
      action: () => {
        if (val === null) {
          this._imageObj = null;
          return null;
        }
        this._imageObj = util.loadImage(val, e => this.refresh());
        return val;
      },
    });

    this.refresh();
  }

  get imageObj() {
    return this._imageObj;
  }

  /**
   * Allow the user to spin the wheel using click-drag/touch-flick.
   * User interaction will only be detected within the bounds of `Wheel.radius`.
   */
  get isInteractive() {
    return this._isInteractive;
  }
  set isInteractive(val) {
    this._isInteractive = util.setProp({
      val,
      isValid: typeof val === 'boolean',
      errorMessage: 'Wheel.isInteractive must be a boolean',
      defaultValue: Defaults.wheel.isInteractive,
    });

    this.refreshCursor(); // Reset the cursor in case the wheel is currently being dragged.
  }

  /**
   * The [CSS colors](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) to use as a repeating pattern for the background colors of all items.
   * Overridden by `Item.backgroundColor`.
   * Example: `['#fff','#000']`.
   */
  get itemBackgroundColors() {
    return this._itemBackgroundColors;
  }
  set itemBackgroundColors(val) {
    this._itemBackgroundColors = util.setProp({
      val,
      isValid: Array.isArray(val),
      errorMessage: 'Wheel.itemBackgroundColors must be an array',
      defaultValue: Defaults.wheel.itemBackgroundColors,
    });

    this.refresh();
  }

  /**
   * The alignment of all item labels.
   * Accepted values: `'left'`,`'center'`,`'right'`.
   */
  get itemLabelAlign() {
    return this._itemLabelAlign;
  }
  set itemLabelAlign(val) {
    this._itemLabelAlign = util.setProp({
      val,
      isValid: typeof val === 'string',
      errorMessage: 'Wheel.itemLabelAlign must be a string',
      defaultValue: Defaults.wheel.itemLabelAlign,
    });

    this.refresh();
  }

  /**
   * The offset of the baseline (or line height) of all item labels (as a percent of the label's height).
   */
  get itemLabelBaselineOffset() {
    return this._itemLabelBaselineOffset;
  }
  set itemLabelBaselineOffset(val) {
    this._itemLabelBaselineOffset = util.setProp({
      val,
      isValid: util.isNumber(val),
      errorMessage: 'Wheel.itemLabelBaselineOffset must be a number',
      defaultValue: Defaults.wheel.itemLabelBaselineOffset,
    });

    this.resize();
  }

  /**
   * The [CSS colors](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) to use as a repeating pattern for the colors of all item labels.
   * Overridden by `Item.labelColor`.
   * Example: `['#fff','#000']`.
   */
  get itemLabelColors() {
    return this._itemLabelColors;
  }
  set itemLabelColors(val) {
    this._itemLabelColors = util.setProp({
      val,
      isValid: Array.isArray(val),
      errorMessage: 'Wheel.itemLabelColors must be an array',
      defaultValue: Defaults.wheel.itemLabelColors,
    });

    this.refresh();
  }

  /**
   * The font family for all item labels.
   * Overridden by `Item.labelFont`.
   * Example: `'sans-serif'`.
   */
  get itemLabelFont() {
    return this._itemLabelFont;
  }
  set itemLabelFont(val) {
    this._itemLabelFont = util.setProp({
      val,
      isValid: typeof val === 'string',
      errorMessage: 'Wheel.itemLabelFont must be a string',
      defaultValue: Defaults.wheel.itemLabelFont,
    });

    this.resize();
  }

  /**
   * The maximum font size (in pixels) for all item labels.
   */
  get itemLabelFontSizeMax() {
    return this._itemLabelFontSizeMax;
  }
  set itemLabelFontSizeMax(val) {
    this._itemLabelFontSizeMax = util.setProp({
      val,
      isValid: util.isNumber(val),
      errorMessage: 'Wheel.itemLabelFontSizeMax must be a number',
      defaultValue: Defaults.wheel.itemLabelFontSizeMax,
    });

    this.resize();
  }

  /**
   * The point along the radius (as a percent, starting from the center of the wheel)
   * to start drawing all item labels.
   */
  get itemLabelRadius() {
    return this._itemLabelRadius;
  }
  set itemLabelRadius(val) {
    this._itemLabelRadius = util.setProp({
      val,
      isValid: util.isNumber(val),
      errorMessage: 'Wheel.itemLabelRadius must be a number',
      defaultValue: Defaults.wheel.itemLabelRadius,
    });

    this.resize();
  }

  /**
   * The point along the radius (as a percent, starting from the center of the wheel)
   * to calculate the maximum font size for all item labels.
   */
  get itemLabelRadiusMax() {
    return this._itemLabelRadiusMax;
  }
  set itemLabelRadiusMax(val) {
    this._itemLabelRadiusMax = util.setProp({
      val,
      isValid: util.isNumber(val),
      errorMessage: 'Wheel.itemLabelRadiusMax must be a number',
      defaultValue: Defaults.wheel.itemLabelRadiusMax,
    });

    this.resize();
  }

  /**
   * The rotation of all item labels.
   * Use this in combination with `itemLabelAlign` to flip the labels `180°`.
   */
  get itemLabelRotation() {
    return this._itemLabelRotation;
  }
  set itemLabelRotation(val) {
    this._itemLabelRotation = util.setProp({
      val,
      isValid: util.isNumber(val),
      errorMessage: 'Wheel.itemLabelRotation must be a number',
      defaultValue: Defaults.wheel.itemLabelRotation,
    });

    this.refresh();
  }

  /**
   * The [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) of the stroke applied to the outside of the label text.
   */
  get itemLabelStrokeColor() {
    return this._itemLabelStrokeColor;
  }
  set itemLabelStrokeColor(val) {
    this._itemLabelStrokeColor = util.setProp({
      val,
      isValid: typeof val === 'string',
      errorMessage: 'Wheel.itemLabelStrokeColor must be a string',
      defaultValue: Defaults.wheel.itemLabelStrokeColor,
    });

    this.refresh();
  }

  /**
   * The width of the stroke applied to the outside of the label text.
   */
  get itemLabelStrokeWidth() {
    return this._itemLabelStrokeWidth;
  }
  set itemLabelStrokeWidth(val) {
    this._itemLabelStrokeWidth = util.setProp({
      val,
      isValid: util.isNumber(val),
      errorMessage: 'Wheel.itemLabelStrokeWidth must be a number',
      defaultValue: Defaults.wheel.itemLabelStrokeWidth,
    });

    this.refresh();
  }

  /**
   * The items to show on the wheel.
   * @returns {Array<Item>}
   */
  get items() {
    return this._items;
  }
  /**
   * @param {Array<ItemProps> | undefined} val
   */
  set items(val) {
    this._items = util.setProp({
      val,
      isValid: Array.isArray(val),
      errorMessage: 'Wheel.items must be an array of Items',
      defaultValue: Defaults.wheel.items,
      action: () => {
        const v = [];
        //@ts-ignore
        for (const item of val) {
          v.push(new Item(this, {
            backgroundColor: item.backgroundColor,
            image: item.image,
            imageRadius: item.imageRadius,
            imageRotation: item.imageRotation,
            imageScale: item.imageScale,
            label: item.label,
            labelColor: item.labelColor,
            value: item.value,
            weight: item.weight,
          }));
        }
        return v;
      },
    });

    this.refreshAriaLabel();
    this.refreshCurrentIndex(this.getItemAngles(this._rotation));
    this.resize(); // Refresh item label font size.
  }

  /**
   * The [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) of the lines between the items.
   */
  get lineColor() {
    return this._lineColor;
  }
  set lineColor(val) {
    this._lineColor = util.setProp({
      val,
      isValid: typeof val === 'string',
      errorMessage: 'Wheel.lineColor must be a string',
      defaultValue: Defaults.wheel.lineColor,
    });

    this.refresh();
  }

  /**
   * The width (in pixels) of the lines between the items.
   */
  get lineWidth() {
    return this._lineWidth;
  }
  set lineWidth(val) {
    this._lineWidth = util.setProp({
      val,
      isValid: util.isNumber(val),
      errorMessage: 'Wheel.lineWidth must be a number',
      defaultValue: Defaults.wheel.lineWidth,
    });

    this.refresh();
  }

  /**
   * The offset of the wheel relative to it's center (as a percent of the wheel's diameter).
   */
  get offset() {
    return this._offset;
  }
  set offset(val) {
    this._offset = util.setProp({
      val,
      isValid: util.isObject(val),
      errorMessage: 'Wheel.offset must be an object',
      defaultValue: Defaults.wheel.offset,
    });

    this.resize();
  }

  /**
   * The callback for the `onCurrentIndexChange` event.
   */
  get onCurrentIndexChange() {
    return this._onCurrentIndexChange;
  }
  set onCurrentIndexChange(val) {
    this._onCurrentIndexChange = util.setProp({
      val,
      isValid: typeof val === 'function' || val === null,
      errorMessage: 'Wheel.onCurrentIndexChange must be a function or null',
      defaultValue: Defaults.wheel.onCurrentIndexChange,
    });
  }

  /**
   * The callback for the `onRest` event.
   */
  get onRest() {
    return this._onRest;
  }
  set onRest(val) {
    this._onRest = util.setProp({
      val,
      isValid: typeof val === 'function' || val === null,
      errorMessage: 'Wheel.onRest must be a function or null',
      defaultValue: Defaults.wheel.onRest,
    });
  }

  /**
   * The callback for the `onSpin` event.
   */
  get onSpin() {
    return this._onSpin;
  }
  set onSpin(val) {
    this._onSpin = util.setProp({
      val,
      isValid: typeof val === 'function' || val === null,
      errorMessage: 'Wheel.onSpin must be a function or null',
      defaultValue: Defaults.wheel.onSpin,
    });
  }

  /**
   * The url of an image that will be drawn over the center of the wheel which will not rotate with the wheel.
   * It will be automatically scaled to fit the container's smallest dimension.
   * Use this to draw decorations around the wheel, such as a stand or pointer.
   */
  get overlayImage() {
    return this._overlayImage;
  }
  set overlayImage(val) {
    this._overlayImage = util.setProp({
      val,
      isValid: typeof val === 'string' || val === null,
      errorMessage: 'Wheel.overlayImage must be a url (string) or null',
      defaultValue: Defaults.wheel.overlayImage,
      action: () => {
        if (val === null) {
          this._overlayImageObj = null;
          return null;
        }
        this._overlayImageObj = util.loadImage(val, e => this.refresh());
        return val;
      },
    });

    this.refresh();
  }

  get overlayImageObj() {
    return this._overlayImageObj;
  }

  /**
   * The pixel ratio used to draw the wheel.
   * Values above 0 will produce a sharper image at the cost of performance.
   * A value of `0` will cause the pixel ratio to be automatically determined using `window.devicePixelRatio`.
   */
  get pixelRatio() {
    return this._pixelRatio;
  }
  set pixelRatio(val) {
    this._pixelRatio = util.setProp({
      val,
      isValid: util.isNumber(val),
      errorMessage: 'Wheel.pixelRatio must be a number',
      defaultValue: Defaults.wheel.pixelRatio,
    });
    this._dragEvents = [];
    this.resize();
  }

  /**
   * The angle of the Pointer which is used to determine the `currentIndex` (or the "winning" item).
   */
  get pointerAngle() {
    return this._pointerAngle;
  }
  set pointerAngle(val) {
    this._pointerAngle = util.setProp({
      val,
      isValid: util.isNumber(val) && val >= 0,
      errorMessage: 'Wheel.pointerAngle must be a number between 0 and 360',
      defaultValue: Defaults.wheel.pointerAngle,
      action: () => val % 360,
    });

    if (this.debug) this.refresh();
  }

  /**
   * The radius of the wheel (as a percent of the container's smallest dimension).
   */
  get radius() {
    return this._radius;
  }
  set radius(val) {
    this._radius = util.setProp({
      val,
      isValid: util.isNumber(val),
      errorMessage: 'Wheel.radius must be a number',
      defaultValue: Defaults.wheel.radius,
    });

    this.resize();
  }

  /**
   * The rotation (angle in degrees) of the wheel.
   * `0` is north.
   * The first item will be drawn clockwise from this point.
   */
  get rotation() {
    return this._rotation;
  }
  set rotation(val) {
    this._rotation = util.setProp({
      val,
      isValid: util.isNumber(val),
      errorMessage: 'Wheel.rotation must be a number',
      defaultValue: Defaults.wheel.rotation,
    });

    this.refreshCurrentIndex(this.getItemAngles(this._rotation));
    this.refresh();
  }

  /**
   * The amount that `rotationSpeed` will be reduced by every second.
   * Only in effect when `rotationSpeed !== 0`.
   * Set to `0` to spin the wheel infinitely.
   */
  get rotationResistance() {
    return this._rotationResistance;
  }
  set rotationResistance(val) {
    this._rotationResistance = util.setProp({
      val,
      isValid: util.isNumber(val),
      errorMessage: 'Wheel.rotationResistance must be a number',
      defaultValue: Defaults.wheel.rotationResistance,
    });
  }

  /**
   * (Readonly) How far (angle in degrees) the wheel will spin every 1 second.
   * A positive number means the wheel is spinning clockwise, a negative number means anti-clockwise, and `0` means the wheel is not spinning.
   */
  get rotationSpeed() {
    return this._rotationSpeed;
  }

  /**
   * The maximum value for `rotationSpeed` (ignoring the wheel's spin direction).
   * The wheel will not spin faster than this value in any direction.
   */
  get rotationSpeedMax() {
    return this._rotationSpeedMax;
  }
  set rotationSpeedMax(val) {
    this._rotationSpeedMax = util.setProp({
      val,
      isValid: util.isNumber(val) && val >= 0,
      errorMessage: 'Wheel.rotationSpeedMax must be a number >= 0',
      defaultValue: Defaults.wheel.rotationSpeedMax,
    });
  }

  /**
   * Enter the drag state.
   * @private
   */
  dragStart(point = {x: 0, y: 0}) {

    if (this.canvas === null) return;

    const p = util.translateXYToElement(point, this.canvas, this.getActualPixelRatio());

    this.isDragging = true;

    this.stop(); // Interrupt `spinTo()`

    this._dragEvents = [{
      distance: 0,
      x: p.x,
      y: p.y,
      now: performance.now(),
    }];

    this.refreshCursor();

  }

  /**
   * @private
   */
  dragMove(point = {x: 0, y: 0}) {

    if (this.canvas === null) return;

    const p = util.translateXYToElement(point, this.canvas, this.getActualPixelRatio());
    const a = this.getAngleFromCenter(p);

    const lastDragPoint = this._dragEvents[0];
    const lastAngle = this.getAngleFromCenter(lastDragPoint);
    const angleSinceLastMove = util.diffAngle(lastAngle, a);

    this._dragEvents.unshift({
      distance: angleSinceLastMove,
      x: p.x,
      y: p.y,
      now: performance.now(),
    });

    // Retain max 40 drag events.
    if (this.debug && this._dragEvents.length >= 40) this._dragEvents.pop();

    // Snap the wheel to the new rotation.
    this.rotation += angleSinceLastMove; // TODO: can we apply easing here so it looks nicer?

  }

  /**
   * Exit the drag state.
   * Set the rotation speed so the wheel continues to spin in the same direction.
   * @private
   */
  dragEnd() {

    this.isDragging = false;

    // Calc the drag distance:
    let dragDistance = 0;
    const now = performance.now();

    for (const [i, event] of this._dragEvents.entries()) {

      if (!this.isDragEventTooOld(now, event)) {
        dragDistance += event.distance;
        continue;
      }

      // Exclude old events:
      this._dragEvents.length = i;
      if (this.debug) this.refresh(); // Redraw drag events after trimming the array.
      break;

    }

    this.refreshCursor();

    if (dragDistance === 0) return;

    this.beginSpin(dragDistance * (1000 / Constants.dragCapturePeriod), 'interact');

  }

  /**
   * @private
   */
  isDragEventTooOld(now = 0, event = {}) {
    return (now - event.now) > Constants.dragCapturePeriod;
  }

  /**
   * @private
   */
  raiseEvent_onCurrentIndexChange() {
    this.onCurrentIndexChange?.({
      type: 'currentIndexChange',
      currentIndex: this._currentIndex,
    });
  }

  /**
   * @private
   */
  raiseEvent_onRest() {
    this.onRest?.({
      type: 'rest',
      currentIndex: this._currentIndex,
      rotation: this._rotation,
    });
  }

  /**
   * @private
   */
  raiseEvent_onSpin(data = {}) {
    this.onSpin?.({
      type: 'spin',
      ...data,
    });
  }

}
