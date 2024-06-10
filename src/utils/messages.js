export function displayMessage( form, message, type = "error" ) {
     let messageElement = document.querySelector( '#message' );
     if ( !messageElement ) {
          messageElement = document.createElement( "p" );
          messageElement.id = "message";
          form.appendChild( messageElement );
     }
     messageElement.textContent = message;
     messageElement.className = type; // Agregar clase para tipos de mensaje
};
// Función para mostrar mensajes personalizados
export const showMessagePostAnimes = ( message, type ) => {
     const messageContainer = document.getElementById( 'messageContainer' );
     messageContainer.innerHTML = `<div class="message ${ type }">${ message }</div>`;
     messageContainer.style.display = 'block'; // Mostrar el contenedor
     setTimeout( () => {
          messageContainer.style.display = 'none'; // Ocultar el contenedor
          messageContainer.innerHTML = '';
     }, 3000 );
};

export function showMessageAnime( message, type ) {
     let pError = document.querySelector( '#error' );
     if ( !pError ) {
          pError = document.createElement( "p" );
          pError.id = "error";
          document.querySelector( 'section' ).appendChild( pError );
     }
     pError.textContent = message;
     pError.className = type; // Agregar clase para tipos de mensaje

     pError.style.color = type === 'success' ? 'green' : 'red';  // Cambiar el color basado en el tipo de mensaje

     setTimeout( () => {
          pError.remove();  // Eliminar el mensaje después de 5 segundos
     }, 5000 );
};