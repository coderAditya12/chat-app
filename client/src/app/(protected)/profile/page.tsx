"use client";
import { withAuthAndOnboarding } from "@/components/HOC";
import { getLanguageFlag } from "@/components/FriendCard";
import { capitialize } from "@/lib/utilis";
import userAuthStore from "@/store/userStore";
import {
    UserIcon,
    Languages,
    Globe,
    ArrowLeft,
    Mail,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const ProfilePage = () => {
    const { user } = userAuthStore((state) => state);

    if (!user) return null;

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto max-w-2xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                    <Link href="/" className="btn btn-ghost btn-sm btn-circle">
                        <ArrowLeft className="size-5" />
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Your Profile
                    </h1>
                </div>

                {/* Profile Card */}
                <div className="card bg-base-200 border border-base-300/50">
                    <div className="card-body items-center text-center p-6 sm:p-8">
                        {/* Avatar */}
                        <div className="avatar mb-4">
                            <div className="w-24 sm:w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-3">
                                <img
                                    src={user.profilePic || "/default-avatar.png"}
                                    alt={user.fullName}
                                />
                            </div>
                        </div>

                        {/* Name */}
                        <h2 className="text-2xl font-bold">{user.fullName}</h2>

                        {/* Email */}
                        <div className="flex items-center gap-2 text-base-content/60 text-sm mt-1">
                            <Mail className="size-4" />
                            {user.email}
                        </div>

                        {/* Bio */}
                        {user.bio && (
                            <p className="text-base-content/70 mt-3 max-w-md">
                                {user.bio}
                            </p>
                        )}
                    </div>
                </div>

                {/* Languages Card */}
                <div className="card bg-base-200 border border-base-300/50">
                    <div className="card-body p-6">
                        <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                            <Languages className="size-5 text-primary" />
                            Languages
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Native Language */}
                            <div className="bg-base-100 rounded-xl p-4 border border-base-300/50">
                                <p className="text-xs text-base-content/50 uppercase tracking-wider mb-2">
                                    I speak
                                </p>
                                <div className="flex items-center gap-2">
                                    {getLanguageFlag({ language: user.nativeLanguage })}
                                    <span className="font-semibold text-lg">
                                        {capitialize(user.nativeLanguage || "Not set")}
                                    </span>
                                </div>
                            </div>

                            {/* Learning Language */}
                            <div className="bg-base-100 rounded-xl p-4 border border-base-300/50">
                                <p className="text-xs text-base-content/50 uppercase tracking-wider mb-2">
                                    I&apos;m learning
                                </p>
                                <div className="flex items-center gap-2">
                                    {getLanguageFlag({ language: user.learningLanguage })}
                                    <span className="font-semibold text-lg">
                                        {capitialize(user.learningLanguage || "Not set")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location Card */}
                {user.location && (
                    <div className="card bg-base-200 border border-base-300/50">
                        <div className="card-body p-6">
                            <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                                <UserIcon className="size-5 text-secondary" />
                                About
                            </h3>
                            <div className="flex items-center gap-3">
                                <Globe className="size-4 text-base-content/50" />
                                <span className="text-base-content/80">{user.location}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default withAuthAndOnboarding(ProfilePage);
