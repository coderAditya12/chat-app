"use client";
import { API_URL } from "@/lib/api";
import {
  Call,
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import userAuthStore from "@/store/userStore";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageLoader from "@/components/PageLoader";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;

interface StreamUser {
  id: string;
  name: string;
  image: string;
}

const CallPage = () => {
  const params = useParams();
  const { id: callId } = params;
  const [token, setToken] = useState("");
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [initializationError, setInitializationError] = useState(false);
  const { user } = userAuthStore((state) => state);

  // Call API for get stream token
  const getToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/token`, {
        withCredentials: true,
      });
      console.log(response);
      if (response.status === 200) {
        setToken(response.data.token);
      }
    } catch (error) {
      console.log("token error", error);
      toast.error("Failed to get authentication token");
      setInitializationError(true);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (user) {
      getToken();
    }
  }, [user]);

  useEffect(() => {
    const initCall = async () => {
      if (!token || !user) return;

      try {
        console.log("initializing stream video client");
        const currentUser: StreamUser = {
          id: user?.id || "",
          name: user?.fullName || "",
          image: user?.profilePic || "",
        };

        const videoClient = new StreamVideoClient({
          apiKey: apiKey,
          user: currentUser,
          token,
        });

        const callIdString = Array.isArray(callId) ? callId[0] : callId;
        if (!callIdString) {
          console.error("Call ID is missing");
          toast.error("Call ID is missing");
          setInitializationError(true);
          return;
        }

        const callInstance = videoClient.call("default", callIdString);
        await callInstance.join({ create: true });
        console.log("joined call successfully");

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error initializing call:", error);
        toast.error("Could not join the call");
        setInitializationError(true);
      }
    };

    initCall();
  }, [token, callId, user]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (call) {
        call.leave().catch(console.error);
      }
      if (client) {
        client.disconnectUser().catch(console.error);
      }
    };
  }, [call, client]);

  if (isConnecting) {
    return <PageLoader />;
  }

  if (initializationError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Could not initialize call. Please refresh or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative w-full h-full">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <PageLoader />
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const router = useRouter();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      router.back();
    }
  }, [callingState, router]);

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;
