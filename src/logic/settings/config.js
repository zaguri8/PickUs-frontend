import { GoogleAuthProvider} from "firebase/auth"
// Configure Firebase.
export const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    databaseURL: process.env.REACT_APP_databaseURL,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId
};
// Configure FirebaseUI.
export const uiConfig = (path) => ({
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',

    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: path,
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        GoogleAuthProvider.PROVIDER_ID
    ],
});

export const BETA = false
