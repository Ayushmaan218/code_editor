"use client";

import { SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { User } from "lucide-react";

function HeaderProfileBtn() {
  return (
    <>
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Link
            label="Profile"
            labelIcon={<User className="size-4" />}
            href="/profile"
          />
        </UserButton.MenuItems>
      </UserButton>

      <SignedOut>
      <SignInButton mode="modal">
        <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-xs sm:text-sm">
          Sign In
        </button>
      </SignInButton>
    </SignedOut>
    </>
  );
}
export default HeaderProfileBtn;
