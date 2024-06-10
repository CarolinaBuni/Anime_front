import { Home } from '../../pages/Home/Home';
import { Header } from '../Header/Header';
import './Main.css';

export const Main = () => {
     const app = document.querySelector('#app');

     app.innerHTML = `
     <header></header>
     <main></main>
     <section></section>
     `
     // Inicializar el encabezado y la página principal
     Header();
     Home();
};