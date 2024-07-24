import { ConfigureMessageModal } from '../MessageModal/MessageModal';
import './Message.css';

export function displayMessage( form, message, type = "error" ) {
     ConfigureMessageModal(message);
};

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