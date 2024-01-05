/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter, redirect } from "next/navigation";

import axios from "axios";

import { Input } from "@/components/ui/input";
import { publicEnv } from "@/lib/env/public";
import { pusherClient } from "@/lib/pusher/client";

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

interface FoodData {
  id: string;
  name: string;
  count: number;
  image: string;
  event?: {
    userId: string;
    location: string;
    latest_time: string;
  };
}

function DetailsPage() {
  const { data: session } = useSession();
  if (!session || !session?.user) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  const router = useRouter();
  const [reserve, setReserve] = useState<boolean>(false);
  const [prevCount, setPrevCount] = useState<number | undefined>(0);
  const [foodCount, setFoodCount] = useState<number | undefined>(0);
  const [reservecount, setReserveCount] = useState<number>(1);
  const [creatorname, setCreatorname] = useState<string>("");
  const [food, setFood] = useState<FoodData | null>(null);
  const { foodId } = useParams();

  // pusher
  const [dbcount, setDbCount] = useState<number | undefined>(0);
  const [count, setCount] = useState<number | undefined>(0);

  // update food information
  useEffect(() => {
    const fetchFood = async () => {
      try {
        // 取得食物資訊
        const response = await axios.get(`/api/foods/${foodId}`);
        setFood(response.data);
        setFoodCount(food?.count);
        console.log("食物剩餘數量" + foodCount);

        // 查看user是否已經預定過，若預定過了就disable按鈕
        const reserve_or_not = await axios.get(`/api/userAndFood/${foodId}`);
        console.log(JSON.parse(reserve_or_not.data));
        setReserve(reserve_or_not.data);
        console.log("是否要預定" + reserve);

        if (!reserve) {
          const reserved_count = await axios.get(`/api/seeCount/${foodId}`);
          setPrevCount(reserved_count.data);
          setReserveCount(Number(prevCount));
          console.log(prevCount);
        }
      } catch (error) {
        console.error("Error fetching food:", error);
      }
    };
    fetchFood();
  }, [foodId, food?.count, foodCount, reserve, setReserve, prevCount]);

  // Subscribe to pusher events
  useEffect(() => {
    const channelName = foodId[0];
    try {
      const channel = pusherClient.subscribe(channelName);
      channel.bind("foodcount:update", (reservecount: number) => {
        setCount(reservecount);
        setDbCount(reservecount);
        router.refresh();
      });
    } catch (error) {
      console.log("pusher error");
    }
    // Unsubscribe from pusher events when the component unmounts
    return () => {
      pusherClient.unsubscribe(channelName);
    };
  });

  axios
    .get(`/api/user/${food?.event?.userId}`)
    .then((res) => {
      console.log(res.data);
      setCreatorname(res.data);
    })
    .catch((error) => {
      console.log(error);
    });

  const handleClick = () => {
    router.push(`/taste/user/${food?.event?.userId}`);
  };

  const data = { reserve, foodId, reservecount, foodCount };

  const handleResClick = async () => {
    if (reserve) {
      if (food === null) {
        console.log("food is null");
      } else {
        if (food.count < reservecount || reservecount <= 0) {
          alert("預訂數量錯誤");
        } else {
          axios
            .post("/api/reservations", {
              ...data,
            })
            .then((res) => {
              console.log(res.data);
            });
        }
      }
      setReserve(false);
    } else {
      axios
        .post(`/api/reservations`, {
          ...data,
        })
        .then((res) => {
          console.log(res.data);
        });
      const reserve_or_not = await axios.get(`/api/userAndFood/${foodId}`);
      console.log("已有資料" + reserve_or_not.data);
      setReserve(true);
    }
  };

  return (
    <div className="my-32 h-screen w-full space-y-12 px-24 pb-32">
      <div className="flex h-10 items-end justify-start space-x-6">
        <div className="select-none text-3xl">{food?.name}</div>
        <div
          className="mb-0.5 cursor-pointer select-none text-lg"
          onClick={() => handleClick()}
        >
          @{creatorname}
        </div>
      </div>
      {/* flex justify-start space-x-24 */}
      <div className="no-scrollbar grid h-4/5 grid-cols-2 items-center gap-24 overflow-y-scroll">
        <Image
          src={food?.image?.replace(/['"]+/g, "") || "/potato-salad.svg"}
          alt="food"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          priority
        />
        <div className="flex flex-col">
          <hr className="mb-8 h-0.5 border-0 bg-gray-300"></hr>
          <div className="flex select-none flex-col space-y-6">
            <div className="text-xl">數量：{food?.count}</div>
            <div className="text-xl">取餐時間：{food?.event?.latest_time}</div>
            <div className="text-xl">取餐地點：{food?.event?.location}</div>
          </div>
          <hr className="my-6 mb-8 h-0.5 border-0 bg-gray-300"></hr>
          <Input
            type="number"
            placeholder="預訂數量"
            className="my-3 flex h-10 w-full rounded-md border border-black text-base"
            onChange={(e) => {
              setReserveCount(Number(e.target.value));
            }}
            value={reservecount}
            disabled={!reserve}
          />
          {!reserve ? (
            <button
              className="focus:shadow-outline min-w-[100px] rounded-xl bg-gray-300 bg-opacity-80 px-4 py-2 text-xl font-semibold text-gray-500 hover:bg-opacity-70 focus:outline-none"
              type="button"
              onClick={handleResClick}
            >
              已預訂。再按一次以取消預訂
            </button>
          ) : (
            <button
              className="focus:shadow-outline min-w-[100px] rounded-xl bg-lime-700 bg-opacity-80 px-4 py-2 text-xl font-semibold text-white hover:bg-opacity-70 focus:outline-none"
              type="button"
              onClick={handleResClick}
            >
              預訂
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default DetailsPage;
