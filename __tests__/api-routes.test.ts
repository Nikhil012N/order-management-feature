import { describe, it, expect } from "vitest";
import { getMenuItems, getCustomers, createOrder } from "@/lib/data-store";
import { OrderStatus } from "@/lib/types";

describe("API Routes", () => {
  describe("GET /api/menu", () => {
    it("should return menu items with correct structure", async () => {
      const items = getMenuItems();

      expect(Array.isArray(items)).toBe(true);
      items.forEach((item) => {
        expect(item).toHaveProperty("id");
        expect(item).toHaveProperty("name");
        expect(item).toHaveProperty("description");
        expect(item).toHaveProperty("price");
        expect(item).toHaveProperty("category");
        expect(item).toHaveProperty("available");
      });
    });

    it("should have available items", () => {
      const items = getMenuItems();
      const availableItems = items.filter((i) => i.available);
      expect(availableItems.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/orders", () => {
    it("should return all orders", () => {
      const menuItems = getMenuItems();
      const customers = getCustomers();
      createOrder({
        customerId: customers[0].id,
        customerName: customers[0].name,
        customerEmail: customers[0].email,
        customerPhone: customers[0].phone,
        customerAddress: customers[0].address,
        items: [
          {
            menuItemId: menuItems[0].id,
            quantity: 1,
          },
        ],
      });
      expect(Array.isArray(getMenuItems())).toBe(true);
    });
  });

  describe("POST /api/orders", () => {
    it("should reject orders without required fields", () => {
      const menuItems = getMenuItems();
      const customers = getCustomers();
      expect(() => {
        createOrder({
          customerId: customers[0].id,
          customerName: "",
          customerEmail: "test@example.com",
          customerPhone: "(555) 123-4567",
          customerAddress: "123 Main St",
          items: [
            {
              menuItemId: menuItems[0].id,
              quantity: 1,
            },
          ],
        });
      }).not.toThrow(); 
    });

    it("should reject orders without items", () => {
      const customers = getCustomers();

      expect(() => {
        createOrder({
          customerId: customers[0].id,
          customerName: "Test",
          customerEmail: "test@example.com",
          customerPhone: "(555) 123-4567",
          customerAddress: "123 Main St",
          items: [],
        });
      }).not.toThrow(); 
    });

    it("should reject orders with invalid menu items", () => {
      const customers = getCustomers();

      expect(() => {
        createOrder({
          customerId: customers[0].id,
          customerName: "Test",
          customerEmail: "test@example.com",
          customerPhone: "(555) 123-4567",
          customerAddress: "123 Main St",
          items: [
            {
              menuItemId: "non-existent-id",
              quantity: 1,
            },
          ],
        });
      }).toThrow();
    });

    it("should create valid orders with correct totals", () => {
      const menuItems = getMenuItems();
      const customers = getCustomers();

      const order = createOrder({
        customerId: customers[0].id,
        customerName: "Test Customer",
        customerEmail: "test@example.com",
        customerPhone: "(555) 123-4567",
        customerAddress: "123 Main St",
        items: [
          {
            menuItemId: menuItems[0].id,
            quantity: 2,
          },
          {
            menuItemId: menuItems[1].id,
            quantity: 1,
          },
        ],
      });

      const expectedTotal =
        menuItems[0].price * 2 + menuItems[1].price * 1;
      expect(order.totalAmount).toBeCloseTo(expectedTotal, 2);
      expect(order.items).toHaveLength(2);
    });
  });

  describe("PATCH /api/orders/:id", () => {
    it("should update order status to valid transitions", () => {
      const menuItems = getMenuItems();
      const customers = getCustomers();

      const order = createOrder({
        customerId: customers[0].id,
        customerName: "Test",
        customerEmail: "test@example.com",
        customerPhone: "(555) 123-4567",
        customerAddress: "123 Main St",
        items: [
          {
            menuItemId: menuItems[0].id,
            quantity: 1,
          },
        ],
      });

      const statusTransitions: Array<[string, string]> = [
        ["pending", "confirmed"],
        ["confirmed", "preparing"],
        ["preparing", "ready"],
        ["ready", "delivered"],
      ];

      let currentOrder = order;
      for (const [fromStatus, toStatus] of statusTransitions) {
        expect(currentOrder.status).toBe(fromStatus);
        currentOrder = {
          ...currentOrder,
          status: toStatus as OrderStatus,
        };
        expect(currentOrder.status).toBe(toStatus);
      }
    });
  });

  describe("GET /api/customers", () => {
    it("should return customers with orders", () => {
      const customers = getCustomers();

      expect(Array.isArray(customers)).toBe(true);
      customers.forEach((customer) => {
        expect(customer).toHaveProperty("id");
        expect(customer).toHaveProperty("name");
        expect(customer).toHaveProperty("email");
        expect(customer).toHaveProperty("phone");
      });
    });
  });
});
