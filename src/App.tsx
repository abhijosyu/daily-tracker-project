import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";

import { auth } from "./firebase";
import TaskController from "./Tasks/controller/TaskController";
import "./App.css";
import ShinyText from "../ReactBits/ShinyText/ShinyText";
import LoginForm from "./Component/LoginForm";

function App() {
  const [user, setUser] = useState<User | null>(null);

  // makes it so the log in screen is not scrollable.
  useEffect(() => {
    if (!user) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [user]);

  const [showUserInfo, setShowUserInfo] = useState(false);

  // for auto logging in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <div
      className={`app-container ${
        user ? "main-background" : "login-background"
      }`}
    >
      {user ? (
        <>
          <div className="top-text" style={{ zIndex: 9999 }}>
            <h1 className="trackly">
              <ShinyText
                text="TRACKLY"
                disabled={false}
                speed={3}
                className="custom-class"
              />
            </h1>
            <div className="user-options">
              <button
                className="user-button"
                onClick={() => setShowUserInfo((prev) => !prev)}
              ></button>
              {showUserInfo && (
                <div className="user-info">
                  <p
                    style={{
                      color: "white",
                      alignSelf: "center",
                      maxWidth: 180,
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      textAlign: "center",
                    }}
                  >
                    {user.email?.substring(0, user.email.indexOf("@"))}
                  </p>
                  <button
                    className="Logout"
                    style={{
                      color: "white",
                      alignSelf: "center",
                    }}
                    onClick={() => signOut(auth)}
                  >
                    Logout
                  </button>
                  <button
                    className="Logout"
                    style={{
                      color: "white",
                      alignSelf: "center",
                      textAlign: "center",
                    }}
                    onClick={() => setShowUserInfo((prev) => !prev)}
                  >
                    X
                  </button>
                </div>
              )}{" "}
            </div>
          </div>

          <TaskController />
        </>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}

export default App;
