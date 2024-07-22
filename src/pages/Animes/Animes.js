import { AnimeFilters, filterAnimes, resetFilters } from '../../components/AnimeFilters/AnimeFilters';
import { Ratin } from '../../components/Rating/Rating';
import { API } from '../../utils/API';
import { addFavorites, addWatchlist, deleteAnime, showEditForm } from '../../utils/events';
import { showAnimeDetails } from '../Anime/Anime';
import './Animes.css';



export let allAnimes = []; // Guardar todos los animes para poder filtrar

export const getAnimes = async ( includeFilters = false ) => {
     try {
          const animes = await API( {
               endpoint: "/animes",
               method: "GET"
          } );
          allAnimes = animes; 
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
          printAnimes( animes, userFavorites, userWatchlist, isAdmin, null, includeFilters );
     } catch ( error ) {
          console.error( "Failed to fetch animes:", error );
     }
};

export const printAnimes = ( animes, userFavorites = [], userWatchlist = [], isAdmin = false, containerId = null, includeFilters = false ) => {
     const sectionAnimes = containerId ? document.getElementById( containerId ) : document.querySelector( 'section' );
     if ( !sectionAnimes ) {
          console.error( `Container with id ${ containerId } not found` );
          return;
     }
     // Verificar si la lista de animes está vacía
     const hasAnimes = animes.length > 0;

     sectionAnimes.classList.remove('.anime-detail-section')
     sectionAnimes.innerHTML = ''; 

     // Añadir filtros solo si no están ya presentes y se debe incluir filtros
     if ( includeFilters && !sectionAnimes.querySelector( '.filters-container' ) ) {
          const filtersContainer = AnimeFilters( filterAnimes, resetFilters );
          sectionAnimes.insertBefore( filtersContainer, sectionAnimes.firstChild );
     }


     if ( !Array.isArray( userFavorites ) ) {
          userFavorites = [];
     }

     if ( !Array.isArray( userWatchlist ) ) {
          userWatchlist = [];
     }

     // Decidir qué contenido mostrar basado en si hay animes o no
     if ( hasAnimes ) {

          animes.forEach( anime => {
               const genresString = anime.genres.join( ' | ' );
               const starsDisplay = Ratin( anime.averageRating );
               const isFavorite = userFavorites.includes( anime._id );
               const heartIconSrc = isFavorite ? "./assets/fullHeart.png" : "./assets/emptyHeart.png";
               const isWatchList = userWatchlist.includes( anime._id );
               const watchIconSrc = isWatchList ? "./assets/ojo.png" : "./assets/ojoCerrado.png";

               const animeDiv = document.createElement( 'div' );
               animeDiv.className = 'anime';
               animeDiv.dataset.animeId = anime._id;

               const imgContainer = document.createElement( 'div' );
               imgContainer.className = 'imgContainer';
               imgContainer.addEventListener( 'click', () => showAnimeDetails( anime._id ) );

               const animeImage = document.createElement( 'img' );
               animeImage.src = anime.image;
               animeImage.alt = anime.title;

               const synopsisDiv = document.createElement( 'div' );
               synopsisDiv.className = 'synopsis';
               synopsisDiv.innerHTML = `<p>${ anime.synopsis }</p>`;

               imgContainer.appendChild( animeImage );
               imgContainer.appendChild( synopsisDiv );

               const animeInfo = document.createElement( 'div' );
               animeInfo.className = 'animeInfo';

               const titleContainer = document.createElement( 'div' );
               titleContainer.className = 'titleContainer';

               const title = document.createElement( 'h2' );
               title.textContent = anime.title;
               title.addEventListener( 'click', () => showAnimeDetails( anime._id ) );

               // const watch = document.createElement( 'img' );
               // watch.className = 'watch-anime';
               // watch.src = watchIconSrc;
               // watch.dataset.animeId = anime._id;
               // watch.addEventListener( 'click', ( event ) => addWatchlist( event ) );

               // const like = document.createElement( 'img' );
               // like.className = 'heart-icon';
               // like.src = heartIconSrc;
               // like.dataset.animeId = anime._id;
               // like.addEventListener( 'click', ( event ) => addFavorites( event ) );

               // titleContainer.appendChild( watch );
               // titleContainer.appendChild( title );
               // titleContainer.appendChild( like );
               titleContainer.appendChild(title);
               

            const token = localStorage.getItem("token");
            if (token) {
               
                const watch = document.createElement('img');
                watch.className = 'watch-anime';
                watch.src = watchIconSrc;
                watch.dataset.animeId = anime._id;
                watch.addEventListener('click', (event) => addWatchlist(event));

                const like = document.createElement('img');
                like.className = 'heart-icon';
                like.src = heartIconSrc;
                like.dataset.animeId = anime._id;
                like.addEventListener('click', (event) => addFavorites(event));

                titleContainer.appendChild(watch);
                titleContainer.appendChild(like);
            } else {
               title.style.width = 'auto';
            }

               // Si el usuario es admin, agregar el icono de eliminación
               if ( isAdmin ) {
                    const deleteIcon = document.createElement( 'img' );
                    deleteIcon.className = 'delete-icon';
                    deleteIcon.src = './assets/borrar.png'; 
                    deleteIcon.alt = 'Delete';
                    deleteIcon.dataset.animeId = anime._id;
                    deleteIcon.addEventListener( 'click', ( event ) => deleteAnime( event ) );
                    titleContainer.appendChild( deleteIcon );

                    const editIcon = document.createElement( 'img' );
                    editIcon.className = 'edit-icon';
                    editIcon.src = './assets/edit-icon.png';
                    editIcon.alt = 'Edit';
                    editIcon.dataset.animeId = anime._id;
                    editIcon.addEventListener( 'click', ( event ) => showEditForm( event, anime ) );
                    titleContainer.appendChild( editIcon );
               }

               const genres = document.createElement( 'p' );
               genres.textContent = genresString;

               const episodes = document.createElement( 'p' );
               episodes.textContent = `Episodes: ${ anime.episodes }`;

               const status = document.createElement( 'p' );
               status.textContent = `Status: ${ anime.status }`;

               const releaseYear = document.createElement( 'p' );
               releaseYear.textContent = `Release Year: ${ anime.releaseYear }`;

               const rating = document.createElement( 'p' );
               rating.innerHTML = `Rating: ${ starsDisplay }`;

               animeInfo.appendChild( titleContainer );
               animeInfo.appendChild( genres );
               animeInfo.appendChild( episodes );
               animeInfo.appendChild( status );
               animeInfo.appendChild( releaseYear );
               animeInfo.appendChild( rating );

               animeDiv.appendChild( imgContainer );
               animeDiv.appendChild( animeInfo );

               sectionAnimes.appendChild( animeDiv );
          } );
     } else if ( includeFilters ) {
          const messageDiv = document.createElement( 'div' );
          messageDiv.className = 'no-animes-message';
          messageDiv.textContent = 'No hay animes que coincidan con tus criterios de búsqueda.';
          sectionAnimes.appendChild( messageDiv );
     }
};
