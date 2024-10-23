import React, { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../../config/firebase'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import upload from '../../lib/Upload'
import { AppContext } from '../../context/AppContext'

const ProfileUpdate = () => {
  const navigate = useNavigate()
  const [image, setImage] = useState(null)
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [updateImage, setUpdateImage] = useState("Upload Profile Image")
  const { setUserData } = useContext(AppContext)
  const profileUpdate = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      if (!prevImage && !image) {
        toast.error("Upload Profile Picture");
        setLoading(false);
        return;
      }

      const docRef = doc(db, "users", uid);

      if (image) {
        const imgUrl = await upload(image);
        setPrevImage(imgUrl);
        await updateDoc(docRef, {
          avatar: imgUrl,
          bio: bio,
          name: name
        });
      } else {
        await updateDoc(docRef, {
          bio: bio,
          name: name
        });
      }

      const snap = await getDoc(docRef);
      setUserData(snap.data());

      if (image || prevImage) {
        navigate('/chat');
      }

    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid)
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.data().name) {
          setName(docSnap.data().name)

        }
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio)

        }
        if (docSnap.data().avatar) {
          setPrevImage(docSnap.data().avatar)
          setUpdateImage("Update Profile Image")

        }
      }
      else {
        navigate('/')
      }
    })

  }, [])


  return (
    <>
      {
        loading ? <div className='cover'>
          <div className='loader'></div>
        </div> : null
      }
      <div className='profile'>
        <div className="profile-container">
          <form onSubmit={profileUpdate}>
            <h3>Profile Details</h3>
            <label htmlFor="avatar">
              <input onChange={(e) => setImage(e.target.files[0])} type="file" id="avatar" accept=".png , .jpg , .jpeg" hidden />
              <img src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
              {updateImage}
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="your name" required />
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Write Profile bio" required></textarea>
            <button type="submit">Save</button>
          </form>
          <img className='profile-pic' src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} alt="" />
        </div>
      </div>
    </>
  )
}

export default ProfileUpdate