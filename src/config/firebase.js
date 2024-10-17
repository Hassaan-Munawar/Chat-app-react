import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { collection, getDocs, getFirestore, query, doc ,  setDoc, where } from "firebase/firestore"
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCz_AqcLLC6KbH2PC91dTrdWGhAyXue4Wk",
  authDomain: "chat-app-8d502.firebaseapp.com",
  projectId: "chat-app-8d502",
  storageBucket: "chat-app-8d502.appspot.com",
  messagingSenderId: "696427344358",
  appId: "1:696427344358:web:dc82960230de831550e627"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey, There I am using chat app",
    })
    await setDoc(doc(db, "chats", user.uid), {
      chatsData: []
    })

  } catch (error) {
    console.error(error)
    toast.error(error.code.split('/')[1].split('-').join(" "))

  }

}


const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password)

  } catch (error) {
    console.error(error)
    toast.error(error.code.split('/')[1].split('-').join(" "))

  }


}

const logout = async () => {
  try {
    await signOut(auth)
  }
  catch (error) {
    console.error(error)
    toast.error(error.code.split('/')[1].split('-').join(" "))

  }
}

const resetPass = async (email) => {
  if (!email) {
    toast.error("Enter Your Email")
    return null;
  }
  try {
    const userRef = collection(db, "users")
    const q = query(userRef, where("email", "==", email))
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      await sendPasswordResetEmail(auth, email)
      toast.success("Reset Email Sent")

    }
    else {
      toast.error("Email doesn't exists")
    }

  } catch (error) {
    console.error(error)
    toast.error(error.message)

  }

}

export { signup, login, logout, auth, db ,resetPass}