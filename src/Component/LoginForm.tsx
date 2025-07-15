import { useRef, useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

import "../ComponentCSS/LoginForm.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [useUsernameLogin, setUseUsernameLogin] = useState(false);
  const timeOut = useRef<NodeJS.Timeout | null>(null);

  // any messages that appear throughout the log in screen are formatted here
  const callMessage = (message: string) => {
    const TitleCaseMessage = message
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    setMessage(null);

    setTimeout(() => {
      setMessage(TitleCaseMessage); // sets the error message to the stored one 10 ms later

      if (timeOut.current) {
        clearTimeout(timeOut.current);
      } // resets the timeout if a new error arises

      timeOut.current = setTimeout(() => {
        setMessage(null);
        timeOut.current = null;
      }, 3000); // sets the timer to 3 seconds and then resets the states
    }, 10);
  };

  const [message, setMessage] = useState<string | null>(null);

  // checks to make sure a username is unique and not taken
  async function isUsernameTaken(username: string): Promise<boolean> {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  // gets an email from the username given
  async function getEmailFromUsername(
    username: string
  ): Promise<string | null> {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].data().email;
    }
    return null;
  }

  // submits the given log in iformation and makes sure the given information is correct and filled in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        try {
          if (username.length == 0) {
            throw new Error("username cannot be empty");
          }
          const userInfo = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          const user = userInfo.user;
          const taken = await isUsernameTaken(username);
          if (!taken) {
            await setDoc(doc(db, "users", user.uid), {
              username: username,
              email: user.email,
            });
          } else {
            throw new Error("username taken already");
          }

          callMessage("Signed Up");
        } catch (err: any) {
          callMessage(err.message);
        }
      } else {
        let loginEmail = email;

        if (useUsernameLogin) {
          if (!username.trim()) {
            callMessage("Username is required");
            return;
          }

          const foundEmail = await getEmailFromUsername(username.trim());
          if (!foundEmail) {
            callMessage("No user found with that username");
            return;
          }

          loginEmail = foundEmail;
        }

        await signInWithEmailAndPassword(auth, loginEmail, password);
        callMessage("Signed In");
      }
    } catch (err: any) {
      callMessage(err.message);
    }
  };

  return (
    <div className="sign-in-screen">
      <div className="sign-in-images">
        <img
          className="sign-in-text"
          src="/Images/Trackly.png"
          alt="text logo trackly"
        />
      </div>
      <form className="sign-in-form" onSubmit={handleSubmit}>
        <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
        {!useUsernameLogin || isSignUp ? (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        ) : null}
        {isSignUp || useUsernameLogin ? (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        ) : null}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="sign-in-buttons">
          {!isSignUp ? (
            <button
              type="button"
              className="switch-username"
              onClick={() => setUseUsernameLogin(!useUsernameLogin)}
            >
              {useUsernameLogin ? "Use Email Instead" : "Login with Username"}
            </button>
          ) : null}

          <button type="submit">
            {" "}
            <b>{isSignUp ? "Sign Up" : "Login"}</b>
          </button>
          <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
            <b>Switch to {isSignUp ? "Login" : "Sign Up"}</b>
          </button>
        </div>
      </form>
      {message && <div className="sign-in-message">{message}</div>}
    </div>
  );
}
