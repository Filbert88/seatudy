"use client"
import { NotificationInterface } from "@/components/types/types";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useState } from "react";
import LoadingBouncer from "./loading";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { BsDot } from "react-icons/bs";

const InstructorNotificationPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [notifications, setNotifications] = useState<NotificationInterface[]>([]);
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

      const handleMarkAsRead = async (id: string) => {
        try{
          setIsLoading(true);
          const response = await fetch(`/api/notification/read`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({notificationId: id}),
          })
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message);
          }
        }
        catch (error) {
          console.error(error);
          toast({
            title: "Failed to mark notification as read",
            variant: "destructive",
          });
        }
        finally {
          setIsLoading(false);
        }
      }

    return (
        <div className = "pt-24 px-16 font-nunito">
            {isLoading ? (<LoadingBouncer />) : (
                <>
                    <h1 className = "text-2xl font-bold">Notifications</h1>
                    {notifications.length > 0 ? (
                        <ul className = "font-nunito font-bold text-1xl">
                            {notifications.map((notification) => (
                                <div key={notification.id}>
                                  {notification.read ? (
                                    <div className = "bg-white text-black flex flex-row justify-between rounded-md my-2 py-3 px-3">
                                    <div className = "flex flex-row">
                                      <div className = "mt-1">{notification.message}</div>
                                      <BsDot className = "text-red-500 size-8"/>
                                    </div>
                                      <div className = "flex flex-row hover:cursor-pointer hover:bg-slate-100 rounded-md p-1" onClick={() => handleMarkAsRead(notification.id)}>
                                        <MdOutlineMarkEmailRead className = "mr-3 my-1"/>
                                        <div className = "text-black">Mark as read</div>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                            ))}
                        </ul>
                    ) : (
                        <p className = "font-nunito text-lg font-semibold">No notifications found</p>
                    )}
                </>
            )}
        </div>
    )
}

export default InstructorNotificationPage;