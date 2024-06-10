import { Header } from '../../components/Header/Header';
import { API } from '../../utils/API';
import { displayMessage } from '../../utils/messages';
import { Home } from '../Home/Home';
import './LoginRegistry.css';

export const LoginRegistry = () => {
     const main = document.querySelector( 'main' );
     main.innerHTML = "";

     const loginDiv = document.createElement( 'div' );
     const formTitle = document.createElement( 'h2' );
     loginDiv.id = "login";
     formTitle.textContent = "Iniciar Sesión";
     loginDiv.appendChild( formTitle );

     Login( loginDiv );

     main.append( loginDiv );
};

const Login = ( elementoPadre ) => {
     const form = document.createElement( 'form' );

     const inputEmail = document.createElement( 'input' );
     const inputPassword = document.createElement( 'input' );
     const button = document.createElement( 'button' );
     const switchToRegister = document.createElement( 'p' );

     inputPassword.type = "password";
     inputPassword.placeholder = "********";
     inputEmail.type = "email";
     inputEmail.placeholder = "Email";
     button.textContent = "Login";
     switchToRegister.innerHTML = `¿No tienes cuenta? <span class="switch pointer-text">Regístrate aquí</span>`;

     elementoPadre.append( form );
     form.append( inputEmail );
     form.append( inputPassword );
     form.append( button );
     elementoPadre.append( switchToRegister );

     form.addEventListener( 'submit', ( e ) => {
          e.preventDefault();  // Prevenir el envío tradicional del formulario
          submit( inputEmail.value, inputPassword.value, form );
     } );

     switchToRegister.querySelector( '.pointer-text' ).addEventListener( 'click', () => {
          elementoPadre.innerHTML = "";
          const formTitle = document.createElement( 'h2' );
          formTitle.textContent = "Registrarse";
          elementoPadre.appendChild( formTitle );
          Register( elementoPadre );
     } );
};

const Register = ( elementoPadre ) => {
     const form = document.createElement( 'form' );

     const inputEmail = document.createElement( 'input' );
     const inputPassword = document.createElement( 'input' );
     const inputUserName = document.createElement( 'input' );
     const button = document.createElement( 'button' );
     const switchToLogin = document.createElement( 'p' );

     inputUserName.type = "text";
     inputUserName.placeholder = "Nombre de usuario";
     inputPassword.type = "password";
     inputPassword.placeholder = "********";
     inputEmail.type = "email";
     inputEmail.placeholder = "Email";
     button.textContent = "Registrarse";
     switchToLogin.innerHTML = `¿Ya tienes cuenta? <span class="pointer-text">Inicia sesión aquí</span>`;

     elementoPadre.append( form );
     form.append( inputUserName );
     form.append( inputEmail );
     form.append( inputPassword );
     form.append( button );
     elementoPadre.append( switchToLogin );

     form.addEventListener( 'submit', ( e ) => {
          e.preventDefault();  // Prevenir el envío tradicional del formulario
          register( inputUserName.value, inputEmail.value, inputPassword.value, form, elementoPadre );
     } );

     switchToLogin.querySelector( '.pointer-text' ).addEventListener( 'click', () => {
          elementoPadre.innerHTML = "";
          const formTitle = document.createElement( 'h2' );
          formTitle.textContent = "Iniciar Sesión";
          elementoPadre.appendChild( formTitle );
          Login( elementoPadre );
     } );
};

const submit = async ( email, password, form ) => {
     const requestData = {
          email: email,
          password: password
     };

     console.log( "Login Request Data:", requestData );  // Verifica que los datos de la solicitud son correctos

     try {
          const data = await API( {
               endpoint: '/users/login',
               method: "POST",
               payload: requestData
          } );

          if ( data && data.token ) {
               console.log( "Login successful:", data );
               localStorage.setItem( 'token', data.token );
               localStorage.setItem( 'user', JSON.stringify( data.user ) );
               Home();
               Header();  // Refrescar el header para reflejar el estado de autenticado
          } else {
               displayMessage( form, "Usuario o contraseña incorrectos" );
          }
     } catch ( error ) {
          console.error( "Error during fetch:", error );
          displayMessage( form, "Usuario o contraseña incorrectos" );

     }
};

const register = async ( userName, email, password, form, elementoPadre ) => {
     const requestData = {
          userName: userName,
          email: email,
          password: password
     };

     console.log( "Register Request Data:", requestData );  // Verifica que los datos de la solicitud son correctos

     try {
          const data = await API( {
               endpoint: '/users/register',
               method: "POST",
               payload: requestData
          } );

          if ( data && data._id ) {
               console.log( "Register successful:", data );
               displayMessage( form, "Registrado exitosamente. Inicia sesión ahora.", "success" );

               setTimeout( () => {
                    elementoPadre.innerHTML = "";
                    const formTitle = document.createElement( 'h2' );
                    formTitle.textContent = "Iniciar Sesión";
                    elementoPadre.appendChild( formTitle );
                    Login( elementoPadre );
               }, 1000 ); 

          } else {
               displayMessage( form, "Error al registrarse" );
          }

     } catch ( error ) {
          console.error( "Error during fetch:", error );
          displayMessage( form, "Este usuario ya existe" );
     }
};
