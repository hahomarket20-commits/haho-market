import { useEffect, useRef } from "react"

import {
  useNotifications,
} from "../context/NotificationContext"

function NotificationBell() {

  const {

    notifications,

    unreadCount,

    openNotifications,

    setOpenNotifications,

    markAsRead,

    markAllAsRead,

    deleteNotification,

    loading,

  } = useNotifications()

  const dropdownRef = useRef()

  // ✅ CLOSE OUTSIDE
  useEffect(() => {

    const handleClickOutside =
      (e) => {

        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target)
        ) {
          setOpenNotifications(false)
        }
      }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    )

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      )
    }

  }, [])

  return (

    <div
      ref={dropdownRef}
      className="relative"
    >

      {/* 🔔 BUTTON */}
      <button
        onClick={() =>
          setOpenNotifications(
            !openNotifications
          )
        }
        className="relative w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-yellow-400 transition flex items-center justify-center text-xl"
      >

        🔔

        {/* 🔴 BADGE */}
        {unreadCount > 0 && (

          <div className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">

            {unreadCount > 99
              ? "99+"
              : unreadCount}

          </div>
        )}

      </button>

      {/* ✅ DROPDOWN */}
      {openNotifications && (

        <div className="absolute right-0 mt-3 w-[360px] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-50">

          {/* HEADER */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">

            <h2 className="font-black text-lg text-white">
              Notifications
            </h2>

            {notifications.length > 0 && (

              <button
                onClick={markAllAsRead}
                className="text-xs text-yellow-400 hover:text-yellow-300"
              >
                Mark all read
              </button>
            )}

          </div>

          {/* CONTENT */}
          <div className="max-h-[450px] overflow-y-auto">

            {/* ⏳ LOADING */}
            {loading && (

              <div className="p-6 text-center text-zinc-500">
                Loading...
              </div>
            )}

            {/* ❌ EMPTY */}
            {!loading &&
              notifications.length === 0 && (

              <div className="p-10 text-center text-zinc-500">

                <div className="text-5xl mb-3">
                  🔔
                </div>

                No notifications

              </div>
            )}

            {/* ✅ NOTIFICATIONS */}
            {!loading &&
              notifications.map((n) => (

              <div
                key={n.id}
                onClick={() =>
                  markAsRead(n.id)
                }
                className={`group p-5 border-b border-zinc-800 cursor-pointer transition hover:bg-zinc-900 ${
                  !n.is_read
                    ? "bg-zinc-900/70"
                    : ""
                }`}
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="flex-1">

                    {/* TITLE */}
                    <div className="flex items-center gap-2">

                      {!n.is_read && (
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      )}

                      <h3 className="font-bold text-sm text-white">
                        {n.title}
                      </h3>

                    </div>

                    {/* MESSAGE */}
                    <p className="text-sm text-zinc-400 mt-2 leading-relaxed">

                      {n.message}

                    </p>

                    {/* DATE */}
                    <p className="text-xs text-zinc-600 mt-3">

                      {new Date(
                        n.created_at
                      ).toLocaleString()}

                    </p>

                  </div>

                  {/* DELETE */}
                  <button
                    onClick={(e) => {

                      e.stopPropagation()

                      deleteNotification(
                        n.id
                      )
                    }}
                    className="opacity-0 group-hover:opacity-100 transition text-zinc-500 hover:text-red-500"
                  >
                    ✕
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>
      )}

    </div>
  )
}

export default NotificationBell