// "use client";
// import React from "react";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// import axios from "axios";
// import { useRouter } from "next/navigation";
// import userAuthStore from "@/store/userStore";
// import { app } from "@/utils/firebase";
// import { AiFillGoogleCircle } from "react-icons/ai";

// const OAuth = () => {
//   const router = useRouter();
//   const setUser = userAuthStore((state) => state.setUser);
//   const [loading, setLoading] = React.useState<boolean>(false);
//   const [error, setError] = React.useState<string | null>(null);
//   let userObject = null;
//   const auth = getAuth(app);
//   const handleGoogleClick = async () => {
//     const provider = new GoogleAuthProvider();
//     provider.setCustomParameters({ prompt: "select_account" });
//     try {
//       const result = await signInWithPopup(auth, provider);
//       userObject = {
//         fullName: result.user.displayName,
//         email: result.user.email,
//         photoURL: result.user.photoURL,
//         uid: result.user.uid,
//       };
//       console.log("User Object:", userObject);
//       setLoading(true);

//       const response = await axios.post(
//         "http://localhost:5000/api/auth/googleauth",
//         userObject,
//         {
//           withCredentials: true,
//         }
//       );
//       console.log(response.data);
//       if (response.data.message === "signup") {
//         setUser(response.data.newUser, true);
//         router.replace("/onboard");
//         return;
//       }
//       if (response.data.message === "signin" && !response.data.user.bio) {
//         setUser(response.data.user, true);
//         router.replace("/onboard");
//         return;
//       }
//       if (response.data.message === "signin" && response.data.user.bio) {
//         setUser(response.data.user, true);
//         router.replace("/");
//         return;
//       }

//       setLoading(false);
//     } catch (error: any) {
//       console.log("error", error);
//       setError(error);
//       setLoading(false);
//     }
//   };

//   return (
//     <button
//       className="btn btn-outline btn-primary w-full rounded-3xl"
//       onClick={handleGoogleClick}
//     >
//       {loading ? (
//         <span className="loading loading-spinner text-primary"></span>
//       ) : (
//         <>
//           <AiFillGoogleCircle className="w-6 h-6 mr-2" />
//           continue with Google
//         </>
//       )}
//     </button>
//   );
// };

// export default OAuth;

"use client";
import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import axios from "axios";
import { useRouter } from "next/navigation";
import userAuthStore from "@/store/userStore";
import { app } from "@/utils/firebase";
import { AiFillGoogleCircle } from "react-icons/ai";

const OAuth = () => {
  const router = useRouter();
  const setUser = userAuthStore((state) => state.setUser);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const auth = getAuth(app);

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      setLoading(true);
      setError(null);

      const result = await signInWithPopup(auth, provider);
      const userObject = {
        fullName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        uid: result.user.uid,
      };

      console.log("User Object:", userObject);

      const response = await axios.post(
        "http://localhost:5000/api/auth/googleauth",
        userObject,
        {
          withCredentials: true,
        }
      );

      console.log("OAuth Response:", response.data);

      // Handle new user signup
      if (response.data.message === "signup") {
        setUser(response.data.newUser, true);
        // New users always need onboarding
        router.replace("/onboard");
        return;
      }

      // Handle existing user signin
      if (response.data.message === "signin") {
        setUser(response.data.user, true);

        // Check if user needs onboarding
        if (!response.data.user.isOnboard) {
          router.replace("/onboard");
        } else {
          router.replace("/home");
        }
        return;
      }

      // If we reach here, something unexpected happened
      console.error("Unexpected response:", response.data);
      setError("Authentication failed. Please try again.");
    } catch (error: any) {
      console.error("OAuth error:", error);
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        className="btn btn-outline btn-primary w-full rounded-3xl"
        onClick={handleGoogleClick}
        disabled={loading}
      >
        {loading ? (
          <span className="loading loading-spinner text-primary"></span>
        ) : (
          <>
            <AiFillGoogleCircle className="w-6 h-6 mr-2" />
            continue with Google
          </>
        )}
      </button>

      {error && (
        <div className="alert alert-error mt-2">
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default OAuth;
