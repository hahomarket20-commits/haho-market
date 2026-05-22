import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import { supabase } from "../supabase/client"
import toast from "react-hot-toast"

const NotificationContext = createContext()

export function NotificationProvider({
  children,
}) {

  // 🔔 notifications
  const [notifications, setNotifications] =
    useState([])

  // ⏳ loading
  const [loading, setLoading] =
    useState(true)

  // 📖 open dropdown
  const [openNotifications, setOpenNotifications] =
    useState(false)

  // 👤 GET USER
  const getUser = async () => {

    const { data, error } =
      await supabase.auth.getUser()

    if (error) {
      console.log(error)
      return null
    }

    return data?.user || null
  }

  // ✅ FETCH NOTIFICATIONS
  const fetchNotifications =
    async () => {

      try {

        setLoading(true)

        const user = await getUser()

        // ❌ no user
        if (!user) {

          setNotifications([])

          setLoading(false)

          return
        }

        // ✅ fetch notifications
        const { data, error } =
          await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", {
              ascending: false,
            })

        if (error) {

          console.log(error)

          toast.error(
            "Failed to load notifications"
          )

          setLoading(false)

          return
        }

        setNotifications(data || [])

        setLoading(false)

      } catch (error) {

        console.log(error)

        setLoading(false)
      }
    }

  // ✅ MARK AS READ
  const markAsRead =
    async (id) => {

      try {

        // UI UPDATE FIRST
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id
              ? {
                  ...n,
                  is_read: true,
                }
              : n
          )
        )

        // DATABASE UPDATE
        const { error } =
          await supabase
            .from("notifications")
            .update({
              is_read: true,
            })
            .eq("id", id)

        if (error) {
          console.log(error)
        }

      } catch (error) {
        console.log(error)
      }
    }

  // ✅ MARK ALL AS READ
  const markAllAsRead =
    async () => {

      try {

        const user = await getUser()

        if (!user) return

        // UI UPDATE
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            is_read: true,
          }))
        )

        // DATABASE UPDATE
        const { error } =
          await supabase
            .from("notifications")
            .update({
              is_read: true,
            })
            .eq("user_id", user.id)
            .eq("is_read", false)

        if (error) {
          console.log(error)
        }

      } catch (error) {
        console.log(error)
      }
    }

  // ✅ DELETE NOTIFICATION
  const deleteNotification =
    async (id) => {

      try {

        // UI UPDATE
        setNotifications((prev) =>
          prev.filter((n) => n.id !== id)
        )

        // DATABASE DELETE
        const { error } =
          await supabase
            .from("notifications")
            .delete()
            .eq("id", id)

        if (error) {

          console.log(error)

          toast.error(
            "Failed to delete notification"
          )
        }

      } catch (error) {
        console.log(error)
      }
    }

  // ✅ ADD NOTIFICATION
  const addNotification =
    async ({
      title,
      message,
      type = "info",
    }) => {

      try {

        const user = await getUser()

        if (!user) return

        const { data, error } =
          await supabase
            .from("notifications")
            .insert({
              user_id: user.id,
              title,
              message,
              type,
            })
            .select()
            .single()

        if (error) {

          console.log(error)

          return
        }

        // UI UPDATE
        setNotifications((prev) => [
          data,
          ...prev,
        ])

      } catch (error) {
        console.log(error)
      }
    }

  // 🔴 UNREAD COUNT
  const unreadCount =
    notifications.filter(
      (n) => !n.is_read
    ).length

  // ✅ REALTIME SUBSCRIPTION
  useEffect(() => {

    fetchNotifications()

    const channel = supabase

      .channel("realtime-notifications")

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        async () => {

          await fetchNotifications()
        }
      )

      .subscribe()

    // CLEANUP
    return () => {

      supabase.removeChannel(channel)
    }

  }, [])

  // ✅ CONTEXT VALUE
  const value = useMemo(
    () => ({

      notifications,

      loading,

      unreadCount,

      openNotifications,

      setOpenNotifications,

      fetchNotifications,

      markAsRead,

      markAllAsRead,

      deleteNotification,

      addNotification,

    }),
    [
      notifications,
      loading,
      unreadCount,
      openNotifications,
    ]
  )

  return (
    <NotificationContext.Provider
      value={value}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications =
  () => useContext(NotificationContext)