import Seriously from '../seriously';

Seriously.target('canvas2d', function (target, options) {

	let me = this,
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

	/*
	 * if not passed a canvas or CanvasRenderingContext2D by options and we don't have one already,
	 * throw an error
	 */
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

	if (context) {
		initialize();
	} else {
		throw new Error('Failed to create Canvas2D target. Missing Canvas2D context');
	}

	this.ready = false;
	this.width = target.width;
	this.height = target.height;

	this.setReady = function () {
		if (this.source && this.source.ready && !this.ready) {
			this.emit('ready');
			this.ready = true;
		}
	};

	this.target = target;

	return {
		context: context,
		resize: function () {
			this.width = target.width;
			this.height = target.height;
		},
		render: function () {
			if (context && this.dirty && this.ready && this.source) {
				this.source.render();
				this.emit('render');
				context.drawImage(this.source.gl, 0, 0);
				this.dirty = false;
			}
		}
	}

}, {
	title: 'Canvas2D target'
});