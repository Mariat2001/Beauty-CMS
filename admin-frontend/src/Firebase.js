import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from 'firebase/storage'
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "<your-api-key>",
  authDomain: "<your-auth-domain>",
  projectId: "<your-project-id>",
  storageBucket: "<your-storage-bucket>",
  messagingSenderId: "<your-messaging-sender-id>",
  appId: "<your-app-id>",
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);

function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function Login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
    return unsub;
  }, [])

  return currentUser;
}

export async function upload(file, currentUser, setLoading) {
  const filePath = `users/${currentUser.uid}/${file.name}`;
  const fileRef = ref(storage, filePath);

  setLoading(true);

  try {
    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);

    await updateProfile(currentUser, { photoURL });

    setLoading(false);
    alert("Uploaded file!");

    return filePath; // Return the file path
  } catch (error) {
    console.error("Error uploading file:", error);
    setLoading(false);
    alert(`Upload failed: ${error.message}`);
    throw error;
  }
}


export async function updateImage(file, oldImagePath, setLoading) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.error('User is not authenticated');
    throw new Error('User is not authenticated');
  }

  const filePath = `users/${currentUser.uid}/${file.name}`;
  const fileRef = ref(storage, filePath);

  setLoading(true);

  try {
    // Delete the old image if it exists
    if (oldImagePath) {
      const oldImageRef = ref(storage, oldImagePath);
      await deleteObject(oldImageRef);
    }

    // Upload the new image
    await uploadBytes(fileRef, file);
    const newPhotoURL = await getDownloadURL(fileRef);

    alert("Updated image!");
    return filePath; // Return the file path
  } catch (error) {
    console.error("Error updating image:", error);
    alert(`Update failed: ${error.message}`);
    throw error;
  } finally {
    setLoading(false);
  }
}


export async function getImageUrl(filePath) {
  if (!filePath) {
    console.error("No file path provided");
    return null;
  }

  const fileRef = ref(storage, filePath);
  try {
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error("Error getting download URL:", error);
    return null;
  }
}

export function getStorageRef(filePath) {
  return ref(storage, filePath);
}

export { signup };