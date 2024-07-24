import { API } from '../../utils/API';
import './WatchlistButton.css';

export const WatchlistButton = async (event) => {
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
}