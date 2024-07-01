import './Loading.css';

export const Loading = () => {
     const loadingDiv = document.createElement( 'div' );
     loadingDiv.className = 'loadingIndicator';
     loadingDiv.innerHTML = `
          <img src='/assets/loadingAnime.gif' />
     `;
     return loadingDiv;
};