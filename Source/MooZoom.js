/*
---
description: MooZoom

license:
  MIT-style

authors:
  - Luke Ehresman (http://luke.ehresman.org)

requires:
  core:1.2.1: '*'

provides: [MooZoom]

...
*/
var MooZoom = new Class({
	Implements: Options,

	elements: null,
	options: {
		duration: 250
	},

	initialize: function(options) {
		this.elements = document.getElements("a img");
		this.elements.each(function(img) {
			var a = img.getParent();
			var href = a.getProperty("href");
			var container = new Element("img", {
				src: href,
				styles: {
					"opacity": 0,
					"top": -99999,
					"left": -99999,
					"position": "absolute",
					"cursor": "pointer",
					"border": "1px solid #000"
				}
			}).inject(document.body); // preload the image

			a.setProperty("href", null);
			a.setStyle("cursor", "pointer");
			var bigCoords = null;
			var smallCoords = null;

			// grow the thumbnail
			a.addEvent("click", function(e) {
				if (!bigCoords) bigCoords = container.getCoordinates();
				if (!smallCoords) smallCoords = img.getCoordinates();

				var startWidth = (smallCoords.width/bigCoords.width) * bigCoords.width;
				var startHeight = (smallCoords.height/bigCoords.height) * bigCoords.height;
				var bodyElem = document.id(document.body);
				var endTop = bodyElem.getScroll().y + (bodyElem.getHeight() - bigCoords.height)/2;
				var endLeft = bodyElem.getScroll().x + (bodyElem.getWidth() - bigCoords.width)/2;

				var top = img.getCoordinates().top;
				container.setStyles({
					"position": "absolute",
					"top": smallCoords.top,
					"left": smallCoords.left,
					"opacity": 0,
					"width": startWidth,
					"height": startHeight
				});

				var morph = new Fx.Morph(container, {
					duration: this.options.duration,
					onComplete: function(e) {
						container.setStyles({
							"-moz-box-shadow": "0px 2px 15px #000",
							"-webkit-box-shadow": "0px 2px 15px #000"
						});
					}
				});
				morph.start({
					height: bigCoords.height,
					width: bigCoords.width,
					opacity: 1,
					top: endTop,
					left: endLeft
				});
			}.bind(this));

			// shrink the large popup image
			container.addEvent("click", function(e) {
				if (!bigCoords) bigCoords = container.getCoordinates();
				if (!smallCoords) smallCoords = img.getCoordinates();

				var endWidth = (smallCoords.width/bigCoords.width) * bigCoords.width;
				var endHeight = (smallCoords.height/bigCoords.height) * bigCoords.height;

				var morph = new Fx.Morph(container, {
					duration: this.options.duration,
					onComplete: function() {
						container.setStyles({
							"top": -99999,
							"left": -99999
						});
					}
				});
				container.setStyles({
					"-moz-box-shadow": "none",
					"-webkit-box-shadow": "none"
				});
				morph.start({
					width: endWidth,
					height: endHeight,
					opacity: 0,
					top: smallCoords.top,
					left: smallCoords.left
				});
			}.bind(this));
		}.bind(this));
	}
});
