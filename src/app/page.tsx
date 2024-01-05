"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";
import { Oswald } from "next/font/google";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { publicEnv } from "@/lib/env/public";

const oswald = Oswald({
  weight: "300",
  subsets: ["latin"],
});

export default function Login() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const handleSubmit = () => {
    if (isSignUp) {
      if (confirmpassword != password) {
        alert("Confirm password does not match password");
      } else {
        signIn("credentials", {
          username,
          password,
          callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}`,
        }).then((callback) => {
          if (callback?.error) {
            alert("Fail to sign up");
          } else {
            alert("Sign up successfully. Please sign in.");
          }
        });
      }
    } else {
      signIn("credentials", {
        username,
        password,
        callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/taste`,
      }).then((callback) => {
        if (callback?.error) {
          alert("Fail to sign in");
        }
      });
    }
  };
  return (
    <main className="flex-rows fixed top-0 flex h-screen w-full items-center overflow-hidden">
      <div className="flex w-3/5 min-w-[650px] max-w-[1000px] flex-col border-r bg-white pb-10">
        <div className={oswald.className}>
          <div className="mx-24 mt-20 select-none px-24 py-6 text-4xl text-theme-green">
            NewTaste
          </div>
        </div>
        <div className="mx-24 space-y-6 px-24 py-4">
          <Input
            type="username"
            placeholder="帳號"
            className="flex h-14 w-full rounded-md border border-black text-base"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
          />
          <Input
            type="password"
            placeholder="密碼"
            className="flex h-14 w-full rounded-md border border-black text-base"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
          />
          {isSignUp && (
            <Input
              type="password"
              placeholder="確認密碼"
              className="flex h-14 w-full rounded-md border border-black text-base"
              onChange={(e) => {
                setConfirmpassword(e.target.value);
              }}
              value={confirmpassword}
            />
          )}
          <div className="py-1">
            {isSignUp ? (
              <div>
                <button
                  className="focus:shadow-outline w-full rounded-xl border border-black bg-theme-light-green px-4 py-2 text-base font-semibold text-black hover:bg-theme-light-green-hover focus:outline-none"
                  type="button"
                  onClick={handleSubmit}
                >
                  新增帳號
                </button>
                <div className="py-2">
                  <a
                    className="cursor-pointer select-none text-sm hover:text-theme-green"
                    onClick={() => setIsSignUp(false)}
                  >
                    已有帳號？
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <button
                  className="focus:shadow-outline w-full rounded-xl border border-black bg-theme-light-green px-4 py-2 text-base font-semibold text-black hover:bg-theme-light-green-hover focus:outline-none"
                  type="button"
                  onClick={handleSubmit}
                >
                  登入
                </button>
                <div className="py-2">
                  <a
                    className="cursor-pointer select-none text-sm hover:text-theme-green"
                    onClick={() => setIsSignUp(true)}
                  >
                    申請帳號
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-2/5 min-w-[500px]">
        <Image
          src="/login-page.svg"
          alt="login page photo"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          priority
        />
      </div>
    </main>
  );
}
