import { LANGUAGE_TO_FLAG } from "@/constants";
import Link from "next/link";
import React from "react";

const FriendCard = ({ friend, isOnline }: { friend: any ,isOnline:boolean}) => {
 
  return (
    <div className="card -bg-base-200 hover:shadow:md transition-shadow">
      <div className="card-body p-4 ">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.fullName} />
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full">
                <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3 w-full">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag({ language: friend.nativeLanguage })}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag({ language: friend.learningLanguage })}
            Learning: {friend.learningLanguage}
          </span>
        </div>
        <Link href={`/chat/${friend.id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;
export function getLanguageFlag({ language }: { language: string }) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${language} flag`} // Use original language instead of langLower for better readability
        className="h-3 mr-1 inline-block"
        loading="lazy" // Add lazy loading for better performance
        onError={(e) => {
          // Hide image if flag fails to load
         
          e.currentTarget.style.display = "none";
        }}
      />
    );
  }
  return null;
}
