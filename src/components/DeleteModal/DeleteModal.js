import { API } from '../../utils/API';
import { Loading } from '../Loading/Loading';
import './DeleteModal.css';

export const CreateDeleteModal = () => {
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

export const ConfigureDeleteModal = ( message, confirmCallback ) => {
     let modal = document.getElementById( 'deleteModal' );
     if ( !modal ) {
          modal = CreateDeleteModal();
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

export const DeleteAnimeModal = (event) => {
     const deleteIcon = event.target;
     const animeId = deleteIcon.dataset.animeId;

     let modal = document.getElementById( 'deleteModal' );
     if ( !modal ) {
          modal = CreateDeleteModal();
     }
     modal.style.display = 'block';

     const confirmButton = modal.querySelector( '#confirmDelete' );
     const cancelButton = modal.querySelector( '#cancelDelete' );
     const closeButton = modal.querySelector( '.close' );

     const closeModal = () => {
          modal.style.display = 'none';
          confirmButton.removeEventListener( 'click', confirmDelete );
          cancelButton.removeEventListener( 'click', closeModal );
          closeButton.removeEventListener( 'click', closeModal );
     };

     // Función para confirmar la eliminación
     const confirmDelete = async () => {
          const section = document.querySelector('section');
    const loadingIndicator = Loading(); 
    section.appendChild(loadingIndicator); 
    loadingIndicator.style.display = 'flex';
          try {
               const response = await API( {
                    endpoint: `/animes/${ animeId }`,
                    method: 'DELETE'
               } );

               if ( response.message === "Anime eliminado con éxito" ) {
                    const animeDiv = document.querySelector( `div[data-anime-id='${ animeId }']` );
                    if ( animeDiv ) {
                         animeDiv.remove();
                    }
               } else {
                    console.error( "Failed to delete anime" );
               }
          } catch ( error ) {
               console.error( "Failed to delete anime", error );
          } finally {
               closeModal();
               loadingIndicator.style.display = 'none';
          }
     };

     confirmButton.addEventListener( 'click', confirmDelete );
     cancelButton.addEventListener( 'click', closeModal );
     closeButton.addEventListener( 'click', closeModal );

     window.onclick = ( event ) => {
          if ( event.target == modal ) {
               closeModal();
          }
     };
}