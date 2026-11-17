"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import {
  DEMO_COURIER,
  DEMO_CUSTOMER,
  nextStatus,
  orderTotal,
  seedOrder,
  type Order,
  type OrderItem,
} from "@/data/orders";
import { restaurant } from "@/data/sectors";

/**
 * MOTOR DE PEDIDOS SIMULADOS
 * ------------------------------------------------------------------
 * Estado local que comparten las interfaces de ejemplo de una sección:
 * carrito → pedido → cambios de estado. No hay red, pagos ni persistencia.
 */

export type Cart = Record<string, number>;

type State = {
  cart: Cart;
  order: Order | null;
  /** Consecutivo para numerar pedidos nuevos. */
  counter: number;
  /** Cuántos pedidos ha creado la persona en esta sesión de la simulación. */
  placed: number;
};

type Action =
  | { type: "add"; id: string }
  | { type: "remove"; id: string }
  | { type: "seedCart" }
  | { type: "place" }
  | { type: "advance" }
  | { type: "reject" }
  | { type: "reset"; initial: State };

const SAMPLE_CART: Cart = { "r-tacos": 2, "r-guacamole": 1, "r-limonada": 2 };

export function cartToItems(cart: Cart): OrderItem[] {
  return restaurant.products
    .filter((product) => (cart[product.id] ?? 0) > 0)
    .map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: cart[product.id],
    }));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add":
      return { ...state, cart: { ...state.cart, [action.id]: (state.cart[action.id] ?? 0) + 1 } };
    case "remove": {
      const qty = (state.cart[action.id] ?? 0) - 1;
      const cart = { ...state.cart };
      if (qty <= 0) delete cart[action.id];
      else cart[action.id] = qty;
      return { ...state, cart };
    }
    case "seedCart":
      return { ...state, cart: { ...SAMPLE_CART } };
    case "place": {
      const items = cartToItems(state.cart);
      if (items.length === 0) return state;
      const order: Order = {
        id: `A-${state.counter}`,
        items,
        total: orderTotal(items),
        status: "nuevo",
        placedAt: "Ahora",
        customer: DEMO_CUSTOMER,
        courier: DEMO_COURIER,
      };
      return { cart: {}, order, counter: state.counter + 1, placed: state.placed + 1 };
    }
    case "advance": {
      if (!state.order) return state;
      const next = nextStatus(state.order.status);
      if (!next) return state;
      return { ...state, order: { ...state.order, status: next } };
    }
    case "reject":
      if (!state.order || state.order.status !== "nuevo") return state;
      return { ...state, order: { ...state.order, status: "rechazado" } };
    case "reset":
      return action.initial;
    default:
      return state;
  }
}

type OrderSim = {
  cart: Cart;
  cartItems: OrderItem[];
  cartCount: number;
  cartTotal: number;
  order: Order | null;
  placed: number;
  add: (id: string) => void;
  remove: (id: string) => void;
  seedCart: () => void;
  placeOrder: () => void;
  advance: () => void;
  reject: () => void;
  reset: () => void;
};

const OrderSimContext = createContext<OrderSim | null>(null);

type ProviderProps = {
  children: ReactNode;
  /** Arranca con el pedido de ejemplo ya recibido (para paneles que no deben verse vacíos). */
  withSeedOrder?: boolean;
  /** Arranca con productos de ejemplo en el carrito. */
  withSeedCart?: boolean;
};

export function OrderSimProvider({ children, withSeedOrder = false, withSeedCart = false }: ProviderProps) {
  const initial = useMemo<State>(
    () => ({
      cart: withSeedCart ? { ...SAMPLE_CART } : {},
      order: withSeedOrder ? seedOrder : null,
      counter: 1043,
      placed: 0,
    }),
    [withSeedCart, withSeedOrder],
  );

  const [state, dispatch] = useReducer(reducer, initial);

  const value = useMemo<OrderSim>(() => {
    const cartItems = cartToItems(state.cart);
    return {
      cart: state.cart,
      cartItems,
      cartCount: cartItems.reduce((sum, item) => sum + item.qty, 0),
      cartTotal: orderTotal(cartItems),
      order: state.order,
      placed: state.placed,
      add: (id) => dispatch({ type: "add", id }),
      remove: (id) => dispatch({ type: "remove", id }),
      seedCart: () => dispatch({ type: "seedCart" }),
      placeOrder: () => dispatch({ type: "place" }),
      advance: () => dispatch({ type: "advance" }),
      reject: () => dispatch({ type: "reject" }),
      reset: () => dispatch({ type: "reset", initial }),
    };
  }, [state, initial]);

  return <OrderSimContext.Provider value={value}>{children}</OrderSimContext.Provider>;
}

export function useOrderSim(): OrderSim {
  const context = useContext(OrderSimContext);
  if (!context) throw new Error("useOrderSim debe usarse dentro de <OrderSimProvider>.");
  return context;
}
