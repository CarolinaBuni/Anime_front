import { getAnimes } from '../Animes/Animes';
import './Home.css';

export const Home = () => {
     const main = document.querySelector( 'main' );


     main.innerHTML = `
     <h2>
     Si eres un apasionado del anime, has llegado al lugar indicado. En Anime House, nos dedicamos a compartir contigo lo mejor del mundo del anime. Nuestra misión es ofrecerte información detallada y actualizada sobre tus series y películas de anime favoritas, así como descubrirte nuevas joyas que no te puedes perder.
     Nuestro objetivo es crear un espacio donde todos los otakus puedan disfrutar y compartir su pasión por el anime. Esperamos que disfrutes de tu estancia y encuentres toda la información que necesitas para tu próximo maratón de anime.
     <br>
     <br>
     ¡Gracias por visitarnos y no olvides seguirnos en nuestras redes sociales para estar siempre al día con nuestras actualizaciones!</h2>
     `;

     const section = document.querySelector('section');
     section.classList.remove('anime-detail-section');

     getAnimes(true);
};