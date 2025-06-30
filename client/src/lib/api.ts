import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_ROOT_URL;

export const getUserFriends = async () => {
  const res = await axios.get(`${API_URL}/user/friends`,{withCredentials:true});
  return res;
};

export const getRecommendedUsers = async () => {
  const res = await axios.get(`${API_URL}/user`, { withCredentials: true });
  return res;
};

export const getOutgoingFriendReqs = async () => {
  const res = await axios.get(`${API_URL}/user/outgoing-friend-requests`, {
    withCredentials: true,
  });
  return res;
};

export const sendFriendRequest = async (userId: string) => {
  const res = await axios.post(`${API_URL}/user/friends-request/${userId}`, {
    withCredentials: true,
  });
  return res;
};
