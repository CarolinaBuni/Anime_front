import './YearFilters.css';

export const YearFilters = () => {
     // Filtro por before year
     const beforeYearInput = document.createElement( 'input' );
     beforeYearInput.type = 'number';
     beforeYearInput.placeholder = 'Before year';
     beforeYearInput.className = 'post-anime-form__input filter-input';

     // Filtro por after year
     const afterYearInput = document.createElement( 'input' );
     afterYearInput.type = 'number';
     afterYearInput.placeholder = 'After year';
     afterYearInput.className = 'post-anime-form__input filter-input';

     return { beforeYearInput, afterYearInput };
}