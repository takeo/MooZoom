MooZoom
=========

MooZoom is an image zoomer used to dynamically expand thumbnail images into
full images with shadows.  Shadows are provided by the box-shadow CSS property
for browsers that support it, thus no extra images are required.  This can be a
drop-in replacement for FancyZoom, since it looks for the same DOM structures.

![Screenshot](http://luke.ehresman.org/images/screenshots/moozoom_thumb.png)

How to Use
----------

MooZoom can be initialized at any time, but it's best to initialize it on the
"domready" event.  By default, zooms will take 250ms, but you can change this with
the "duration" option.

MooZoom will look through the DOM for &lt;a&gt;&lt;img&gt;&lt;/a&gt; patterns.
The inner image should be the thumbnail version, and the href for the &lt;a&gt;
tag should be a link to the full scale version of the image.  In this way, it's
100% compatible with non-JavaScript browsers as well.

###
	<a href="/images/picture1.jpg"><img src="/images/picture1_thumb.jpg"></a>
	<a href="/images/picture2.jpg"><img src="/images/picture2_thumb.jpg"></a>
	<a href="/images/picture3.jpg"><img src="/images/picture3_thumb.jpg"></a>
	<script type="text/javascript">
		window.addEvent("domready", function() {
			new MooZoom({duration:100});
		});
	</script>
