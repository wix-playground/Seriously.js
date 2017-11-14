import Seriously from '../seriously';

Seriously.target('canvas2d', function (target, options) {

	let me = this,
		canvas = target,
		gl,
		context;

	function initialize () {
		if (!context || me.initialized) {
			// not ready yet
			return;
		}

		me.initialized = true;
		me.allowRefresh = true;
		me.setReady();
	}

	if (canvas) {
		try {
			context = canvas.getContext('2d');
		} catch (ignore) {}
	}

	/*
	 * if not passed a canvas or CanvasRenderingContext2D by options and we don't have one already,
	 * throw an error
	 */
	if (!context) {
		if (me.context) {
			context = me.context;
		} else if (options) {
			if (options.context) {
				context = options.context;
			} else if (options.canvas && options.canvas.getContext) {
				try {
					context = options.canvas.getContext('2d');
				} catch (ignore) {
					// ignore
				}
			}
		}
		canvas = context.canvas;
	}

	if (context) {
		if (gl) {
			target = gl.canvas;
		} else {
			if (this.seriously.gl) {
				gl = this.seriously.gl;
				target = gl.canvas;
			} else {
				target = document.createElement('canvas');
			}
		}

		target.width = canvas.width;
		target.height = canvas.height;

		initialize();
	} else {
		throw new Error('Failed to create Canvas2D target. Missing Canvas2D context');
	}

	this.readBlob = options ? !!options.readBlob : false;
	this.ready = false;
	this.target = target;
	this.width = canvas.width;
	this.height = canvas.height;

	this.setReady = function () {
		if (this.source && this.source.ready && !this.ready) {
			this.emit('ready');
			this.ready = true;
		}
	};

	return {
		target: target,
		context: context,
		render: function () {
			let canvas = this.seriously.gl.canvas,
				img,
				async = this.readBlob,
				url;
			if (canvas && context && this.dirty && this.ready && this.source) {
				this.renderWebGL();
				this.dirty = true;

				if (typeof window.createImageBitmap === 'function') {
					// using createImageBitmap()
					window.createImageBitmap(canvas, 0, 0, this.width, this.height)
						.then(function (bitmap) {
							context.drawImage(bitmap, 0, 0, this.width, this.height);
							this.dirty = false;
							bitmap.close();
						}.bind(this), function (e) {
							Seriously.logger.error(e);
						});
				} else {
					if (async) {
						// Using canvas.toBlob() and Image().
						img = new Image();
					} else {
						// Using simple copy of WebGL canvas to the 2d canvas
						img = canvas;
					}

					img.width = this.width;
					img.height = this.height;

					var handler = function () {
						context.drawImage(img, 0, 0, this.width, this.height);

						if (async) {
							URL.revokeObjectURL(url);
						}
						// leave no trace
						img = null;

						this.dirty = false;
					};

					if (async) {
						img.onload = handler;

						canvas.toBlob(function (blob) {
							url = URL.createObjectURL(blob, 'image/png');
							img.src = url;
						});
					} else {
						handler();
					}
				}
			}
		},
		destroy: function () {
			gl = null;
			canvas = null;
			this.target = this.plugin.target = target = null;
			this.context = this.plugin.context = context = null;
		}
	}

}, {
	title: 'Canvas2D target'
});