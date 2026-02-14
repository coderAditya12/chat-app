import { UsersIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const NoFriendsFound = () => {
  return (
    <div className="card bg-base-200 p-8 sm:p-12 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-primary/10 rounded-full p-5">
          <UsersIcon className="size-10 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">No friends yet</h3>
        <p className="text-base-content/60 max-w-sm">
          Start connecting with language learners! Check the recommendations below or browse friend requests.
        </p>
        <Link href="/notifications" className="btn btn-primary btn-sm mt-2">
          View Friend Requests
        </Link>
      </div>
    </div>
  );
};

export default NoFriendsFound;
