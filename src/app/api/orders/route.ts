import { NextRequest, NextResponse } from "next/server";
import { getOrders, createOrder, getOrdersByCustomerId } from "@/lib/data-store";
import { CreateOrderRequest } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");

    let orders;
    if (customerId) {
      orders = getOrdersByCustomerId(customerId);
    } else {
      orders = getOrders();
    }
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateOrderRequest;
    if (
      !body.customerId ||
      !body.customerName ||
      !body.customerEmail ||
      !body.customerPhone ||
      !body.customerAddress
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required customer information" },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    const order = createOrder(body);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}
