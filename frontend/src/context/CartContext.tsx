import React, { createContext, useContext, useReducer } from 'react';

export type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

export type CartState = {
    items: CartItem[];
    totalAmount: number;
};

export type CartContextType = {
    cartState: CartState;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    getTotalQuantity: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialCartState: CartState = {
    items: [],
    totalAmount: 0,
};

type CartAction =
    | { type: 'ADD'; item: CartItem }
    | { type: 'REMOVE'; id: string }
    | { type: 'CLEAR' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD': {
            const updatedTotalAmount = state.totalAmount + action.item.price * action.item.quantity;

            const existingCartItemIndex = state.items.findIndex(
                (item) => item.id === action.item.id
            );
            const existingCartItem = state.items[existingCartItemIndex];

            let updatedItems;

            if (existingCartItem) {
                const updatedItem = {
                    ...existingCartItem,
                    quantity: existingCartItem.quantity + action.item.quantity,
                };
                updatedItems = [...state.items];
                updatedItems[existingCartItemIndex] = updatedItem;
            } else {
                updatedItems = [...state.items, action.item];
            }

            return {
                items: updatedItems,
                totalAmount: updatedTotalAmount,
            };
        }

        case 'REMOVE': {
            const itemIndex = state.items.findIndex((item) => item.id === action.id);
            const currentItem = state.items[itemIndex];
            const updatedAmount = state.totalAmount - currentItem.price;

            let newItems;
            if (currentItem.quantity === 1) {
                newItems = state.items.filter((item) => item.id !== action.id);
            } else {
                const updatedItem = { ...currentItem, quantity: currentItem.quantity - 1 };
                newItems = [...state.items];
                newItems[itemIndex] = updatedItem;
            }

            return {
                items: newItems,
                totalAmount: updatedAmount,
            };
        }

        case 'CLEAR':
            return initialCartState;

        default:
            return state;
    }
};


export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartState, dispatch] = useReducer(cartReducer, initialCartState);

    const addItem = (item: CartItem) => {
        dispatch({ type: 'ADD', item });
    };

    const removeItem = (id: string) => {
        dispatch({ type: 'REMOVE', id });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR' });
    };

    const getTotalQuantity = () => {
        return cartState.items.reduce((total, item) => total + item.quantity, 0);
    };
    return (
        <CartContext.Provider value={{ cartState, addItem, removeItem, clearCart, getTotalQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
