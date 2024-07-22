import './Rating.css';

export function Ratin( rating ) {
     const fullStars = Math.floor( rating / 2 );
     const halfStar = ( rating % 2 ) >= 1 ? 1 : 0;
     const emptyStars = 5 - fullStars - halfStar;

     return (
          '<img src="./assets/fullStar.png" alt="★">'.repeat( fullStars ) +
          ( halfStar ? '<img src="./assets/halfStar.png" alt="½">' : '' ) +
          '<img src="./assets/emptyStar.png" alt="☆">'.repeat( emptyStars )
     );
};