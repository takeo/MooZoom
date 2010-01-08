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
		linkSelector: "a",
		imageSelector: "img",
		imageRoot: "/images/",
		transition: Fx.Transitions.linear.easeOut,
		duration: 250,
		close: "top-left"
	},

	/**
	 * Method: initialize
	 *
	 * Discover all the thumbnail images that match the selector patterns
	 * and rework them in the DOM so they use the MooZoom niftiness.
	 */
	initialize: function(options) {
		this.setOptions(options);
		if (this.options.imageRoot[this.options.imageRoot.length-1] != "/")
			this.options.imageRoot += "/";

		this.elements = document.getElements(this.options.linkSelector);
		this.elements.each(function(a) {
			a.getElements(this.options.imageSelector).each(function(img) {
				this.setupImage(a, img);
			}.bind(this));
		}.bind(this));
	},

	/**
	 * Method: setupImage
	 *
	 * Given a link to a big image (a) and a thumbnail image (img), do
	 * the magic necessary to make the MooZoom thing work.
	 */
	setupImage: function(a, img) {
		var href = a.getProperty("href");
		a.setProperty("href", null);
		a.setStyle("cursor", "pointer");

		// preload the larger image
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
		}).inject(document.body);

		// preload the close icon
		if (this.options.close) {
			var close = new Element("img", {
				src: this.options.imageRoot+"/moozoom_close.png",
				styles: {
					"opacity": 0,
					"top": -99999,
					"left": -99999,
					"position": "absolute",
					"cursor": "pointer"
				}
			}).inject(document.body); // preload the image
		}

		var bigCoords = null;
		var smallCoords = null;

		// grow the thumbnail
		a.addEvent("click", function(e) {
			// lazy load these values.
			// they won't be set until the image has finished loading, so we
			// can't call these until the image is loaded and injected into
			// the DOM.  This code assumes when they click on the thumbnail,
			// that the larger image has finished loading.
			if (!bigCoords) bigCoords = {width: container.width, height: container.height};
			if (!smallCoords) smallCoords = img.getCoordinates();

			var startWidth = (smallCoords.width/bigCoords.width) * bigCoords.width;
			var startHeight = (smallCoords.height/bigCoords.height) * bigCoords.height;
			var bodyElem = document.id(document.body);
			var endTop = bodyElem.getScroll().y + (bodyElem.getHeight() - bigCoords.height)/2;
			var endLeft = bodyElem.getScroll().x + (bodyElem.getWidth() - bigCoords.width)/2;

			// handle the close icon if it's supposed to be displayed.
			// this.options.close will be null if it shouldn't be displayed.
			if (this.options.close) {
				// define the location of the close button
				var closeTop = endTop - 10;
				var closeLeft = endLeft - 10;
				switch (this.options.close) {
					case "bottom-right":
						closeTop = endTop + bigCoords.height - 14;
						closeLeft = endLeft + bigCoords.width - 14;
						break;
					case "bottom-left":
						closeTop = endTop + bigCoords.height - 14;
						break;
					case "top-right":
						closeLeft = endLeft + bigCoords.width - 14;
						break;
				}

				// set initial placement of the close icon
				close.setStyles({
					"top": smallCoords.top,
					"left": smallCoords.left,
					"opacity": 0,
					"width": 1,
					"height": 1
				});
				// start the close icon growing animation
				new Fx.Morph(close, {
					transition: this.options.transition,
					duration: this.options.duration
				}).start({
					height: 24,
					width: 24,
					opacity: 1,
					top: closeTop,
					left: closeLeft
				});
			}

			// set initial placement of the image
			container.setStyles({
				"position": "absolute",
				"top": smallCoords.top,
				"left": smallCoords.left,
				"opacity": 0,
				"width": startWidth,
				"height": startHeight
			});
			// start the image growing animation
			new Fx.Morph(container, {
				transition: this.options.transition,
				duration: this.options.duration,
				onComplete: function(e) {
					// when the animation is complete, display the shadow.
					// this is done at the end for performance reasons because
					// the animation with the shadow is dog-slow on all browsers.
					container.setStyles({
						"-moz-box-shadow": "0px 2px 15px #000",
						"-webkit-box-shadow": "0px 2px 15px #000"
					});
				}.bind(this)
			}).start({
				height: bigCoords.height,
				width: bigCoords.width,
				opacity: 1,
				top: endTop,
				left: endLeft
			});
		}.bind(this));

		// create the event handler to shring the displayed image preview
		var closeEvent = function(e) {
			// lazy load these values, if they haven't already been set
			if (!bigCoords) bigCoords = {width: container.width, height: container.height};
			if (!smallCoords) smallCoords = img.getCoordinates();

			var endWidth = (smallCoords.width/bigCoords.width) * bigCoords.width;
			var endHeight = (smallCoords.height/bigCoords.height) * bigCoords.height;

			// turn off the shadows, because they slow down the animation
			container.setStyles({
				"-moz-box-shadow": "none",
				"-webkit-box-shadow": "none"
			});

			// star the close icon shrinking animation
			if (this.options.close) {
				new Fx.Morph(close, {
					transition: this.options.transition,
					duration: this.options.duration,
					onComplete: function() {
						close.setStyles({
							"top": -99999,
							"left": -99999
						});
					}
				}).start({
					width: 1,
					height: 1,
					opacity: 0,
					top: smallCoords.top,
					left: smallCoords.left
				});
			}

			// start the image shrinking animation
			new Fx.Morph(container, {
				transition: this.options.transition,
				duration: this.options.duration,
				onComplete: function() {
					container.setStyles({
						"top": -99999,
						"left": -99999
					});
				}
			}).start({
				width: endWidth,
				height: endHeight,
				opacity: 0,
				top: smallCoords.top,
				left: smallCoords.left
			});

			e.stopPropagation();
		}.bind(this);

		// attach the shrink event to the various elements
		container.addEvent("click", closeEvent);
		if (this.options.close) {
			close.addEvent("click", closeEvent);
		}
	}
});
