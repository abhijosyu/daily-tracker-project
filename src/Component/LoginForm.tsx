import { useRef, useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

import "../ComponentCSS/LoginForm.css";

interface LoginFormProps {
  onAuthSuccess: (user: User) => void;
}

export default function LoginForm({ onAuthSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

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

  // submits the given log in iformation and makes sure the given information is correct and filled in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        try {
          const userInfo = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          const user = userInfo.user;
          onAuthSuccess(user);
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
          });
          console.log("User added to Firestore"); // ✅

          callMessage("Signed Up");
        } catch (err: any) {
          callMessage(err.message);
        }
      } else {
        let loginEmail = email;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          loginEmail,
          password
        );
        onAuthSuccess(userCredential.user);
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
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="sign-in-buttons">
          <button type="submit">
            {" "}
            <b>{isSignUp ? "Sign Up" : "Login"}</b>
          </button>
          <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
            <b>Switch To {isSignUp ? "Login" : "Sign Up"}</b>
          </button>
        </div>
      </form>
      {message && <div className="sign-in-message">{message}</div>}
    </div>
  );
}
