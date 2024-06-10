import { API } from "../../utils/API";
import {  printAnimes } from "../Animes/Animes";
import "./Profile.css";
import "../PostAnimes/PostAnimes.css"; // Import the PostAnimes styles
import { configureDeleteModal } from "../../utils/modals";
// Función para obtener y mostrar el perfil del usuario
export const getProfile = async () => {
    try {
        // Obtener el ID del usuario desde el localStorage
        const userId = JSON.parse(localStorage.getItem('user'))._id;
        // Hacer una solicitud para obtener los datos del usuario
        const user = await API({
            endpoint: `/users/${userId}`,
            method: "GET",
        });
         // Mostrar el perfil del usuario
        showProfile(user);
        // Mostrar la lista de favoritos si existe
        if (user && user.favorites) {
            const favoritesContainer = document.getElementById('favoritesContainer');
            favoritesContainer.innerHTML = ''; // Limpiar el contenedor de favoritos
            printAnimes(user.favorites, user.favorites.map(fav => fav._id), user.watchlist.map(watch => watch._id), false, 'favoritesContainer'); // Pasamos los favoritos y especificamos el contenedor
        }
        // Mostrar la lista de animes vistos si existe
        if (user && user.watchlist) {
            const watchlistContainer = document.getElementById('watchlistContainer');
            watchlistContainer.innerHTML = ''; // Limpiar el contenedor de watchlist
            printAnimes(user.watchlist, user.favorites.map(fav => fav._id), user.watchlist.map(watch => watch._id), false, 'watchlistContainer');
        }
    } catch (error) {
        console.error("Failed to fetch user's profile:", error);
    }
};
// Función para mostrar el perfil del usuario en la UI
const showProfile = (user) => {
    const section = document.querySelector('section');
    section.innerHTML = ''; 
    section.className = 'profile-section';
    // Crear el contenedor del perfil del usuario
    const userProfileContainer = document.createElement('div');
    userProfileContainer.id = 'userProfileContainer';
    userProfileContainer.innerHTML = `
        <h2>Favoritos</h2>
        <div id="favoritesContainer" class="anime-list"></div>
        <h2>Animes Vistos</h2>
        <div id="watchlistContainer" class="anime-list"></div>
        <h2>Datos del Usuario</h2>
        <div id="userDetails" class="profile-details">
            <p><strong>Nombre de Usuario:</strong> ${user.userName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
        </div>
        
        <button id="deleteAccountButton" class="deleteAccountButton">Eliminar Cuenta</button>
    `;

    section.appendChild(userProfileContainer);
    // Agregar el evento de eliminación de cuenta
    document.getElementById('deleteAccountButton').addEventListener('click', () => deleteAccount(user._id));
};
// Función para eliminar la cuenta del usuario
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
    configureDeleteModal('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.', confirmDeleteAccount);
};
