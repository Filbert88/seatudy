"use client";
import { NotificationInterface } from "@/components/types/types";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import LoadingBouncer from "./loading";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { BsDot } from "react-icons/bs";

const UserNotificationPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    []
  );
  const [viewRead, setViewRead] = useState<boolean>(false);
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
  }, [toast, setNotifications, setViewRead]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notification/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId: id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      } else {
        const updatedNotifications = notifications.map((notification) => {
          if (notification.id === id) {
            return {
              ...notification,
              read: true,
            };
          }
          return notification;
        });
        setNotifications(updatedNotifications);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="pt-24 px-16 font-nunito">
      {isLoading ? (
        <LoadingBouncer />
      ) : (
        <>
          <div className="flex flex-row justify-between">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <button
              onClick={() => setViewRead(!viewRead)}
              className="bg-primary text-black px-5 py-2 rounded-md transition hover:opacity-65 font-nunito font-bold"
            >
              {viewRead ? "View Unread Message" : "View All Message"}
            </button>
          </div>
          {notifications.length > 0 ? (
            <ul className="font-nunito font-bold text-1xl">
              {notifications.map((notification) => (
                <div key={notification.id}>
                  {viewRead || !notification.read ? (
                    <div
                      className={`${
                        notification.read === false
                          ? "bg-white"
                          : "bg-slate-50 text-grays"
                      } text-black flex flex-row justify-between rounded-md my-2 py-3 px-3`}
                    >
                      <div className="flex flex-row">
                        <div className="mt-1">{notification.message}</div>
                        {notification.read === false ? (
                          <BsDot className="text-red-500 size-8" />
                        ) : null}
                      </div>
                      {notification.read === false ? (
                        <button
                          className="flex flex-row hover:cursor-pointer hover:bg-slate-100 transition rounded-md px-2 py-1"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <MdOutlineMarkEmailRead className="mr-3 my-1" />
                          <div className="text-black">Mark as read</div>
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </ul>
          ) : (
            <p className="font-nunito text-lg font-semibold">
              No notifications found
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default UserNotificationPage;
