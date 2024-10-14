import { render, screen, fireEvent } from "@testing-library/react";
import GetTicketComp from "./GetTicketComp";
import { mock } from "jest-mock";

describe("GetTicketComp", () => {
    it("renders get ticket component", async () => {
        const mockGetServices = jest
            .fn()
            .mockResolvedValue([{ name: "Service A" }, { name: "Service B" }]);
        mock("http://localhost:3000/service/all", () => ({
            getServices: mockGetServices,
        }));

        render(<GetTicketComp />);

        await new Promise((resolve) => setTimeout(resolve, 0));

        const serviceButtons = screen.getAllByRole("button", {
            name: /Service/i,
        });
        expect(serviceButtons.length).toBe(2);
    });

    it("renders get ticket component", async () => {
        const mockGetTicket = jest.fn().mockResolvedValue(123);
        mock("http://localhost:3000/ticket/", () => ({
            getTicket: mockGetTicket,
        }));

        render(<GetTicketComp />);

        const serviceButton = screen.getByRole("button", { name: "Service A" });
        fireEvent.click(serviceButton);

        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(screen.getByText("Getting ticket...")).toBeInTheDocument();

        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(screen.getByText("Here it is your ticket!")).toBeInTheDocument();
        expect(screen.getByText("Your queue number is:")).toBeInTheDocument();
        expect(screen.getByText(/123/)).toBeInTheDocument(); // Ticket number
    });
});
