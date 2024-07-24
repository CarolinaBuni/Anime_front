import { ConfigureDeleteModal } from '../../components/DeleteModal/DeleteModal';
import { Loading } from '../../components/Loading/Loading';
import { displayMessage, showMessageAnime } from '../../components/Messages/Message';
import { Ratin } from '../../components/Rating/Rating';
import { API } from '../../utils/API';
import { getAnimes } from '../Animes/Animes';
import './Anime.css';

export const showAnimeDetails = async (animeId, includeFilters) => {
    try {
        const response = await API({
            endpoint: `/animes/${animeId}`,
            method: 'GET'
        });

        console.log('Anime fetched:', response);

        if (!response.anime || !response.comments) {
            throw new Error('Anime data is incomplete');
        }

        const { anime, comments } = response;
        const user = JSON.parse(localStorage.getItem('user'));
        const isAdmin = user && user.rol === 'admin';

        const section = document.querySelector('section');
        section.classList.add('anime-detail-section');
        section.innerHTML = `
            <div class="anime-details" data-anime-id="${anime._id}">
                <section class="anime-container">
                    <h1>${anime.title || 'Title not available'}</h1>
                    <img class="anime-image" src="${anime.image || ''}" alt="${anime.title || 'Image not available'}" />
                    <p><strong>Synopsis:</strong> ${anime.synopsis || 'Synopsis not available'}</p>
                    <p><strong>Genres:</strong> ${anime.genres && anime.genres.length > 0 ? anime.genres.join(', ') : 'Genres not available'}</p>
                    <p><strong>Episodes:</strong> ${anime.episodes || 'N/A'}</p>
                    <p><strong>Status:</strong> ${anime.status || 'Status not available'}</p>
                    <p><strong>Release Year:</strong> ${anime.releaseYear || 'N/A'}</p>
                    <p><strong>Average Rating:</strong> ${anime.averageRating || 'N/A'}</p>
                    <button id="backButton" class="back-button">Back to Animes</button>
                </section>

                <h2>Comments</h2>
                <div class="comments-section">
                    ${comments.map(comment => formatComment(comment, isAdmin, user)).join('')}
                </div>
            </div>
        `;

        if (localStorage.getItem('token')) {
            section.innerHTML += `
                <div class="comment-form">
                    <input type="text" id="commentTitle" placeholder="Title" required />
                    <textarea id="commentText" placeholder="Add your comment here" required></textarea>
                    <input type="number" id="commentRating" placeholder="Rating" min="0" max="10" step="0.1" required>
                    <button id="submitComment">Submit Comment</button>
                </div>
            `;

            document.getElementById('submitComment').addEventListener('click', () => submitComment(animeId));
        }

        document.getElementById('backButton').addEventListener('click', () => {
            section.classList.remove('anime-detail-section');
            getAnimes(true);
            
            });
        ;
    } catch (error) {
        console.error('Failed to fetch anime details:', error);
        showMessageAnime ('Failed to fetch anime details', 'error');
    }
};


const formatComment = (comment, isAdmin, user) => {
    const formattedDate = new Date(comment.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    const userName = comment.user ? comment.user.userName.charAt(0).toUpperCase() + comment.user.userName.slice(1) : 'Unknown User';
    const isOwner = user && comment.user._id === user._id;

    return `
        <div class="comment" data-comment-id="${comment._id}">
            <div class="comment-header">
                <span class="comment-user">${userName}</span> <span class="comment-date">${formattedDate}</span>
                
            </div>
            <div class="comment-body">
                <p class="comment-title">${comment.title}</p>
                ${(isOwner) ? `<img src="./assets/edit-icon.png" alt="Edit" class="edit-comment-icon" data-comment-id="${comment._id}" data-anime-id="${comment.anime}">` : ''}
                ${(isAdmin || isOwner) ? `<img src="./assets/borrar.png" alt="Delete" class="delete-comment-icon" data-comment-id="${comment._id}" data-anime-id="${comment.anime}">` : ''}
                <p>${comment.text}</p>
                <div class="comment-rating">${Ratin(comment.rating)}</div>
            </div>
        </div>
    `;
};

const submitComment = async (animeId, form) => {
    const title = document.getElementById('commentTitle').value;
    const text = document.getElementById('commentText').value;
    const rating = parseFloat(document.getElementById('commentRating').value);

    if (!title || !text || isNaN(rating) || rating < 0 || rating > 10) {
        displayMessage( form, 'Please enter a valid title, comment and rating.');
        return;
    }

    const section = document.querySelector('section');
    const loadingIndicator = Loading(); // Crea una instancia del componente de carga
    section.appendChild(loadingIndicator); // Añade el componente al DOM
    loadingIndicator.style.display = 'flex';

    try {
        const token = localStorage.getItem('token');
        const response = await API({
            endpoint: `/comments`,
            method: 'POST',
            payload: { anime: animeId, title, text, rating }
        });

        console.log('Response data:', response);

        if (response.message !== 'Comentario creado exitosamente') {
            console.error('Server response:', response);
            throw new Error('Failed to submit comment');
        }

        showMessageAnime ('Comment submitted successfully!', 'success');
        showAnimeDetails(animeId); // Refresh the anime details
    } catch (error) {
        console.error('Failed to submit comment:', error);
        showMessageAnime ('Failed to submit comment', 'error');
    }
};

document.addEventListener('click', async (event) => {
    
    if (event.target.classList.contains('delete-comment-icon')) {
        const commentId = event.target.dataset.commentId;
        const animeId = document.querySelector('.anime-details').dataset.animeId; 

        // Función para confirmar la eliminación
        const confirmDeleteComment = async () => {
            

            
            try {
                const token = localStorage.getItem('token');
                const response = await API({
                    endpoint: `/comments/${commentId}`,
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log('Response data:', response);

                if (response.message !== 'Comentario eliminado exitosamente') {
                    console.error('Server response:', response);
                    throw new Error('Failed to delete comment');
                }

                showMessageAnime ('Comment deleted successfully!', 'success');
                showAnimeDetails(animeId); // Refresh the anime details
            } catch (error) {
                console.error('Failed to delete comment:', error);
                showMessageAnime ('Failed to delete comment', 'error');
            } finally {
                const modal = document.getElementById('deleteModal');
                modal.style.display = 'none';
            }
        };

        // Configurar y mostrar el modal de eliminación
        ConfigureDeleteModal('¿Estás seguro de que deseas eliminar este comentario? Esta acción no se puede deshacer.', confirmDeleteComment);
    }

    if (event.target.classList.contains('edit-comment-icon')) {
        const commentId = event.target.dataset.commentId;
        const animeId = event.target.dataset.animeId; // Retrieve animeId from data attribute
        const commentDiv = document.querySelector(`.comment[data-comment-id="${commentId}"]`);
        const commentTitle = commentDiv.querySelector('.comment-title').textContent;
        const commentText = commentDiv.querySelector('.comment-body > p').textContent;
        const commentRating = parseFloat(commentDiv.querySelector('.comment-rating').textContent) || 0;

        // Mostrar el formulario de edición
        commentDiv.innerHTML = `
            <form class="comment-edit-form post-anime-form">
                <div class="post-anime-form__field">
                    <label for="editCommentTitle">Title</label>
                    <input type="text" id="editCommentTitle" name="title" class="post-anime-form__input" value="${commentTitle}" required>
                </div>
                <div class="post-anime-form__field">
                    <label for="editCommentText">Comment</label>
                    <textarea id="editCommentText" name="text" class="post-anime-form__input" required>${commentText}</textarea>
                </div>
                <div class="post-anime-form__field">
                    <label for="editCommentRating">Rating</label>
                    <input type="number" id="editCommentRating" name="rating" class="post-anime-form__input" value="${commentRating}" min="0" max="10" step="0.1" required>
                </div>
                <div class="post-anime-form__field">
                    <button type="button" id="submitEditComment" data-comment-id="${commentId}" data-anime-id="${animeId}" class="addAnime">Update Comment</button>
                </div>
                <div class="post-anime-form__field">
                    <button type="button" id="cancelEditComment" data-anime-id="${animeId}" class="cancel-button">Cancel</button>
                </div>
            </form>
        `;

        document.getElementById('submitEditComment').addEventListener('click', updateComment);
        document.getElementById('cancelEditComment').addEventListener('click', (event) => showAnimeDetails(event.target.dataset.animeId));
    }
});

const updateComment = async (event) => {
    const commentId = event.target.dataset.commentId; // Retrieve commentId from data attribute
    const animeId = event.target.dataset.animeId; // Retrieve animeId from data attribute
    console.log(`Updating comment with ID ${commentId} for anime ${animeId}`);
    const title = document.getElementById('editCommentTitle').value;
    const text = document.getElementById('editCommentText').value;
    const rating = parseFloat(document.getElementById('editCommentRating').value);

    if (!title || !text || isNaN(rating) || rating < 0 || rating > 10) {
        displayMessage( form, 'Please enter a valid title, comment and rating.');
        return;
    }
    const section = document.querySelector('section');
    const loadingIndicator = Loading(); 
    section.appendChild(loadingIndicator); 
    loadingIndicator.style.display = 'flex';
    try {
        const token = localStorage.getItem('token');
        const response = await API({
            endpoint: `/comments/${commentId}`,
            method: 'PUT',
            payload: { title, text, rating },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Response data:', response);

        if (response.message !== 'Comentario actualizado con éxito') {
            console.error('Server response:', response);
            throw new Error('Failed to update comment');
        }

        showMessageAnime ('Comment updated successfully!', 'success');
        showAnimeDetails(animeId); // Refresh the anime details
    } catch (error) {
        console.error('Failed to update comment:', error);
        showMessageAnime ('Failed to update comment', 'error');
    }
};