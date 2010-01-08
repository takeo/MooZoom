MooZoom
=========

MooZoom is an image zoomer used to dynamically expand thumbnail images into
full images with shadows.  Shadows are provided by the box-shadow CSS property
for browsers that support it, thus no extra images are required.  This can be a
drop-in replacement for FancyZoom, since it looks for the same DOM structures.

Compatible with all modern browsers and IE6.

![Screenshot](http://luke.ehresman.org/images/screenshots/moozoom_thumb.png)

How to Use
----------

MooZoom can be initialized at any time, but it's best to initialize it on the
"domready" event.  By default, zooms will take 250ms, but you can change this with
the "duration" option.  The "close" option can be set to "none", "top-left",
"top-right", "bottom-left", or "bottom-right" to specify where and if the close
button should be displayed.  By default it displays in the top-left corner.
The "transition" option can be used to override the default Fx.Transition.

Important note: The close button image is located in the Images directory.
By default, MooZoom will attempt to find that image at /images/moozoom_close.png.
If you want the image located elsewhere, use the "imageRoot" option.

MooZoom will look through the DOM for &lt;a&gt;&lt;img&gt;&lt;/a&gt; patterns.
The inner image should be the thumbnail version, and the href for the &lt;a&gt;
tag should be a link to the full scale version of the image.  In this way, it's
100% compatible with non-JavaScript browsers as well.

	<a href="/images/picture1.jpg"><img src="/images/picture1_thumb.jpg"></a>
	<a href="/images/picture2.jpg"><img src="/images/picture2_thumb.jpg"></a>
	<a href="/images/picture3.jpg"><img src="/images/picture3_thumb.jpg"></a>
	<script type="text/javascript">
		window.addEvent("domready", function() {
			new MooZoom({
				duration: 150,
				imageRoot: "/images/plugins/"
			});
		});
	</script>

Options
-------

* **duration**: (int) number of ms for the open and close animation. defualt: 250
* **imageRoot**: (string) location of the close icon.  default: /images/
* **close**: (string) position of the close button.  possible values: "top-left", "top-right", "bottom-left", "bottom-right", and null.  If null, no close button will be displayed.
* **linkSelector**: (string) this is the first selector that is executed. It should return a set of link elements. The href of these link elements should point to a full-sized image. Default: "a"
* **imageSelector**: (string) on each element returned by the linkSelector, this imageSelector will be applied to find the thumbnail image element. By default a linkSelector and imageSelector combination will be looking for patterns like &lt;a href=".."&gt;&lt;img src=".."&gt;&lt;/a&gt;. Default: "img"
