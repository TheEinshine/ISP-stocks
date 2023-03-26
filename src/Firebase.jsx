import { getDatabase, ref, set, onValue } from "firebase/database";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBuU4NIqHe3m99s-yY2EvLgqTnsdj81urw",
    authDomain: "isp-database-f18ff.firebaseapp.com",
    databaseURL: "https://isp-database-f18ff-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "isp-database-f18ff",
    storageBucket: "isp-database-f18ff.appspot.com",
    messagingSenderId: "846511482857",
    appId: "1:846511482857:web:7bffe381b5bebcb2d88d78",
    measurementId: "G-X9V6XNWSWW"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const database = getDatabase(app);
const databaseRef = ref(database, "items");

// set a value to the "items" node in the database


// listen for changes to the database reference
onValue(databaseRef, (snapshot) => {
  const data = snapshot.val();
  console.log("Data in Firebase:", data);

});


const Firebase = () => {
  return <div>Firebase</div>;
};

export default Firebase;
