import { allAnimes, getAnimes, printAnimes } from "../../pages/Animes/Animes";
import { genresList } from "../../pages/PostAnimes/PostAnimes";
import { ActionButtons } from "../ActionButtons/ActionButtons";
import { YearFilters } from "../YearFilters/YearFilters";
import "./AnimeFilters.css";

export const AnimeFilters = ( onFilter, onReset ) => {
     const container = document.createElement( 'div' );
     container.className = 'filters-container';

     const form = document.createElement( 'form' );
     form.className = 'filters-form post-anime-form';

     const fieldContainer = document.createElement( 'div' );
     fieldContainer.className = 'post-anime-form__field';

     // Filtro por título
     const titleInput = document.createElement( 'input' );
     titleInput.type = 'text';
     titleInput.placeholder = 'Filter by title';
     titleInput.className = 'post-anime-form__input filter-input';

     // Filtro por género
     const genreSelect = document.createElement( 'select' );
     genreSelect.className = 'post-anime-form__input filter-input';
     genreSelect.innerHTML = `
          <option value="">Filter by genre</option>
          ${ genresList.map( genre => `<option value="${ genre }">${ genre }</option>` ).join( '' ) }
     `;

     // Filtro por status
     const statusSelect = document.createElement( 'select' );
     statusSelect.className = 'post-anime-form__input filter-input';
     statusSelect.innerHTML = `
          <option value="">Filter by status</option>
          <option value="Airing">Airing</option>
          <option value="Completed">Completed</option>
          <option value="Upcoming">Upcoming</option>
          `;

     // Filtro por rating
     const ratingSelect = document.createElement( 'select' );
     ratingSelect.className = 'post-anime-form__input filter-input';
     ratingSelect.innerHTML = `
          <option value="">Filter by rating</option>
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
     `;

     // Crear filtros de años
     const { beforeYearInput, afterYearInput } = YearFilters();

     // Crear botones
     const { searchButton, resetButton } = ActionButtons();

     fieldContainer.appendChild( titleInput );
     form.appendChild( genreSelect );
     form.appendChild( statusSelect );
     form.appendChild( ratingSelect );
     form.appendChild( beforeYearInput );
     form.appendChild( afterYearInput );
     form.appendChild( fieldContainer );
     form.appendChild( searchButton );
     form.appendChild( resetButton );
     container.appendChild( form );

     // Restaurar valores de filtros desde localStorage
     const savedFilters = JSON.parse( localStorage.getItem( 'animeFilters' ) );
     if ( savedFilters ) {
          titleInput.value = savedFilters.title || '';
          genreSelect.value = savedFilters.genre || '';
          statusSelect.value = savedFilters.status || '';
          ratingSelect.value = savedFilters.rating || '';
          beforeYearInput.value = savedFilters.beforeYear || '';
          afterYearInput.value = savedFilters.afterYear || '';
     }

     form.addEventListener( 'submit', ( event ) => {
          event.preventDefault();
          const title = titleInput.value.trim();
          const genre = genreSelect.value;
          const status = statusSelect.value;
          const rating = ratingSelect.value;
          const beforeYear = beforeYearInput.value;
          const afterYear = afterYearInput.value;


          const filters = { title, genre, status, rating, beforeYear, afterYear };
          localStorage.setItem( 'animeFilters', JSON.stringify( filters ) ); // Guardar filtros en localStorage
          onFilter( filters );
     } );

     resetButton.addEventListener( 'click', () => {
          titleInput.value = '';
          genreSelect.value = '';
          statusSelect.value = '';
          ratingSelect.value = '';
          beforeYearInput.value = '';
          afterYearInput.value = '';

          localStorage.removeItem( 'animeFilters' );
          onReset();
     } );

     return container;
};

export const filterAnimes = ( filters ) => {
     let filteredAnimes = allAnimes;

     if ( filters.title ) {
          filteredAnimes = filteredAnimes.filter( anime =>
               anime.title.toLowerCase().includes( filters.title.toLowerCase() )
          );
     }
     if ( filters.genre ) {
          filteredAnimes = filteredAnimes.filter( anime =>
               anime.genres.some( genre => genre === filters.genre )
          );
     }

     if ( filters.status ) {
          filteredAnimes = filteredAnimes.filter( anime =>
               anime.status === filters.status
          );
     }

     if ( filters.rating ) {
          const rating = parseInt( filters.rating );
          filteredAnimes = filteredAnimes.filter( anime =>
               Math.floor( anime.averageRating / 2 ) >= rating
          );
     }

     if ( filters.beforeYear ) {
          const beforeYear = parseInt( filters.beforeYear );
          filteredAnimes = filteredAnimes.filter( anime =>
               anime.releaseYear < beforeYear
          );
     }
     if ( filters.afterYear ) {
          const afterYear = parseInt( filters.afterYear );
          filteredAnimes = filteredAnimes.filter( anime =>
               anime.releaseYear > afterYear
          );
     }

     let userFavorites = [];
     let userWatchlist = [];
     const token = localStorage.getItem( "token" );
     let isAdmin = false;
     if ( token ) {
          const user = JSON.parse( localStorage.getItem( "user" ) );
          userFavorites = user.favorites.map( fav => fav._id );
          userWatchlist = user.watchlist.map( watch => watch._id );
          isAdmin = user.rol === 'admin';
     }
     printAnimes( filteredAnimes, userFavorites, userWatchlist, isAdmin, null, true );
};

export const resetFilters = () => {
     getAnimes( true ); 
};
