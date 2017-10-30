import Seriously from '../seriously';

Seriously.source('imagebitmap', function (source) {
	if (source instanceof window.ImageBitmap) {

		this.width = source.width;
		this.height = source.height;

		return {
			render: function (gl) {
				if (this.dirty) {
					gl.bindTexture(gl.TEXTURE_2D, this.texture);
					gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.flip);
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
					this.lastRenderTime = Date.now() / 1000;
					return true;
				}
			}
		};
	}
}, {
	title: 'ImageBitmap',
	description: 'ImageBitmap created using createImageBitmap() or OffscreenCanvas.transferToImageBitmap()'
});
