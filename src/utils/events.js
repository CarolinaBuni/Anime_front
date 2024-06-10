import { filterAnimes } from "../components/AnimeFilters/AnimeFilters";
import { getAnimes } from "../pages/Animes/Animes";
import { genresList } from "../pages/PostAnimes/PostAnimes";
import { API } from "./API";
import { showMessageAnime } from "./messages";
import { createDeleteModal } from "./modals";

export const addFavorites = async ( event ) => {
     try {
          const heartIcon = event.target;
          const animeId = heartIcon.dataset.animeId;
          const user = JSON.parse( localStorage.getItem( 'user' ) );
          const userId = user._id;

          const isFavorite = user.favorites.some( fav => fav._id === animeId );

          heartIcon.src = isFavorite ? "./assets/emptyHeart.png" : "./assets/fullHeart.png";

          let newFavorites;
          if ( isFavorite ) {
               newFavorites = user.favorites.filter( fav => fav._id !== animeId );
          } else {
               newFavorites = [ ...user.favorites, { _id: animeId } ];
          }

          const data = await API( {
               endpoint: `/users/${ userId }`,
               method: 'PUT',
               payload: { favorites: newFavorites.map( fav => fav._id ) }
          } );

          if ( data.user ) {
               localStorage.setItem( 'user', JSON.stringify( data.user ) );
               heartIcon.src = data.user.favorites.some( fav => fav._id === animeId ) ? "./assets/fullHeart.png" : "./assets/emptyHeart.png";

               const watchIcon = document.querySelector( `.watch-anime[data-anime-id='${ animeId }']` );
               if ( watchIcon ) {
                    const isWatchList = data.user.watchlist.some( watch => watch._id === animeId );
                    watchIcon.src = isWatchList ? "./assets/ojo.png" : "./assets/ojoCerrado.png";
               }
          } else {
               heartIcon.src = isFavorite ? "./assets/fullHeart.png" : "./assets/emptyHeart.png";
          }
     } catch ( error ) {
          console.error( "Failed to add to favorites", error );
     }
};

export const addWatchlist = async ( event ) => {
     try {
          const watchIcon = event.target;
          const animeId = watchIcon.dataset.animeId;
          const user = JSON.parse( localStorage.getItem( 'user' ) );
          const userId = user._id;

          console.log( "User before updating watchlist:", user );
          console.log( "Anime ID:", animeId );

          const isInWatchlist = user.watchlist.some( watch => watch._id === animeId );
          watchIcon.src = isInWatchlist ? "./assets/ojoCerrado.png" : "./assets/ojo.png";

          let newWatchlist;
          if ( isInWatchlist ) {
               newWatchlist = user.watchlist.filter( watch => watch._id !== animeId );
          } else {
               newWatchlist = [ ...user.watchlist, { _id: animeId } ];
          }

          const data = await API( {
               endpoint: `/users/${ userId }`,
               method: 'PUT',
               payload: { watchlist: newWatchlist.map( watch => watch._id ) }
          } );

          if ( data.user ) {
               localStorage.setItem( 'user', JSON.stringify( data.user ) );
               watchIcon.src = data.user.watchlist.some( watch => watch._id === animeId ) ? "./assets/ojo.png" : "./assets/ojoCerrado.png";
               console.log( "User after updating watchlist:", data.user );

               const heartIcon = document.querySelector( `.heart-icon[data-anime-id='${ animeId }']` );
               if ( heartIcon ) {
                    const isFavorite = data.user.favorites.some( fav => fav._id === animeId );
                    heartIcon.src = isFavorite ? "./assets/fullHeart.png" : "./assets/emptyHeart.png";
               }
          } else {
               watchIcon.src = isInWatchlist ? "./assets/ojo.png" : "./assets/ojoCerrado.png";
          }
     } catch ( error ) {
          console.error( "Failed to add to watchlist", error );
     }
};

export const deleteAnime = async ( event ) => {
     const deleteIcon = event.target;
     const animeId = deleteIcon.dataset.animeId;

     // Crear y mostrar el modal
     let modal = document.getElementById( 'deleteModal' );
     if ( !modal ) {
          modal = createDeleteModal();
     }
     modal.style.display = 'block';

     const confirmButton = modal.querySelector( '#confirmDelete' );
     const cancelButton = modal.querySelector( '#cancelDelete' );
     const closeButton = modal.querySelector( '.close' );

     // Función para cerrar el modal
     const closeModal = () => {
          modal.style.display = 'none';
          confirmButton.removeEventListener( 'click', confirmDelete );
          cancelButton.removeEventListener( 'click', closeModal );
          closeButton.removeEventListener( 'click', closeModal );
     };

     // Función para confirmar la eliminación
     const confirmDelete = async () => {
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
          }
     };

     // Event listeners para los botones del modal
     confirmButton.addEventListener( 'click', confirmDelete );
     cancelButton.addEventListener( 'click', closeModal );
     closeButton.addEventListener( 'click', closeModal );

     // Cerrar el modal si el usuario hace clic fuera del contenido del modal
     window.onclick = ( event ) => {
          if ( event.target == modal ) {
               closeModal();
          }
     };
};

export const showEditForm = ( event, anime ) => {
     const section = document.querySelector( 'section' );
     section.className = "formSection";
     section.style.display = "block";
     section.innerHTML = `
          <div id="messageContainer" class="messageContainer"></div>
          <form id="editAnimeForm" class="post-anime-form">
               <div class="post-anime-form__field">
                    <label for="title"><svg class="icon"><use xlink:href="#icon-title"></use></svg><span class="hidden">Title</span></label>
                    <input type="text" id="title" name="title" class="post-anime-form__input" value="${ anime.title }" required>
               </div>
               <div class="post-anime-form__field">
                    <label for="synopsis"><svg class="icon"><use xlink:href="#icon-synopsis"></use></svg><span class="hidden">Synopsis</span></label>
                    <textarea id="synopsis" name="synopsis" class="post-anime-form__input" required>${ anime.synopsis }</textarea>
               </div>
               <div class="post-anime-form__field">
                    <label for="genres"><svg class="icon"><use xlink:href="#icon-genres"></use></svg><span class="hidden">Genres</span></label>
                    <select id="genres" name="genres" class="post-anime-form__input" multiple required>
                         ${ genresList.map( genre => `<option value="${ genre }" ${ anime.genres.includes( genre ) ? 'selected' : '' }>${ genre }</option>` ).join( '' ) }
                    </select>
               </div>
               <div class="post-anime-form__field">
                    <label for="episodes"><svg class="icon"><use xlink:href="#icon-episodes"></use></svg><span class="hidden">Episodes</span></label>
                    <input type="number" id="episodes" name="episodes" class="post-anime-form__input" value="${ anime.episodes }" required>
               </div>
               <div class="post-anime-form__field">
                    <label for="status"><svg class="icon"><use xlink:href="#icon-status"></use></svg><span class="hidden">Status</span></label>
                    <input type="text" id="status" name="status" class="post-anime-form__input" value="${ anime.status }" required>
               </div>
               <div class="post-anime-form__field">
                    <label for="releaseYear"><svg class="icon"><use xlink:href="#icon-releaseYear"></use></svg><span class="hidden">Release Year</span></label>
                    <input type="number" id="releaseYear" name="releaseYear" class="post-anime-form__input" value="${ anime.releaseYear }" required>
               </div>
               <div class="post-anime-form__field">
                    <label for="averageRating"><svg class="icon"><use xlink:href="#icon-averageRating"></use></svg><span class="hidden">Average Rating</span></label>
                    <input type="number" step="0.1" id="averageRating" name="averageRating" class="post-anime-form__input" value="${ anime.averageRating }" required>
               </div>
               <div class="post-anime-form__field">
                    <label for="image"><svg class="icon"><use xlink:href="#icon-image"></use></svg><span class="hidden">Image</span></label>
                    <div class="custom-file-input">
                         <input type="file" id="image" name="image" class="post-anime-form__input">
                         <span class="custom-file-label" id="file-label">Select an image</span>
                    </div>
               </div>
               <div class="post-anime-form__field">
                    <input type="submit" value="Update Anime" class="addAnime">
               </div>
               <div class="post-anime-form__field">
                    <button type="button" class="cancel-button">Cancel</button>
               </div>
          </form>
          `;

     const form = document.getElementById( 'editAnimeForm' );
     form.addEventListener( 'submit', ( e ) => editAnime( e, anime._id ) );
     const cancelButton = document.querySelector( '.cancel-button' );
     cancelButton.addEventListener( 'click', () => {
          const section = document.querySelector( 'section' );
          section.classList.remove( 'formSection' );
          section.style.display = 'flex';
          getAnimes();
     } );
};

const editAnime = async ( event, animeId ) => {
     event.preventDefault();

     const form = document.getElementById( 'editAnimeForm' );
     const formData = new FormData( form );
     const selectedGenres = Array.from( form.genres.selectedOptions ).map( option => option.value );
     formData.set( 'genres', selectedGenres.join( ',' ) );
     formData.set( 'status', form.status.value.trim() );

     try {
          const token = localStorage.getItem( 'token' );
          const response = await fetch( `https://anime-back-jet.vercel.app/api/v1/animes/${ animeId }`, {
               method: 'PUT',
               headers: {
                    'Authorization': `Bearer ${ token }`
               },
               body: formData
          } );

          if ( !response.ok ) {
               const errorData = await response.json();
               console.error( 'Server response:', errorData );
               throw new Error( 'Failed to update anime' );
          }

          showMessageAnime ( 'Anime updated successfully!', 'success', 5000 );
          form.reset();
          const section = document.querySelector( 'section' );
          section.classList.remove( 'formSection' );
          section.style.display = 'flex';
          await getAnimes( filterAnimes ); // Refresh the list of animes

     } catch ( error ) {
          console.error( error );
          showMessageAnime ( 'Error updating anime', 'error', 5000 );
     }
};