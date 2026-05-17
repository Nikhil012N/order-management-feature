import { describe, it, expect, beforeEach } from "vitest";
import {
  getMenuItems,
  getCustomers,
  createOrder,
  getOrder,
  updateOrderStatus,
  getOrdersByCustomerId,
  getOrderStats,
} from "@/lib/data-store";
import { CreateOrderRequest } from "@/lib/types";

describe("Data Store", () => {
  describe("Menu Operations", () => {
    it("should fetch menu items", () => {
      const items = getMenuItems();
      expect(items).toHaveLength(6);
      expect(items[0]).toHaveProperty("name");
      expect(items[0]).toHaveProperty("price");
    });

    it("should have valid menu items", () => {
      const items = getMenuItems();
      items.forEach((item) => {
        expect(item.id).toBeDefined();
        expect(item.name).toBeDefined();
        expect(item.price).toBeGreaterThan(0);
        expect(item.category).toBeDefined();
      });
    });
  });

  describe("Customer Operations", () => {
    it("should fetch existing customers", () => {
      const customers = getCustomers();
      expect(customers.length).toBeGreaterThanOrEqual(2);
      expect(customers[0]).toHaveProperty("name");
      expect(customers[0]).toHaveProperty("email");
    });

    it("should have unique customer IDs", () => {
      const customers = getCustomers();
      const ids = customers.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe("Order Operations", () => {
    let customerId: string;

    beforeEach(() => {
      const customers = getCustomers();
      customerId = customers[0].id;
    });

    it("should create an order", () => {
      const menuItems = getMenuItems();
      const createOrderRequest: CreateOrderRequest = {
        customerId,
        customerName: "Test Customer",
        customerEmail: "test@example.com",
        customerPhone: "(555) 123-4567",
        customerAddress: "123 Main St",
        items: [
          {
            menuItemId: menuItems[0].id,
            quantity: 2,
          },
        ],
        notes: "No onions",
      };

      const order = createOrder(createOrderRequest);

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.status).toBe("pending");
      expect(order.items).toHaveLength(1);
      expect(order.items[0].quantity).toBe(2);
      expect(order.totalAmount).toBeGreaterThan(0);
    });

    it("should retrieve an order by ID", () => {
      const menuItems = getMenuItems();
      const createOrderRequest: CreateOrderRequest = {
        customerId,
        customerName: "Test Customer",
        customerEmail: "test@example.com",
        customerPhone: "(555) 123-4567",
        customerAddress: "123 Main St",
        items: [
          {
            menuItemId: menuItems[0].id,
            quantity: 1,
          },
        ],
      };

      const createdOrder = createOrder(createOrderRequest);
      const retrievedOrder = getOrder(createdOrder.id);

      expect(retrievedOrder).toBeDefined();
      expect(retrievedOrder?.id).toBe(createdOrder.id);
      expect(retrievedOrder?.customerName).toBe("Test Customer");
    });

    it("should update order status", () => {
      const menuItems = getMenuItems();
      const createOrderRequest: CreateOrderRequest = {
        customerId,
        customerName: "Test Customer",
        customerEmail: "test@example.com",
        customerPhone: "(555) 123-4567",
        customerAddress: "123 Main St",
        items: [
          {
            menuItemId: menuItems[0].id,
            quantity: 1,
          },
        ],
      };

      const order = createOrder(createOrderRequest);
      const updated = updateOrderStatus(order.id, "confirmed");

      expect(updated?.status).toBe("confirmed");
      expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(
        order.createdAt.getTime()
      );
    });

    it("should return null for non-existent order", () => {
      const order = getOrder("non-existent-id");
      expect(order).toBeNull();
    });

    it("should get orders by customer ID", () => {
      const menuItems = getMenuItems();

      for (let i = 0; i < 3; i++) {
        createOrder({
          customerId,
          customerName: `Test Customer ${i}`,
          customerEmail: `test${i}@example.com`,
          customerPhone: "(555) 123-4567",
          customerAddress: "123 Main St",
          items: [
            {
              menuItemId: menuItems[0].id,
              quantity: 1,
            },
          ],
        });
      }

      const customerOrders = getOrdersByCustomerId(customerId);
      expect(customerOrders.length).toBeGreaterThanOrEqual(3);
      customerOrders.forEach((order) => {
        expect(order.customerId).toBe(customerId);
      });
    });

    it("should set estimated delivery time when order is ready", () => {
      const menuItems = getMenuItems();
      const createOrderRequest: CreateOrderRequest = {
        customerId,
        customerName: "Test Customer",
        customerEmail: "test@example.com",
        customerPhone: "(555) 123-4567",
        customerAddress: "123 Main St",
        items: [
          {
            menuItemId: menuItems[0].id,
            quantity: 1,
          },
        ],
      };

      const order = createOrder(createOrderRequest);
      const readyOrder = updateOrderStatus(order.id, "ready");

      expect(readyOrder?.estimatedDeliveryTime).toBeDefined();
      expect(
        readyOrder?.estimatedDeliveryTime!.getTime()
      ).toBeGreaterThan(order.createdAt.getTime());
    });

    it("should calculate order totals correctly with multiple items", () => {
      const menuItems = getMenuItems();

      const createOrderRequest: CreateOrderRequest = {
        customerId,
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
      };

      const order = createOrder(createOrderRequest);
      const expectedTotal =
        menuItems[0].price * 2 + menuItems[1].price * 1;

      expect(order.totalAmount).toBeCloseTo(expectedTotal, 2);
    });
  });

  describe("Order Statistics", () => {
    it("should provide order statistics", () => {
      const stats = getOrderStats();

      expect(stats).toHaveProperty("totalOrders");
      expect(stats).toHaveProperty("totalRevenue");
      expect(stats).toHaveProperty("statusCounts");
      expect(stats).toHaveProperty("averageOrderValue");

      expect(stats.totalOrders).toBeGreaterThanOrEqual(0);
      expect(stats.totalRevenue).toBeGreaterThanOrEqual(0);
    });

    it("should count orders by status", () => {
      const stats = getOrderStats();

      const totalByStatus = Object.values(stats.statusCounts).reduce(
        (a, b) => a + b,
        0
      );
      expect(totalByStatus).toBe(stats.totalOrders);
    });
  });
});
