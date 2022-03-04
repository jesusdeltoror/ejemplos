function cargaEdit(info){
    console.log(info);
    document.getElementById('nomEdit').value = info.nombre;
    document.getElementById('edadEdit').value = info.edad;
    document.getElementById('trabajoEdit').value = info.trabajo;
    if(info.activo){
        document.getElementById('activoEdit').checked = true;
    }
    
}

function numbInput(){
    const numb = document.getElementById('edadEdit');
}