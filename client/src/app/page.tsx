// app/dashboard/page.tsx
"use client";
import { withAuthAndOnboarding } from "@/components/HOC";
function Home() {
  return (
    <div>
      <h1>Your Dashboard</h1>
      {/* Protected content */}
    </div>
  );
}
export default withAuthAndOnboarding(Home);
