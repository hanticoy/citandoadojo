let formulario = document.querySelector('#formulario')

let btnAgregar = document.querySelector('#agregar')
let btnCitas = document.querySelector('#citas')

btnAgregar.addEventListener('click', function() {
    formulario.method='post'
    formulario.action='/citas'
    formulario.submit()
});

btnCitas.addEventListener('click', function() {
    formulario.method='get'    
    formulario.action='/citas'
    formulario.submit()
});


