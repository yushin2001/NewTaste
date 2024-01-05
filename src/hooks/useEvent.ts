import { useEffect, useMemo, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { useDebounce } from "use-debounce";

import type { Event } from "@/lib/types/db";

export const useEvent = () => {
  const { eventId } = useParams();
  const eventID = Array.isArray(eventId) ? eventId[0] : eventId;
  const [event, setEvent] = useState<Event | null>(null);
  const [dbEvent, setDbEvent] = useState<Event | null>(null);
  const debounceMilliseconds = 300;
  const [debouncedEvent] = useDebounce(event, debounceMilliseconds);
  const [debouncedDbEvent] = useDebounce(dbEvent, debounceMilliseconds);
  const router = useRouter();

  const isSynced = useMemo(() => {
    if (debouncedEvent === null || debouncedDbEvent === null) return true;
    return (
      debouncedEvent.categoryName === debouncedDbEvent.categoryName &&
      debouncedEvent.location === debouncedDbEvent.location
    );
  }, [debouncedEvent, debouncedDbEvent]);

  useEffect(() => {
    if (isSynced) return;

    const updateEvent = async () => {
      if (!debouncedEvent) return;
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryName: debouncedEvent?.categoryName,
        }),
      });
      if (!res.ok) {
        return;
      }
      const data: Event = await res.json();
      if (debouncedDbEvent?.categoryName !== data.categoryName) {
        router.refresh();
      }
      setDbEvent(data);
    };
    updateEvent();
  }, [debouncedEvent, eventId, router, debouncedDbEvent, isSynced]);

  // 用eventID取得event資料，送進event和dbEvent
  useEffect(() => {
    if (!eventID) return;
    const fetchEvent = async () => {
      const res = await fetch(`/api/events/${eventID}`);
      if (!res.ok) {
        setEvent(null);
        router.push("/taste");
        return;
      }
      const data = await res.json();
      setEvent(data);
      setDbEvent(data);
    };
    fetchEvent();
  }, [eventID, router]);

  // 設置event的種類
  const categoryName = event?.categoryName || "";
  const setCategotyName = (newCategoryName: string) => {
    if (event === null) return;
    setEvent({
      ...event,
      categoryName: newCategoryName,
    });
  };

  // 設置event的位置（對應：新增event畫面 - 輸入位置）
  const location = event?.location || "";
  const setLocation = (newLocation: string) => {
    if (event === null) return;
    setEvent({
      ...event,
      location: newLocation,
    });
  };

  return {
    eventId,
    event,
    categoryName,
    setCategotyName,
    location,
    setLocation,
  };
};
