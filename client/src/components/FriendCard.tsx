import { LANGUAGE_TO_FLAG } from "@/constants";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import React from "react";

const FriendCard = ({ friend, isOnline }: { friend: any; isOnline: boolean }) => {
  return (
    <div className="card bg-base-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-base-300/50">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar relative">
            <div className="w-12 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-1">
              <img src={friend.profilePic} alt={friend.fullName} />
            </div>
            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success border-2 border-base-100 rounded-full">
                <div className="w-full h-full bg-success rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{friend.fullName}</h3>
            <p className={`text-xs ${isOnline ? "text-success" : "text-base-content/40"}`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3 w-full">
          <span className="badge badge-secondary badge-sm gap-1">
            {getLanguageFlag({ language: friend.nativeLanguage })}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline badge-sm gap-1">
            {getLanguageFlag({ language: friend.learningLanguage })}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <Link href={`/chat/${friend.id}`} className="btn btn-primary btn-sm w-full gap-2">
          <MessageCircle className="size-4" />
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
        alt={`${language} flag`}
        className="h-3 mr-0.5 inline-block"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    );
  }
  return null;
}
