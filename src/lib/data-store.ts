import {
  Customer,
  MenuItem,
  Order,
  OrderStatus,
  CreateOrderRequest,
} from "./types";

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
interface DataStore {
  customers: Map<string, Customer>;
  menuItems: Map<string, MenuItem>;
  orders: Map<string, Order>;
}

const store: DataStore = {
  customers: new Map(),
  menuItems: new Map(),
  orders: new Map(),
};
function initializeSampleData() {
  if (store.menuItems.size > 0) return; // Already initialized
  const sampleMenu: MenuItem[] = [
    {
      id: generateId("menu"),
      name: "Margherita Pizza",
      description: "Classic pizza with tomato, mozzarella, and basil",
      price: 12.99,
      category: "Pizza",
      available: true,
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: generateId("menu"),
      name: "Pepperoni Pizza",
      description: "Pizza with pepperoni and cheese",
      price: 14.99,
      category: "Pizza",
      available: true,
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: generateId("menu"),
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with Caesar dressing",
      price: 8.99,
      category: "Salad",
      available: true,
      image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: generateId("menu"),
      name: "Grilled Chicken Sandwich",
      description: "Grilled chicken breast with vegetables",
      price: 10.99,
      category: "Sandwich",
      available: true,
      image: "https://images.unsplash.com/photo-1700937244987-92488ab2ada5?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: generateId("menu"),
      name: "French Fries",
      description: "Crispy golden fries",
      price: 4.99,
      category: "Sides",
      available: true,
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: generateId("menu"),
      name: "Vanilla Ice Cream",
      description: "Creamy vanilla ice cream",
      price: 5.99,
      category: "Dessert",
      available: true,
      image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&auto=format&fit=crop&q=60",
    },
  ];

  sampleMenu.forEach((item) => store.menuItems.set(item.id, item));

  const sampleCustomers: Customer[] = [
    {
      id: generateId("cust"),
      name: "John Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      address: "123 Main St, City",
      createdAt: new Date(),
    },
    {
      id: generateId("cust"),
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "(555) 234-5678",
      address: "456 Oak Ave, City",
      createdAt: new Date(),
    },
  ];

  sampleCustomers.forEach((customer) =>
    store.customers.set(customer.id, customer)
  );
}
export function getCustomers(): Customer[] {
  initializeSampleData();
  return Array.from(store.customers.values());
}

export function getCustomer(id: string): Customer | null {
  return store.customers.get(id) || null;
}

export function createCustomer(data: Omit<Customer, "id" | "createdAt">): Customer {
  const customer: Customer = {
    ...data,
    id: generateId("cust"),
    createdAt: new Date(),
  };
  store.customers.set(customer.id, customer);
  return customer;
}
export function getMenuItems(): MenuItem[] {
  initializeSampleData();
  return Array.from(store.menuItems.values());
}

export function getMenuItem(id: string): MenuItem | null {
  return store.menuItems.get(id) || null;
}
export function getOrders(): Order[] {
  initializeSampleData();
  return Array.from(store.orders.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

export function getOrdersByCustomerId(customerId: string): Order[] {
  initializeSampleData();
  return Array.from(store.orders.values())
    .filter((order) => order.customerId === customerId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getOrder(id: string): Order | null {
  return store.orders.get(id) || null;
}

export function createOrder(request: CreateOrderRequest): Order {
  initializeSampleData();
  let totalAmount = 0;
  const items = request.items.map((item) => {
    const menuItem = getMenuItem(item.menuItemId);
    if (!menuItem) {
      throw new Error(`Menu item ${item.menuItemId} not found`);
    }
    const subtotal = menuItem.price * item.quantity;
    totalAmount += subtotal;
    return {
      menuItemId: menuItem.id,
      menuItemName: menuItem.name,
      quantity: item.quantity,
      price: menuItem.price,
      subtotal,
    };
  });

  const order: Order = {
    id: generateId("order"),
    customerId: request.customerId,
    customerName: request.customerName,
    customerEmail: request.customerEmail,
    customerPhone: request.customerPhone,
    customerAddress: request.customerAddress,
    items,
    totalAmount,
    status: "pending",
    notes: request.notes || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  store.orders.set(order.id, order);
  simulateOrderTransitions(order.id);

  return order;
}
function simulateOrderTransitions(orderId: string) {
  setTimeout(() => {
    const order = store.orders.get(orderId);
    if (order && order.status === "pending") {
      updateOrderStatus(orderId, "confirmed");
      setTimeout(() => {
        const order = store.orders.get(orderId);
        if (order && order.status === "confirmed") {
          updateOrderStatus(orderId, "preparing");
          setTimeout(() => {
            const order = store.orders.get(orderId);
            if (order && order.status === "preparing") {
              updateOrderStatus(orderId, "ready");
              setTimeout(() => {
                const order = store.orders.get(orderId);
                if (order && order.status === "ready") {
                  updateOrderStatus(orderId, "delivered");
                }
              }, 15000);
            }
          }, 12000);
        }
      }, 8000);
    }
  }, 5000);
}

export function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Order | null {
  const order = store.orders.get(orderId);
  if (!order) return null;

  order.status = status;
  order.updatedAt = new Date();
  if (status === "ready") {
    order.estimatedDeliveryTime = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
  }

  return order;
}

export function deleteOrder(orderId: string): boolean {
  return store.orders.delete(orderId);
}
export function getOrderStats() {
  initializeSampleData();
  const orders = Array.from(store.orders.values());
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const statusCounts = {
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return {
    totalOrders,
    totalRevenue,
    statusCounts,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
  };
}
