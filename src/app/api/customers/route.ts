import { NextRequest, NextResponse } from "next/server";
import { getCustomers, createCustomer, getOrdersByCustomerId } from "@/lib/data-store";

export async function GET() {
  try {
    const customers = getCustomers();
    const customerData = customers.map((customer) => ({
      ...customer,
      orders: getOrdersByCustomerId(customer.id),
    }));
    return NextResponse.json({ success: true, data: customerData });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const customer = createCustomer(body);
    return NextResponse.json({ success: true, data: customer }, { status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create customer";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}
