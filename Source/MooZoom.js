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
		/* linkSelector: this is the first selector that is executed.  It
		 *   should return a set of link elements.  The href of these link
		 *   elements should point to a full-sized image.
		 */
		linkSelector: "a",
		/* imageSelector: on each element returned by the linkSelector,
		 *   this imageSelector will be applied to find the thumbnail image.
		 *   By default a linkSelector and imageSelector combination will be
		 *   looking for patterns like <a href=".."><img src=".."></a>
		 */
		imageSelector: "img",
		closeImageSrc: "/images/moozoom_close.png",
		transition: Fx.Transitions.linear.easeOut,
		duration: 250,
		close: "top-left"
	},

	initialize: function(options) {
		this.setOptions(options);

		this.elements = document.getElements(this.options.linkSelector);
		this.elements.each(function(a) {
			a.getElements(this.options.imageSelector).each(function(img) {
				this.setupImage(a, img);
			}.bind(this));
		}.bind(this));
	},

	setupImage: function(a, img) {
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
		if (this.options.close) {
			var close = new Element("img", {
				src: this.options.closeImageSrc,
				styles: {
					"opacity": 0,
					"top": -99999,
					"left": -99999,
					"position": "absolute",
					"cursor": "pointer"
				}
			}).inject(document.body); // preload the image
		}

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

			if (this.options.close) {
				close.setStyles({
					"top": smallCoords.top,
					"left": smallCoords.left,
					"opacity": 0,
					"width": 1,
					"height": 1
				});
				var closeTop = endTop - 10;
				var closeLeft = endLeft - 10;
				if (this.options.close == "top-right") {
					closeLeft = endLeft + bigCoords.width - 14;
				} else if (this.options.close == "bottom-left") {
					closeTop = endTop + bigCoords.height - 14;
				} else if (this.options.close == "bottom-right") {
					closeTop = endTop + bigCoords.height - 14;
					closeLeft = endLeft + bigCoords.width - 14;
				}

				var closeMorph = new Fx.Morph(close, {
					transition: this.options.transition,
					duration: this.options.duration
				});
				closeMorph.start({
					height: 24,
					width: 24,
					opacity: 1,
					top: closeTop,
					left: closeLeft
				});
			}

			var morph = new Fx.Morph(container, {
				transition: this.options.transition,
				duration: this.options.duration,
				onComplete: function(e) {
					container.setStyles({
						"-moz-box-shadow": "0px 2px 15px #000",
						"-webkit-box-shadow": "0px 2px 15px #000"
					});
				}.bind(this)
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
		var closeEvent = function(e) {
			if (!bigCoords) bigCoords = container.getCoordinates();
			if (!smallCoords) smallCoords = img.getCoordinates();

			var endWidth = (smallCoords.width/bigCoords.width) * bigCoords.width;
			var endHeight = (smallCoords.height/bigCoords.height) * bigCoords.height;

			var morph = new Fx.Morph(container, {
				transition: this.options.transition,
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
			if (this.options.close) {
				var closeMorph = new Fx.Morph(close, {
					transition: this.options.transition,
					duration: this.options.duration,
					onComplete: function() {
						close.setStyles({
							"top": -99999,
							"left": -99999
						});
					}
				});
				closeMorph.start({
					width: 1,
					height: 1,
					opacity: 0,
					top: smallCoords.top,
					left: smallCoords.left
				});
			}
			morph.start({
				width: endWidth,
				height: endHeight,
				opacity: 0,
				top: smallCoords.top,
				left: smallCoords.left
			});
			e.stopPropagation();
		}.bind(this);
		container.addEvent("click", closeEvent);

		if (this.options.close) {
			close.addEvent("click", closeEvent);
		}
	}
});
