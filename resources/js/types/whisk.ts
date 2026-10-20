export interface MenuItem {
    id: number;
    name: string;
    category: "Coffee" | "Matcha" | "Non-Coffee" | "Pastries";
    description: string;
    price: number;
    usdPrice: number;
    tag: string;
    imageUrl: string;
    isDrink: boolean;
    notes?: string;
}

export interface CartItem extends MenuItem {
    quantity: number;
}

export type CategoryFilter = "All" | "Coffee" | "Matcha" | "Non-Coffee" | "Pastries";
