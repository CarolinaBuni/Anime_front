import { API } from '../../utils/API';
import './FavoriteButton.css';

export const FavoriteButton = async (event) => {
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
}