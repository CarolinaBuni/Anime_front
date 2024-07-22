import './MessageModal.css';

export const CreateMessageModal = () => {
     const modal = document.createElement( "div" );
     modal.id = "messageModal";
     modal.className = "modal";
     modal.innerHTML = `
     <div id="modal-content-login" class="modal-content">
          <p id="modalMessage"></p>
         <span id="closeLogin" class="close">&times;</span>
     </div>
     `;
     document.body.appendChild( modal );
     return modal;
};

export const ConfigureMessageModal = ( message ) => {
     let modal = document.getElementById( 'messageModal' );
     if ( !modal ) {
          modal = CreateMessageModal();
     }

     const modalMessage = modal.querySelector( '#modalMessage' );
     const closeButton = modal.querySelector( '.close' );

     modalMessage.textContent = message;

     closeButton.addEventListener( 'click', () => modal.style.display = 'none' );

     modal.style.display = 'block';
};
