"use client";
import LoadingBouncer from "@/components/loading";
import { NotificationInterface } from "@/components/types/types";
import { useEffect, useState } from "react";

const NotificationPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    []
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/notification`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setNotifications(data.data);
        if (!response.ok) {
          throw new Error(data.message);
        }
        console.log(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  console.log(notifications);
  return (
    <div className="pt-24 px-32 font-nunito font-extrabold text-2xl">
      {isLoading && <LoadingBouncer />}
      <h1>Notifications</h1>
    </div>
  );
};

export default NotificationPage;
