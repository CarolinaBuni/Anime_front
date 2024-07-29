import { DeleteAnimeModal } from '../DeleteModal/DeleteModal';
import { editAnime, EditAnimeForm } from '../EditAnimeForm/EditAnimeForm';
import './AnimeIcons.css';

export const DeleteIcon = (anime) => {
     const deleteIcon = document.createElement( 'img' );
                    deleteIcon.className = 'delete-icon';
                    deleteIcon.src = './assets/borrar.png';
                    deleteIcon.alt = 'Delete';
                    deleteIcon.dataset.animeId = anime._id;
                    deleteIcon.addEventListener( 'click', ( event ) => DeleteAnimeModal( event ) );
                    return deleteIcon;
};

export const EditIcon = (anime) => {
     const editIcon = document.createElement( 'img' );
                    editIcon.className = 'edit-icon';
                    editIcon.src = './assets/edit-icon.png';
                    editIcon.alt = 'Edit';
                    editIcon.dataset.animeId = anime._id;
                    editIcon.addEventListener( 'click', ( event ) => EditAnimeForm( anime, editAnime ) );
                    return editIcon;
};