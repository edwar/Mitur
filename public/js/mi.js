function coordenadas () {
	navigator.geolocation.getCurrentPosition(mapa, error);
}
function mapa (posicion)
{
	var lat = posicion.coords.latitude;
	var lon = posicion.coords.longitude;
	$("#lat").val(lat);
    $("#lon").val(lon);
}
function error(errorsh)
{
    $("#lat").val("Error");
    $("#lon").val("Error");
}
function limpiar () {
	$(".form-control").val("");
}
function tipo () {
	var select = $("select");
	var estado = $("#estado");
	var text = $("#text-disabled");
	if (select.val() === "Publicante") {
		estado.attr("disabled", "disabled");
		estado.removeAttr('checked');
		text.addClass("disabled");
	}else{
		estado.removeAttr("disabled");
		text.removeClass("disabled");
	};
}