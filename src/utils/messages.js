export function displayMessage( form, message, type = "error" ) {
     let messageElement = document.querySelector( '#message' );
     if ( !messageElement ) {
          messageElement = document.createElement( "p" );
          messageElement.id = "message";
          form.appendChild( messageElement );
     }
     messageElement.textContent = message;
     messageElement.className = type; 
};
// Función para mostrar mensajes personalizados
export const showMessagePostAnimes = ( message, type ) => {
     const messageContainer = document.getElementById( 'messageContainer' );
     messageContainer.innerHTML = `<div class="message ${ type }">${ message }</div>`;
     messageContainer.style.display = 'block'; 
     setTimeout( () => {
          messageContainer.style.display = 'none'; 
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
     pError.className = type; 

     pError.style.color = type === 'success' ? 'green' : 'red'; 

     setTimeout( () => {
          pError.remove();  
     }, 5000 );
};