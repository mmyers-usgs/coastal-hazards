
<%
	String debug = Boolean.parseBoolean(request.getParameter("debug-qualifier")) ? "" : ".min";
%>
<script type="text/javascript" src="${param['relPath']}js/iosslider/jquery.iosslider<%= debug%>.js"></script>
<style type="text/css">
	/* slider container */
	.iosSlider {
		/* required */
		position: relative;
		top: 0;
		left: 0;
		overflow: hidden;
	}

	/* slider */
	.slider {
		/* required */
		width: 100%;
		height: 100%;
	}

	/* slide */
	.iosSlider .slider .slide {
		/* required */
		float: left;
		position: relative;
	}

</style>