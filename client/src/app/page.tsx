"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

const page = () => {
  return (
    <div>
      <Link href="/signup">signup</Link>
    </div>
  );
};

export default page;
