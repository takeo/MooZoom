<html>
<body>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/mootools/1.2.4/mootools-yui-compressed.js"></script>
<script type="text/javascript" src="../Source/MooZoom.js"></script>

<p style="text-align: center; font-size: 14pt;">
Click on the thumbnail images.
</p>

<a href="project-neobudget.jpg">
<img border="0" height="200" width="200" src="project-neobudget-thumb.jpg" />
</a>

<div style="margin-top:300px; float:right">
	<a href="project-neobudget.jpg">
	<img border="0" height="200" width="200" src="project-neobudget-thumb.jpg" />
	</a>
</div>

<script type="text/javascript">
	window.addEvent("domready", function() {
			new MooZoom({
				duration: 200,
				imageRoot: "../Images"
			});
		});
</script>

</body>
</html>
