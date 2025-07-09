import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.log(apiKey);
  console.log("stream api key or secret is missing");
  throw new Error("Stream API key or secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData: any) => {
  try {
    await streamClient.upsertUser(userData); // Remove array wrapper
    console.log("upsert userdata ", userData)
    return userData;
  } catch (error) {
    console.log("error upserting stream user:", error);
    throw error; // Re-throw to handle upstream
  }
};

export const generateStreamToken = (userId: string | number) => {
  try {
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.log("error generating stream token", error);
    throw error; // Re-throw to handle upstream
  }
};
