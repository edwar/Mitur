function como_llegar () {
	navigator.geolocation.getCurrentPosition(success)
}
function success(pos) {
	var crd = pos.coords;
	var directionsDisplay = new google.maps.DirectionsRenderer();
	var directionsService = new google.maps.DirectionsService();
	var myLatlng = new google.maps.LatLng(crd.latitude,crd.longitude);
	var request = {
		origin: new google.maps.LatLng(crd.latitude,crd.longitude),
		destination: new google.maps.LatLng(3.41667, -76.55),
		travelMode: google.maps.DirectionsTravelMode["DRIVING"],
		unitSystem: google.maps.DirectionsUnitSystem["METRIC"],
		provideRouteAlternatives: true
	};

	var myOptions = {
		zoom: 8,
		center: myLatlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var map = new google.maps.Map($("#map_canvas").get(0), myOptions);

	var marker = new google.maps.Marker({
		position: myLatlng,
		map: map,
		title:"Hola Mundo"
	});

	directionsService.route(request, function(response, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	        directionsDisplay.setMap(map);
	        directionsDisplay.setPanel($("#panel_ruta").get(0));
	        directionsDisplay.setDirections(response);
	    } else {
	            alert("No existen rutas terrestres entre ambos puntos, debes viajar a un lugar mas cercano");
	    }
	});
}