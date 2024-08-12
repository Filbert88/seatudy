"use client";
import LoadingBouncer from "@/components/loading";
import { NotificationInterface } from "@/components/types/types";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const NotificationPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    []
  );
  const { toast } = useToast();

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
        if (!response.ok) {
          throw new Error(data.message);
        }
        setNotifications(data.data);
      } catch (error) {
        console.error(error);
        toast({
          title: "Failed to load notifications",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, [toast]);

  return (
    <div className="pt-24 px-32 font-nunito font-extrabold text-2xl">
      {isLoading ? (
        <LoadingBouncer />
      ) : (
        <>
          <h1>Notifications</h1>
          {notifications.length > 0 ? (
            <ul className = "font-nunito font-bold text-1xl">
              {notifications.map((notification) => (
                <li key={notification.id} className = {`${notification.read ? "bg-slate-500" : "bg-white"} rounded-md my-2 py-3 px-3`}>{notification.message}</li>
              ))}
            </ul>
          ) : (
            <p className = "font-nunito text-lg font-semibold">No notifications found</p>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationPage;
