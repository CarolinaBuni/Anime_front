// import { getAnimes } from '../../pages/Animes/Animes';
// import { genresList } from '../../pages/PostAnimes/PostAnimes';
// import { API } from '../../utils/API';
// import { Loading } from '../Loading/Loading';
// import { showMessageAnime } from '../Messages/Message';
// import './EditAnimeForm.css';


// export const EditAnimeForm = (anime, submitCallback) => {
//      const section = document.querySelector( 'section' );
//      section.className = "formSection";
//      section.style.display = "block";
//      section.innerHTML = `
//           <div id="messageContainer" class="messageContainer"></div>
//           <form id="editAnimeForm" class="post-anime-form">
//                <div class="post-anime-form__field">
//                     <label for="title"><svg class="icon"><use xlink:href="#icon-title"></use></svg><span class="hidden">Title</span></label>
//                     <input type="text" id="title" name="title" class="post-anime-form__input" value="${ anime.title }" required>
//                </div>
//                <div class="post-anime-form__field">
//                     <label for="synopsis"><svg class="icon"><use xlink:href="#icon-synopsis"></use></svg><span class="hidden">Synopsis</span></label>
//                     <textarea id="synopsis" name="synopsis" class="post-anime-form__input" required>${ anime.synopsis }</textarea>
//                </div>
//                <div class="post-anime-form__field">
//                     <label for="genres"><svg class="icon"><use xlink:href="#icon-genres"></use></svg><span class="hidden">Genres</span></label>
//                     <select id="genres" name="genres" class="post-anime-form__input" multiple required>
//                          ${ genresList.map( genre => `<option value="${ genre }" ${ anime.genres.includes( genre ) ? 'selected' : '' }>${ genre }</option>` ).join( '' ) }
//                     </select>
//                </div>
//                <div class="post-anime-form__field">
//                     <label for="episodes"><svg class="icon"><use xlink:href="#icon-episodes"></use></svg><span class="hidden">Episodes</span></label>
//                     <input type="number" id="episodes" name="episodes" class="post-anime-form__input" value="${ anime.episodes }" required>
//                </div>
//                <div class="post-anime-form__field">
//                     <label for="status"><svg class="icon"><use xlink:href="#icon-status"></use></svg><span class="hidden">Status</span></label>
//                     <input type="text" id="status" name="status" class="post-anime-form__input" value="${ anime.status }" required>
//                </div>
//                <div class="post-anime-form__field">
//                     <label for="releaseYear"><svg class="icon"><use xlink:href="#icon-releaseYear"></use></svg><span class="hidden">Release Year</span></label>
//                     <input type="number" id="releaseYear" name="releaseYear" class="post-anime-form__input" value="${ anime.releaseYear }" required>
//                </div>
//                <div class="post-anime-form__field">
//                     <label for="averageRating"><svg class="icon"><use xlink:href="#icon-averageRating"></use></svg><span class="hidden">Average Rating</span></label>
//                     <input type="number" step="0.1" id="averageRating" name="averageRating" class="post-anime-form__input" value="${ anime.averageRating }" required>
//                </div>
//                <div class="post-anime-form__field">
//                     <label for="image"><svg class="icon"><use xlink:href="#icon-image"></use></svg><span class="hidden">Image</span></label>
//                     <div class="custom-file-input">
//                          <input type="file" id="image" name="image" class="post-anime-form__input">
//                          <span class="custom-file-label" id="file-label">Select an image</span>
//                     </div>
//                </div>
//                <div class="post-anime-form__field">
//                     <input type="submit" value="Update Anime" class="addAnime">
//                </div>
//                <div class="post-anime-form__field">
//                     <button type="button" class="cancel-button">Cancel</button>
//                </div>
//           </form>
//           `;

//      const form = document.getElementById( 'editAnimeForm' );
//      form.addEventListener( 'submit', ( e ) => editAnime( e, anime._id ) );
//      const cancelButton = document.querySelector( '.cancel-button' );
//      cancelButton.addEventListener( 'click', () => {
//           const section = document.querySelector( 'section' );
//           section.classList.remove( 'formSection' );
//           section.style.display = 'flex';
//           getAnimes(filterAnimes);
//      } );
// };



import { getAnimes } from '../../pages/Animes/Animes';
import { genresList } from '../../pages/PostAnimes/PostAnimes';
import { API } from '../../utils/API';
import { filterAnimes } from '../AnimeFilters/AnimeFilters';
import { Loading } from '../Loading/Loading';
import { showMessageAnime } from '../Messages/Message';
import './EditAnimeForm.css';

export const EditAnimeForm = ( anime, submitCallback ) => {
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
                    ${ Array.isArray( anime.genres ) ? genresList.map( genre => `<option value="${ genre }" ${ anime.genres.includes( genre ) ? 'selected' : '' }>${ genre }</option>` ).join( '' ) : '' }
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
    form.addEventListener( 'submit', ( e ) => submitCallback( e, anime._id ) );

    const cancelButton = document.querySelector( '.cancel-button' );
    cancelButton.addEventListener( 'click', () => {
        section.classList.remove( 'formSection' );
        section.style.display = 'flex';
        getAnimes( filterAnimes );
    } );
};


export const editAnime = async ( event, animeId ) => {
    event.preventDefault();

    const form = document.getElementById( 'editAnimeForm' );
    const formData = new FormData( form );
    const selectedGenres = Array.from( form.genres.selectedOptions ).map( option => option.value );
    formData.set( 'genres', selectedGenres.join( ',' ) );
    formData.set( 'status', form.status.value.trim() );

    const section = document.querySelector( 'section' );
    const loadingIndicator = Loading(); 
    section.appendChild( loadingIndicator ); 
    loadingIndicator.style.display = 'flex';

    try {

        await API( {
            endpoint: `/animes/${ animeId }`,
            method: 'PUT',
            payload: formData
        } );

        form.reset();
        const section = document.querySelector( 'section' );
        section.classList.remove( 'formSection' );
        section.style.display = 'flex';
        await getAnimes( filterAnimes );

    } catch ( error ) {
        console.error( error );
        showMessageAnime( 'Error updating anime', 'error', 5000 );
    }
};