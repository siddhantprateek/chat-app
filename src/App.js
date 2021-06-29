/* eslint-disable jsx-a11y/alt-text */
import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDTz9hLJuORKjSa5KPenerV7daT_JvCKUk",
  authDomain: "react-chatapp-9a158.firebaseapp.com",
  projectId: "react-chatapp-9a158",
  storageBucket: "react-chatapp-9a158.appspot.com",
  messagingSenderId: "221220689836",
  appId: "1:221220689836:web:dd656bb6a6df38f4b84c09",
  measurementId: "G-523WVXXGC1"
})

const auth = firebase.auth();
const firestore = firebase.firestore();




function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
      <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}

function SignIn(){

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )

}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
    );
}

function ChatRoom(){
  
  const dummy = useRef();
  const messageRef = firestore.collection('message');
  const query = messageRef.orderBy('createdAt').limit(25);

  const [message] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');
  
  // event Handler as sentMessage
  // takes e : event as an argument
  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;
    await messageRef.add({
      text: formValue,
      createAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }

  return(
    <>
    <main>
      {message && message.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <div ref={dummy}></div>
    </main>


    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
      <button type="submit" disabled={!formValue}>👍</button>
    </form>
    </>
  );
}

function ChatMessage(props){
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent': 'received';

  return (
    <>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
    </>
    )

}

export default App;
