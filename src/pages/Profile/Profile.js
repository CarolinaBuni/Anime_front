

import { API } from "../../utils/API";
import { printAnimes } from "../Animes/Animes";
import "./Profile.css";
import "../PostAnimes/PostAnimes.css"; 
import { ConfigureDeleteModal } from "../../components/DeleteModal/DeleteModal";


export const getProfile = async () => {
    try {
        // Obtener el ID del usuario desde el localStorage
        const userId = JSON.parse(localStorage.getItem('user'))._id;
        // Hacer una solicitud para obtener los datos del usuario
        const user = await API({
            endpoint: `/users/${userId}`,
            method: "GET",
        });

        showProfile(user);
        // Mostrar la lista de favoritos si existe
        if (user && user.favorites && user.favorites.length > 0) {
            const favoritesContainer = document.getElementById('favoritesContainer');
            favoritesContainer.innerHTML = ''; 
            printAnimes(user.favorites, user.favorites.map(fav => fav._id), user.watchlist.map(watch => watch._id), false, 'favoritesContainer'); 
        }
        // Mostrar la lista de animes vistos si existe
        if (user && user.watchlist && user.watchlist.length > 0) {
            const watchlistContainer = document.getElementById('watchlistContainer');
            watchlistContainer.innerHTML = ''; 
            printAnimes(user.watchlist, user.favorites.map(fav => fav._id), user.watchlist.map(watch => watch._id), false, 'watchlistContainer');
        }
    } catch (error) {
        console.error("Failed to fetch user's profile:", error);
    }
};

const showProfile = (user) => {
    const section = document.querySelector('section');
    section.innerHTML = ''; 
    section.className = 'profile-section';

    const userProfileContainer = document.createElement('div');
    userProfileContainer.id = 'userProfileContainer';

    // Agregar los elementos de favoritos y animes vistos sólo si hay datos
    if (user.favorites && user.favorites.length > 0) {
        const favoritesTitle = document.createElement('h2');
        favoritesTitle.textContent = 'Favoritos';
        userProfileContainer.appendChild(favoritesTitle);

        const favoritesContainer = document.createElement('div');
        favoritesContainer.id = 'favoritesContainer';
        favoritesContainer.className = 'anime-list';
        userProfileContainer.appendChild(favoritesContainer);
    }

    if (user.watchlist && user.watchlist.length > 0) {
        const watchlistTitle = document.createElement('h2');
        watchlistTitle.textContent = 'Animes Vistos';
        userProfileContainer.appendChild(watchlistTitle);

        const watchlistContainer = document.createElement('div');
        watchlistContainer.id = 'watchlistContainer';
        watchlistContainer.className = 'anime-list';
        userProfileContainer.appendChild(watchlistContainer);
    }

    // Agregar los detalles del usuario
    const userDetailsTitle = document.createElement('h2');
    userDetailsTitle.textContent = 'Datos del Usuario';
    userProfileContainer.appendChild(userDetailsTitle);

    const userDetails = document.createElement('div');
    userDetails.id = 'userDetails';
    userDetails.className = 'profile-details';
    userDetails.innerHTML = `
        <p><strong>Nombre de Usuario:</strong> ${user.userName}</p>
        <p><strong>Email:</strong> ${user.email}</p>
    `;
    userProfileContainer.appendChild(userDetails);

    // Agregar el botón de eliminación de cuenta
    const deleteAccountButton = document.createElement('button');
    deleteAccountButton.id = 'deleteAccountButton';
    deleteAccountButton.className = 'deleteAccountButton';
    deleteAccountButton.textContent = 'Eliminar Cuenta';
    userProfileContainer.appendChild(deleteAccountButton);

    section.appendChild(userProfileContainer);

    // Agregar el evento de eliminación de cuenta
    document.getElementById('deleteAccountButton').addEventListener('click', () => deleteAccount(user._id));
};

const deleteAccount = async (userId) => {
    const confirmDeleteAccount = async () => {
        try {
            // Obtener el token de autenticación
            const token = localStorage.getItem('token');
            // Hacer una solicitud para eliminar la cuenta del usuario
            const response = await fetch(`https://anime-back-jet.vercel.app/api/v1/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }
            // Mostrar un mensaje de éxito y redirigir al usuario
            alert('Cuenta eliminada con éxito');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/'; 
        } catch (error) {
            alert('Error al eliminar la cuenta');
        } finally {
            // Cerrar el modal de confirmación
            const modal = document.getElementById('deleteModal');
            modal.style.display = 'none';
        }
    };
    // Configurar y mostrar el modal de confirmación de eliminación de cuenta
    ConfigureDeleteModal('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.', confirmDeleteAccount);
};
