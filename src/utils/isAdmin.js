import { supabase } from "../supabase/client"

export const isAdmin = async (userEmail) => {
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("email", userEmail)
    .single()

  if (error || !data) {
    return false
  }

  return true
}