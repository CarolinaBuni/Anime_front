export const createDeleteModal = () => {
     const modal = document.createElement( "div" );
     const section = document.querySelector( "section" );
     modal.id = "deleteModal";
     modal.className = "modal";
     modal.innerHTML = `
     <div class="modal-content">
          <span class="close">&times;</span>
          <p>¿Estás seguro de que deseas eliminar este anime? Esta acción no se puede deshacer.</p>
          <button id="confirmDelete" class="confirm-button">Sí, eliminar</button>
          <button id="cancelDelete" class="cancel-button">Cancelar</button>
     </div>
     `;
     section.appendChild( modal );
     return modal;
};

export const configureDeleteModal = ( message, confirmCallback ) => {
     let modal = document.getElementById( 'deleteModal' );
     if ( !modal ) {
          modal = createDeleteModal();
     }

     const modalContent = modal.querySelector( '.modal-content p' );
     const confirmButton = modal.querySelector( '#confirmDelete' );
     const cancelButton = modal.querySelector( '#cancelDelete' );
     const closeButton = modal.querySelector( '.close' );

     // Configurar el contenido del modal y el callback
     modalContent.textContent = message;

     // Limpiar cualquier evento previo
     confirmButton.replaceWith( confirmButton.cloneNode( true ) );
     cancelButton.replaceWith( cancelButton.cloneNode( true ) );
     closeButton.replaceWith( closeButton.cloneNode( true ) );

     const newConfirmButton = modal.querySelector( '#confirmDelete' );
     const newCancelButton = modal.querySelector( '#cancelDelete' );
     const newCloseButton = modal.querySelector( '.close' );

     newConfirmButton.addEventListener( 'click', confirmCallback );
     newCancelButton.addEventListener( 'click', () => modal.style.display = 'none' );
     newCloseButton.addEventListener( 'click', () => modal.style.display = 'none' );

     modal.style.display = 'block';
};

//! ----------------------------------------------------------------

export const createMessageModal = () => {
     const modal = document.createElement("div");
     modal.id = "messageModal";
     modal.className = "modal";
     modal.innerHTML = `
     <div id="modal-content-login" class="modal-content">
          <p id="modalMessage"></p>
         <span id="closeLogin" class="close">&times;</span>
     </div>
     `;
     document.body.appendChild(modal);
     return modal;
 };
 
 export const configureMessageModal = (message) => {
     let modal = document.getElementById('messageModal');
     if (!modal) {
         modal = createMessageModal();
     }
 
     const modalMessage = modal.querySelector('#modalMessage');
     const closeButton = modal.querySelector('.close');
 
     modalMessage.textContent = message;
 
     closeButton.addEventListener('click', () => modal.style.display = 'none');
 
     modal.style.display = 'block';
 };
 