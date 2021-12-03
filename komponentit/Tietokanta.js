import { initializeFirestore } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { Button } from 'react-native-elements';
import 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyCHvCJvYy1v12xXKXKM2mCm-XStjbmdfJQ",
    authDomain: "vaateappi2.firebaseapp.com",
    projectId: "vaateappi2",
    storageBucket: "vaateappi2.appspot.com",
    messagingSenderId: "729084283728",
    appId: "1:729084283728:web:96f2cf07245d9f41e17a55"
  };

  const app = initializeApp(firebaseConfig);
  export default initializeFirestore(app, { experimentalAutoDetectLongPolling: true, });