"use client";

import { useState } from "react";

import { Oswald } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import axios from "axios";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const oswald = Oswald({
  weight: "300",
  subsets: ["latin"],
});

function Navbar() {
  const router = useRouter();
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState<string>("");

  axios
    .get("/api/user")
    .then((res) => {
      setUsername(res.data);
    })
    .catch((error) => {
      console.log(error);
    });

  const handleClick = () => {
    router.push("/taste/create");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      console.log("searchQuery:", searchQuery);
      axios
        .get(`/api/search/${searchQuery}`)
        .then((res) => {
          console.log(res.data);
          router.push(`/taste/user/${res.data}`);
          setTimeout(() => {
            setSearchQuery("");
          }, 0);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <nav className="fixed flex w-full flex-wrap justify-between border-r bg-theme-green bg-opacity-30 py-6">
      <div className={oswald.className}>
        <div
          className="cursor-pointer select-none px-10 text-4xl"
          onClick={() => {
            router.refresh();
            router.push("/taste");
          }}
        >
          NewTaste
        </div>
      </div>
      <div className="flex space-x-10 px-10">
        <button
          className="focus:shadow-outline min-w-[100px] rounded bg-theme-green bg-opacity-80 px-4 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#b1c381] hover:bg-opacity-70 focus:outline-none"
          type="button"
          onClick={() => handleClick()}
        >
          新增餐點
        </button>

        <div className="flex items-center space-x-6">
          {isSearch && (
            <ClickAwayListener onClickAway={() => setIsSearch(false)}>
              <Input
                type="search"
                placeholder="搜尋使用者"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                autoFocus
                className="h-8 rounded-md border border-black text-base"
              />
            </ClickAwayListener>
          )}

          <button onClick={() => setIsSearch(true)}>
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
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
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
            <DropdownMenuContent className="p-5">
              <DropdownMenuLabel>@{username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  router.push("/taste/myfood");
                }}
              >
                我的餐點
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  router.push("/taste/reservation");
                }}
              >
                我的訂單
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href={`/auth/signout`}>
                <DropdownMenuItem>登出</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
