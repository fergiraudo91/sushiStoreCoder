//Este archivo simula enviar un mail con una API a un archivo php que hace algunas comprobaciones
const contactForm = document.getElementById('contact');
const respuesta = document.getElementById('respuesta');

const submitContactHandler = (e) => {
    e.preventDefault();
    let datos = new FormData(contactForm);
    fetch('../php/mail.php',{
        method: 'POST',
        body: datos
    })
    .then( res => res.json())
    .then(data => {
        if(data === 'error'){
            respuesta.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Llena todos los campos!
            </div>
            `;
        }
        else{
            respuesta.innerHTML = `
            <div class="alert alert-success" role="alert">
                ${data}
            </div>
            `;
        }
    });
    
}

contactForm.addEventListener('submit', submitContactHandler);
