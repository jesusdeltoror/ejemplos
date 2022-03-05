//Carga de Información de datos en formulario de edición
function cargaEdit(info){
    console.log(info);
    document.querySelector('#nomEdit').value = info.nombre;
    document.querySelector('#edadEdit').value = info.edad;
    document.querySelector('#trabajoEdit').value = info.trabajo;
    if(info.activo == "true"){
        document.querySelector('#activoEdit').checked = true;
    }
    let controls = document.querySelector('#editForm')
    let inputs = document.querySelectorAll('input');
    for(let i=0;i<inputs.length;i++){
        inputs[i].disabled=false;
    }
}

//Limitar un input number para mostrar únicamente de 0-9
document.querySelector(".valNum").addEventListener("keypress", function(evt){
    if(evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57){
        evt.preventDefault();
    }
});