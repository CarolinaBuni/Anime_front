import { Header } from './src/components/Header/Header';
import { Main } from './src/components/Main/Main';
import { getAnimes } from './src/pages/Animes/Animes';
import { Home } from './src/pages/Home/Home';
import './style.css'

Main();
Header();
Home();
getAnimes(true);

