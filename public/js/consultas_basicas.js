//Carga de Información de datos en formulario de edición
function cargaEdit(info){
    console.log(info);
    document.getElementById('nomEdit').value = info.nombre;
    document.getElementById('edadEdit').value = info.edad;
    document.getElementById('trabajoEdit').value = info.trabajo;
    if(info.activo == "true"){
        document.getElementById('activoEdit').checked = true;
    }
    let controls = document.querySelector('#editForm').getElementsByTagName('input');
    console.log(controls);
    for(let i=0;i<controls.length;i++){
        controls[i].disabled=false;
    }
}

//Limitar un input number para mostrar únicamente de 0-9
document.querySelector(".valNum").addEventListener("keypress", function(evt){
    if(evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57){
        evt.preventDefault();
    }
});