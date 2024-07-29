import './ActionButtons.css';

export const ActionButtons = () => {
     const searchButton = document.createElement( 'input' );
     searchButton.type = 'submit';
     searchButton.value = 'Search';
     searchButton.className = 'addAnime';

     const resetButton = document.createElement( 'input' );
     resetButton.type = 'button';
     resetButton.value = 'Reset';
     resetButton.className = 'cancel-button';

     return { searchButton, resetButton };
}