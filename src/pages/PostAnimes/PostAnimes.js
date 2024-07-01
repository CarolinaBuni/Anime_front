import { Loading } from '../../components/Loading/Loading';
import { showMessagePostAnimes } from '../../utils/messages';
import './PostAnimes.css';


export const genresList = [
    'Action', 'Adventure', 'Science Fiction', 'Comedy', 'Drama', 'Slice of Life', 'Fantasy', 'Gore', 'Magic', 'Supernatural', 'Horror', 'Mystery', 'Psychological', 'Romance', 'Sci-Fi', 'Sports', 'Military', 'Historical', 'Thriller', 'Ecchi', 'Harem', 'Reverse Harem', 'Yaoi', 'Yuri', 'Moe', 'Shounen', 'Shoujo', 'Iyashikei', 'Seinen', 'Josei', 'Isekai', 'Magical Girl', 'Mecha', 'Cyberpunk', 'Space Opera', 'Martial Arts', 'Baseball', 'Soccer'
];
genresList.sort();

export const PostAnimes = () => {
    const section = document.querySelector('section');
    section.className = "formSection";
    section.innerHTML = `
        <h1>Add new Anime</h1>
        <div id="messageContainer" class="messageContainer"></div>
        <form id="animeForm" class="post-anime-form">
            <div class="post-anime-form__field">
                <label for="title">
                    <svg class="icon"><use xlink:href="#icon-title"></use></svg>
                    <span class="hidden">Title</span>
                </label>
                <input type="text" id="title" name="title" class="post-anime-form__input" placeholder="Title" required>
            </div>

            <div class="post-anime-form__field">
                <label for="synopsis"><svg class="icon"><use xlink:href="#icon-synopsis"></use></svg><span class="hidden">Synopsis</span></label>
                <textarea id="synopsis" name="synopsis" class="post-anime-form__input" placeholder="Synopsis" required></textarea>
            </div>

            <div class="post-anime-form__field">
                <label for="genres"><svg class="icon"><use xlink:href="#icon-genres"></use></svg><span class="hidden">Genres</span></label>
                <select id="genres" name="genres" class="post-anime-form__input" multiple required>
                    ${genresList.map(genre => `<option value="${genre}">${genre}</option>`).join('')}
                </select>
            </div>

            <div class="post-anime-form__field">
                <label for="episodes"><svg class="icon"><use xlink:href="#icon-episodes"></use></svg><span class="hidden">Episodes</span></label>
                <input type="number" id="episodes" name="episodes" class="post-anime-form__input" placeholder="Episodes" required>
            </div>

             <div class="post-anime-form__field">
                <label for="status"><svg class="icon"><use xlink:href="#icon-status"></use></svg><span class="hidden">Status</span></label>
                <select id="status" name="status" class="post-anime-form__input" required>
                    <option value="" disabled selected hidden>Status</option>
                    <option value="Airing">Airing</option>
                    <option value="Completed">Completed</option>
                    <option value="Upcoming">Upcoming</option>
                </select>
            </div>

            <div class="post-anime-form__field">
                <label for="releaseYear"> <svg class="icon"><use xlink:href="#icon-releaseYear"></use></svg><span class="hidden">Release Year</span></label>
                <input type="number" id="releaseYear" name="releaseYear" class="post-anime-form__input" placeholder="Release Year" required>
            </div>

            <div class="post-anime-form__field">
                <label for="averageRating"><svg class="icon"><use xlink:href="#icon-averageRating"></use></svg><span class="hidden">Average Rating</span></label>
                <input type="number" step="0.1" id="averageRating" name="averageRating" class="post-anime-form__input" placeholder="Average Rating" required>
            </div>

            <div class="post-anime-form__field">
                <label for="image">
                    <svg class="icon"><use xlink:href="#icon-image"></use></svg>
                    <span class="hidden">Image</span>
                </label>
                <div class="custom-file-input">
                    <input type="file" id="image" name="image" class="post-anime-form__input" required>
                    <span class="custom-file-label" id="file-label">Select an image</span>
                </div>
            </div>

            <div class="post-anime-form__field">
                <input class='addAnime' type="submit" value="Add Anime">
            </div>
        </form>
        
    `;

    const form = document.getElementById('animeForm');
    const loadingIndicator = Loading(); // Crea una instancia del componente de carga
    section.appendChild(loadingIndicator); // Añade el componente al DOM


    form.addEventListener('submit', async (e) => {
        e.preventDefault();

         // Mostrar el indicador de carga
         loadingIndicator.style.display = 'flex';

        const formData = new FormData(form);
        const selectedGenres = Array.from(form.genres.selectedOptions).map(option => option.value);
        formData.set('genres', selectedGenres.join(','));
        formData.set('status', form.status.value.trim());

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://anime-back-jet.vercel.app/api/v1/animes', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server response:', errorData);
                throw new Error('Failed to add anime');
            }

            showMessagePostAnimes ('Anime added successfully!', 'success');
            form.reset();
        } catch (error) {
            console.error(error);
            showMessagePostAnimes ('Error adding anime', 'error');
        } finally {
            loadingIndicator.style.display = 'none';
        }
    });
    
};

