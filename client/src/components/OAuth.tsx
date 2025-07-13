"use client";
import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import axios from "axios";
import { useRouter } from "next/navigation";
import userAuthStore from "@/store/userStore";
import { app } from "@/utils/firebase";
import { AiFillGoogleCircle } from "react-icons/ai";
import { API_URL } from "@/lib/api";

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

     

      const response = await axios.post(
        `${API_URL}/api/auth/googleauth`,
        userObject,
        {
          withCredentials: true,
        }
      );

      

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
          router.replace("/");
        }
        return;
      }

      
      setError("Authentication failed. Please try again.");
    } catch (error: any) {
      
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
