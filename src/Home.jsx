import Styles from "./Main.css";

import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";

import { useState, useEffect } from "react";
import {
  getDatabase,
  ref,
  onValue,
  push,
  update,
  remove,
} from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBuU4NIqHe3m99s-yY2EvLgqTnsdj81urw",
  authDomain: "isp-database-f18ff.firebaseapp.com",
  databaseURL:
    "https://isp-database-f18ff-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "isp-database-f18ff",
  storageBucket: "isp-database-f18ff.appspot.com",
  messagingSenderId: "846511482857",
  appId: "1:846511482857:web:7bffe381b5bebcb2d88d78",
  measurementId: "G-X9V6XNWSWW",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const databaseRef = ref(database, "items");

const storage = getStorage(app);

function Home() {
  const [items, setItems] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemAccessories, setNewItemAccessories] = useState("");
  const [newItemImage, setNewItemImage] = useState(null);

  useEffect(() => {
    // Listen for changes to the database reference
    onValue(databaseRef, (snapshot) => {
      const data = snapshot.val();
      setItems(data);
    });
  }, []);

  const handleNewItemSubmit = (event) => {
    event.preventDefault();
    const newItemRef = push(databaseRef);
    const imageFile = event.target.image.files[0];
    const imageFileName = imageFile?.name;

    // Create the new item object only including non-empty fields
    const newItem = {};
    if (newItemName !== "") {
      newItem.name = newItemName;
    }
    if (newItemQuantity !== "") {
      newItem.quantity = parseInt(newItemQuantity);
    }
    if (newItemDescription !== "") {
      newItem.description = newItemDescription;
    }
    if (newItemAccessories !== "") {
      newItem.accessories = newItemAccessories.split(",");
    }
    if (imageFileName !== undefined) {
      newItem.image = imageFileName;
      newItem.imageUrl = ""; // Add this line to set the initial value of imageUrl
    }

    update(newItemRef, newItem).then(() => {
      setNewItemName("");
      setNewItemQuantity("");
      setNewItemDescription("");
      setNewItemAccessories("");
      if (imageFile) {
        const imageRef = ref(storage, `images/${imageFileName}`);
        uploadBytes(imageRef, imageFile).then(() => {
          getDownloadURL(imageRef).then((url) => {
            update(newItemRef, {
              imageUrl: url,
            });
          });
        });
      }
    });
  };

  const handleItemDelete = (key) => {
    remove(ref(database, `items/${key}`));
  };
  const handleQuantityIncrement = (key) => {
    const itemRef = ref(database, `items/${key}`);
    if (items && items[key]) {
      // Add this check
      update(itemRef, {
        quantity: items[key].quantity + 1,
      });
    }
  };

  const handleQuantityDecrement = (key) => {
    const itemRef = ref(database, `items/${key}`);
    if (items && items[key]) {
      // Add this check
      update(itemRef, {
        quantity: items[key].quantity - 1,
      });
    }
  };
  const handleImageUpload = (event) => {
    setNewItemImage(event.target.files[0]);
  };

  return (
    <div>
      <h1>Items in stock</h1>
      <ul>
        {items &&
          Object.entries(items).map(([key, item]) => (
            <li key={key}>
              <h2>{item.name}</h2>
              <p>Description: {item.description}</p>

              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ maxWidth: "200px" }}
                />
              )}
              <p>
                <br />
                Quantity: {item.quantity}
                <button onClick={() => handleQuantityIncrement(key)}>+</button>
                <button onClick={() => handleQuantityDecrement(key)}>-</button>
              </p>
              {item.accessories && item.accessories.length > 0 && (
                <ul>
                  Accessories:
                  {item.accessories.map((accessory) => (
                    <li key={accessory}>{accessory}</li>
                  ))}
                </ul>
              )}
              <button onClick={() => handleItemDelete(key)}>Delete</button>
            </li>
          ))}
      </ul>
      <form onSubmit={handleNewItemSubmit}>
        <h2>Add new item:</h2>
        <label>
          Name:
          <input
            type="text"
            value={newItemName}
            onChange={(event) => setNewItemName(event.target.value)}
          />
          Quantity:
          <input
            type="number"
            value={newItemQuantity}
            onChange={(event) => setNewItemQuantity(event.target.value)}
          />
        </label>
        <br />
        <label>
          Description:
          <input
            type="text"
            value={newItemDescription}
            onChange={(event) => setNewItemDescription(event.target.value)}
          />
        </label>
        <br />
        <label>
          Accessories (separated by commas):
          <input
            type="text"
            value={newItemAccessories}
            onChange={(event) => setNewItemAccessories(event.target.value)}
          />
        </label>
        <br />
        <label>
          Image:
          <input type="file" name="image" onChange={handleImageUpload} />
        </label>
        <br />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default Home;
