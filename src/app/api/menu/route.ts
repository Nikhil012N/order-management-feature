import { NextResponse } from "next/server";
import { getMenuItems } from "@/lib/data-store";

export async function GET() {
  try {
    const menuItems = getMenuItems();
    return NextResponse.json({ success: true, data: menuItems });
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch menu" },
      { status: 500 }
    );
  }
}
