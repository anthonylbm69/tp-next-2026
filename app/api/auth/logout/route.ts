import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
  
  } catch (error) {
    console.error("Logout error:", error);
  }
  
  redirect("/"); 
}