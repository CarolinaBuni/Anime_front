import { getAnimes } from '../../pages/Animes/Animes';
import { Home } from '../../pages/Home/Home';
import { LoginRegistry } from '../../pages/LoginRegistry/LoginRegistry';
import { PostAnimes } from '../../pages/PostAnimes/PostAnimes';
import { getProfile } from '../../pages/Profile/Profile';
import './Header.css';

// Rutas de navegación
const routes = [
    {
        text: "Home",
        funcion: () => {
            Home();
            removeSpecialClasses();
            getAnimes(true);
        }
    },
    {
        text: "Profile",
        funcion: () => {
            removeSpecialClasses();
            getProfile();
        },
        requireAuth: true // Solo accesible si el usuario está autenticado
    },
    {
        text: "Settings",
        funcion: PostAnimes,
        requireAdmin: true // Solo para administradores
    }
];

const removeSpecialClasses = () => {
    const section = document.querySelector('section');
    if (section) {
        section.classList.remove('formSection', 'anime-detail-section', 'profile-section');
    }
};

export const Header = () => {
    const header = document.querySelector('header');
    header.innerHTML = "";
    const nav = document.createElement('nav');

    const userJson = localStorage.getItem('user');
    let user = null;
    let isAdmin = false;

    // Si userJson no es null, intentar parsearlo
    if (userJson) {
        try {
            user = JSON.parse(userJson);
            isAdmin = user?.rol === 'admin';
        } catch (e) {
            console.error("Error parsing user JSON:", e);
            // Si hay un error al parsear, asegurarse de que user sea null y isAdmin sea false
            user = null;
            isAdmin = false;
        }
    }

    // Crea enlaces de navegación basados en las rutas definidas
    routes.forEach(route => {
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = route.text;
        if (route.requireAuth && !localStorage.getItem("token")) {
            return; // No añadir el enlace si se requiere autenticación y no hay token
        }
        if (route.requireAdmin && !isAdmin) {
            return; // No añadir el enlace si se requiere rol de administrador y no es admin
        }
        
        a.addEventListener('click', route.funcion);
        nav.appendChild(a);
    });

    // Añadir enlace de login o logout basado en el estado de autenticación
    const authLink = document.createElement('a');
    authLink.href = '#';

    if (localStorage.getItem("token")) {
        authLink.textContent = "Logout";
        authLink.addEventListener('click', logout);
    } else {
        authLink.textContent = "Login";
        authLink.addEventListener('click', LoginRegistry);
    }

    nav.appendChild(authLink);

    header.appendChild(nav);
};
// Función para manejar el cierre de sesión
export const logout = () => {
    console.log("Logging out...");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log("Logged out. Redirecting...");
    Header();  // Refrescar el header para reflejar el estado de no autenticado
    getAnimes();
};
