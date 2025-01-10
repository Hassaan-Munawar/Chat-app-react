import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { collection, getDocs, getFirestore, query, doc, setDoc, where } from "firebase/firestore"
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
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
      username: username.toLowerCase().trim(),
      email,
      name: username,
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
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

export { signup, login, logout, auth, db, resetPass }