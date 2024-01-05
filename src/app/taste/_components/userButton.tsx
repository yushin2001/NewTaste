import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

async function userButton() {
  return (
    <nav className="fixed flex w-full flex-wrap justify-between border-r bg-theme-green bg-opacity-30 py-6">
      <div className="flex space-x-16 px-10">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-9 w-9"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>@username</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>我的餐點</DropdownMenuItem>
            <DropdownMenuItem>我的訂單</DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href={`/auth/signout`}>
              <DropdownMenuItem>登出</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

export default userButton;
