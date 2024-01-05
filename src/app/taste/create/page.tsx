"use client";

import { useForm, useFieldArray } from "react-hook-form";

// import { HiPhoto } from "react-icons/hi2";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import { useRouter, redirect } from "next/navigation";

import axios from "axios";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { publicEnv } from "@/lib/env/public";

/* eslint-disable @typescript-eslint/no-explicit-any */

type FormValues = {
  taste_info: {
    taste_name: string;
    taste_count: number;
    taste_photo: string; // url
  }[];
  taste_category: string;
  taste_time: string; // data
  taste_place: string;
};

function CreatePage() {
  const { data: session } = useSession();
  if (!session || !session?.user) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  const userId = session.user?.id;
  const router = useRouter();

  const form = useForm<FormValues>({
    defaultValues: {
      taste_info: [
        {
          taste_name: "",
          taste_count: 1,
          taste_photo: "",
        },
      ],
      taste_category: "",
      taste_time: "",
      taste_place: "",
    },
  });

  const { register, setValue, control, handleSubmit, formState } = form;
  // const { register, setValue, control, handleSubmit, watch, formState } = form;

  const { fields, append, remove } = useFieldArray({
    name: "taste_info",
    control,
  });

  const { errors } = formState;

  // const handleUploadImg = async (error: any, result: any) => {
  //   if (error) {
  //     console.log(error);
  //   }
  //   const format = result?.info?.format || result?.info?.original_extension;
  //   // if (format != "jpg" && format != "jpeg" && format != "png") {
  //   //   alert("請上傳 jpg, jpeg, png 格式的檔案");
  //   //   return;
  //   // }
  //   console.log(result?.info?.secure_url);
  //   console.log(`${result?.info?.original_filename}.${format}`);
  //   console.log(result);
  //   //   setValue(`taste_info.${index}.taste_photo`, result.info.secure_url, {
  //   //     shouldValidate: true,
  //   //   });
  //   return result?.info?.secure_url as string;
  // };

  // const handleUpload = (result: any) => {
  //   console.log(result?.info?.secure_url);
  // };

  const onSubmit = (data: FormValues) => {
    if (!userId) return;
    console.log("form submitted:", data);
    axios.post("/api/events", {
      ...data,
    });
    router.refresh();
    router.push("/taste");
  };

  const getTimePlaceholder = () => {
    const time = new Date();
    let hour = time.getHours().toString();
    let minute = time.getMinutes().toString();
    if (hour.length < 2) {
      hour = "0" + hour;
    }
    if (minute.length < 2) {
      minute = "0" + minute;
    }
    return `e.g. ${hour}:${minute}`;
  };

  return (
    <form
      className="flex h-screen w-full select-none justify-center space-y-6 px-24 py-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="no-scrollbar mt-24 flex flex-col space-y-6 overflow-y-scroll">
        {fields.map((field, index) => (
          <div
            key={`taste-name-${field.id}`}
            className="mt-12 flex flex-row items-center space-x-6"
          >
            <div className="w-80">
              <Label htmlFor="taste-name" className="text-base font-semibold">
                餐點名稱
              </Label>
              <Input
                type="text"
                id="taste-name"
                className="flex h-10 w-full rounded-md border border-black text-base"
                required
                {...register(`taste_info.${index}.taste_name` as const, {
                  required: {
                    value: true,
                    message: "必要欄位",
                  },
                })}
              />
            </div>
            <div className="w-20" key={`taste-count-${field.id}`}>
              <Label htmlFor="taste-count" className="text-base font-semibold">
                數量
              </Label>
              <Input
                type="text"
                id="taste-count"
                className="flex h-10 w-full rounded-md border border-black text-base"
                required
                // value = {val.count}
                {...register(`taste_info.${index}.taste_count` as const, {
                  required: {
                    value: true,
                    message: "必要欄位",
                  },
                })}
              />
            </div>
            <div key={`taste-photo-${field.id}`}>
              {/* <Label className="text-base font-semibold">照片</Label> */}
              {/* <label className="" htmlFor="taste-photo">
                <input
                  className="mr-6 mt-5 w-36"
                  type="file"
                  accept="image/jpeg, image/jpg, image/png"
                  id="taste-photo"
                  required
                  {...register(`taste_info.${index}.taste_photo` as const, {
                    required: {
                      value: true,
                      message: "必要欄位",
                    },
                  })}
                ></input>
              </label> */}
              <CldUploadButton
                options={{
                  maxFiles: 1,
                  // resourceType: "image/jpeg, image/jpg, image/png",
                }}
                // onUpload={async (error: any, result: any) => {
                //   const url = await handleUploadImg(error, result);
                //   console.log(result);
                // }}
                // onUpload={handleUpload}
                uploadPreset={publicEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET}
                key={`taste-cld-upload-btn-${field.id}`}
                onSuccess={(result: any) => {
                  console.log(result);
                  console.log(result.info.secure_url);
                  console.log(result.info.secure_url.replace('"', ""));
                  setValue(
                    `taste_info.${index}.taste_photo`,
                    result.info.secure_url,
                    {
                      shouldValidate: true,
                    },
                  );
                }}
              >
                {/* <HiPhoto size={30} className="text-sky-500" /> */}
                <button className="mr-6 mt-5 w-36 border border-black bg-theme-light-green-hover py-2 text-base font-semibold text-black hover:bg-theme-light-green-hover focus:outline-none">
                  上傳照片
                </button>
              </CldUploadButton>
            </div>
            {index === 0 && (
              <button
                type="button"
                className="mt-5"
                onClick={() =>
                  append({ taste_name: "", taste_count: 1, taste_photo: "" })
                }
                key={`taste-add-fields-${field.id}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="ml-10 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            )}
            {index > 0 && (
              <button
                type="button"
                className="mt-5"
                onClick={() => remove(index)}
                key={`taste-remove-fields-${field.id}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="ml-10 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}

        <div className="flex space-x-6">
          <div className="w-20">
            <Label htmlFor="taste-categoy" className="text-base font-semibold">
              標籤
            </Label>
            <select
              {...register("taste_category", {
                required: {
                  value: true,
                  message: "必要欄位",
                },
              })}
              id="taste-category"
              className="block h-10 w-full rounded-md border border-black px-2 text-base focus:border-theme-green"
            >
              <option value="none" disabled hidden>
                ----
              </option>
              <option value="taiwnese">臺式</option>
              <option value="chinese">中式</option>
              <option value="western">西式</option>
              <option value="japanese">日式</option>
              <option value="korean">韓式</option>
              <option value="breakfast">早餐</option>
              <option value="drinks">飲料</option>
              <option value="desserts">甜點</option>
            </select>
            <p className="pt-0.5 text-xs text-[#C14B25]">
              {errors.taste_category?.message}
            </p>
          </div>
          <div className="w-3/5">
            <Label htmlFor="taste-time" className="text-base font-semibold">
              最後取餐時間
            </Label>
            <Input
              type="text"
              id="taste-time"
              className="flex h-10 w-4/5 rounded-md border border-black text-base"
              {...register("taste_time", {
                required: {
                  value: true,
                  message: "必要欄位",
                },
              })}
              placeholder={getTimePlaceholder()}
              pattern="\d{2}:\d{2}"
            />
            <p className="pt-0.5 text-xs text-[#C14B25]">
              {errors.taste_time?.message}
            </p>
          </div>
        </div>
        <div>
          <Label htmlFor="taste-place" className="text-base font-semibold">
            取餐地點
          </Label>
          <Input
            type="text"
            id="taste-place"
            className="flex h-10 w-4/5 rounded-md border border-black text-base"
            {...register("taste_place", {
              required: {
                value: true,
                message: "必要欄位",
              },
            })}
          />
          <p className="pt-0.5 text-xs text-[#C14B25]">
            {errors.taste_place?.message}
          </p>
        </div>
        <button
          type="submit"
          className="focus:shadow-outline w-24 rounded-xl border border-black bg-theme-light-green-hover py-2 text-base font-semibold text-black hover:bg-theme-light-green-hover focus:outline-none"
        >
          確定新增
        </button>
      </div>
    </form>
  );
}
export default CreatePage;
