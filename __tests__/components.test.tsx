import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import OrderCard from "@/components/order-card";
import MenuBrowser from "@/components/menu-browser";
import { Order, MenuItem } from "@/lib/types";

describe("Components", () => {
  describe("OrderCard", () => {
    const mockOrder: Order = {
      id: "order-123",
      customerId: "cust-1",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "(555) 123-4567",
      customerAddress: "123 Main St",
      items: [
        {
          menuItemId: "menu-1",
          menuItemName: "Pizza",
          quantity: 2,
          price: 12.99,
          subtotal: 25.98,
        },
      ],
      totalAmount: 25.98,
      status: "pending",
      notes: "Extra cheese",
      createdAt: new Date("2024-01-15T10:00:00Z"),
      updatedAt: new Date("2024-01-15T10:00:00Z"),
    };

    it("should render order card with order information", () => {
      const { container } = render(<OrderCard order={mockOrder} />);
      expect(screen.getByText(/order-123/i)).toBeInTheDocument();
      expect(screen.getByText("Pizza")).toBeInTheDocument();
      expect(screen.getByText("× 2")).toBeInTheDocument();
      const totalPriceElement = container.querySelector(".text-2xl.font-black");
      expect(totalPriceElement).toHaveTextContent("25.98");
    });

    it("should display customer information when requested", () => {
      render(<OrderCard order={mockOrder} showCustomerInfo={true} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("(555) 123-4567")).toBeInTheDocument();
    });

    it("should display order status badge", () => {
      render(<OrderCard order={mockOrder} />);

     
      expect(screen.getByText(/Order Received/i)).toBeInTheDocument();
    });

    it("should display special instructions when present", () => {
      render(<OrderCard order={mockOrder} />);

      expect(screen.getByText("Extra cheese")).toBeInTheDocument();
    });

    it("should not display special instructions when not present", () => {
      const orderWithoutNotes = { ...mockOrder, notes: "" };
      render(<OrderCard order={orderWithoutNotes} />);

      expect(screen.queryByText("Extra cheese")).not.toBeInTheDocument();
    });

    it("should handle multiple items", () => {
      const multiItemOrder: Order = {
        ...mockOrder,
        items: [
          {
            menuItemId: "menu-1",
            menuItemName: "Pizza",
            quantity: 1,
            price: 12.99,
            subtotal: 12.99,
          },
          {
            menuItemId: "menu-2",
            menuItemName: "Salad",
            quantity: 2,
            price: 8.99,
            subtotal: 17.98,
          },
        ],
        totalAmount: 30.97,
      };

      render(<OrderCard order={multiItemOrder} />);

      expect(screen.getByText("Pizza")).toBeInTheDocument();
      expect(screen.getByText("× 1")).toBeInTheDocument();
      expect(screen.getByText("Salad")).toBeInTheDocument();
      expect(screen.getByText("× 2")).toBeInTheDocument();
    });
  });

  describe("MenuBrowser", () => {
    const mockMenuItems: MenuItem[] = [
      {
        id: "menu-1",
        name: "Margherita Pizza",
        description: "Classic pizza",
        price: 12.99,
        category: "Pizza",
        image: "",
        available: true,
      },
      {
        id: "menu-2",
        name: "Caesar Salad",
        description: "Fresh salad",
        price: 8.99,
        category: "Salad",
        image: "",
        available: true,
      },
      {
        id: "menu-3",
        name: "Pepperoni Pizza",
        description: "Pepperoni pizza",
        price: 14.99,
        category: "Pizza",
        image: "",
        available: false,
      },
    ];

    it("should render menu items grouped by category", () => {
      const { container } = render(<MenuBrowser items={mockMenuItems} />);
      const headings = container.querySelectorAll("h2");
      const headingTexts = Array.from(headings).map((h) => h.textContent);
      expect(headingTexts).toContain("Pizza");
      expect(headingTexts).toContain("Salad");
    });

    it("should display item names and descriptions", () => {
      render(<MenuBrowser items={mockMenuItems} />);

      expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
      expect(screen.getByText("Classic pizza")).toBeInTheDocument();
      expect(screen.getByText("Caesar Salad")).toBeInTheDocument();
    });

    it("should display item prices", () => {
      render(<MenuBrowser items={mockMenuItems} />);

      expect(screen.getByText("$12.99")).toBeInTheDocument();
      expect(screen.getByText("$8.99")).toBeInTheDocument();
      expect(screen.getByText("$14.99")).toBeInTheDocument();
    });

    it("should mark unavailable items as sold out", () => {
      render(<MenuBrowser items={mockMenuItems} />);

      const soldOutElements = screen.getAllByText("Sold Out");
      expect(soldOutElements.length).toBeGreaterThan(0);
    });

    it("should handle empty menu", () => {
      const { container } = render(<MenuBrowser items={[]} />);

   
      const headings = container.querySelectorAll("h2");
      expect(headings.length).toBe(0);
    });

    it("should organize items by category in correct order", () => {
      const unorderedItems: MenuItem[] = [
        {
          id: "s1",
          name: "Salad",
          description: "Test",
          price: 8.99,
          category: "Salad",
          image: "",
          available: true,
        },
        {
          id: "p1",
          name: "Pizza",
          description: "Test",
          price: 12.99,
          category: "Pizza",
          image: "",
          available: true,
        },
        {
          id: "d1",
          name: "Dessert",
          description: "Test",
          price: 5.99,
          category: "Dessert",
          image: "",
          available: true,
        },
      ];

      const { container } = render(<MenuBrowser items={unorderedItems} />);

      const headings = container.querySelectorAll("h2");
      expect(headings[0]).toHaveTextContent("Dessert");
      expect(headings[1]).toHaveTextContent("Pizza");
      expect(headings[2]).toHaveTextContent("Salad");
    });
  });
});
