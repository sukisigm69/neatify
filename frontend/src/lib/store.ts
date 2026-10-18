import axios from "axios";
import { create } from "zustand";

export interface Artist {
  id: string;
  name: string;
  genre: string | null;
  bio: string | null;
  image: string | null;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  capacity: number;
  map_url: string | null;
  image: string | null;
}

export interface TicketCategory {
  id: string;
  event_id: string;
  name: string;
  price: string;
  quota: number;
  sold: number;
  sale_start: string | null;
  sale_end: string | null;
}

export interface Organizer {
  id: string;
  user_id: string;
  org_name: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  is_approved: boolean;
  users: {
    name: string;
    email: string;
  };
}

export interface Event {
  id: string;
  organizer_id: string;
  venue_id: string;
  title: string;
  slug: string;
  description: string;
  banner: string | null;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  venues: Venue;
  organizers: Organizer;
  event_artists: {
    artists: Artist;
  }[];
  ticket_categories: TicketCategory[];
}

export interface PaginatedResponse<T> {
  events: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  is_verified: boolean;
  roles: {
    name: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/register") {
        localStorage.removeItem("token");
      }
    }
    return Promise.reject(error);
  }
);

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,
  login: (token, user) => {
    localStorage.setItem("token", token);
    set({ token, user, loading: false });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null, loading: false });
  },
  checkAuth: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ user: null, token: null, loading: false });
        return;
      }
      const response = await api.get("/auth/me");
      if (response.data.success) {
        set({ user: response.data.data, token, loading: false });
      } else {
        localStorage.removeItem("token");
        set({ user: null, token: null, loading: false });
      }
    } catch {
      localStorage.removeItem("token");
      set({ user: null, token: null, loading: false });
    }
  },
}));

interface FavoriteState {
  favorites: Set<string>;
  loading: boolean;
  toggle: (eventId: string) => Promise<void>;
  load: () => Promise<void>;
  isFavorite: (eventId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: new Set(),
  loading: false,
  toggle: async (eventId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const current = get().favorites;
    const isFav = current.has(eventId);
    const next = new Set(current);
    if (isFav) {
      next.delete(eventId);
    } else {
      next.add(eventId);
    }
    set({ favorites: next });
    try {
      if (isFav) {
        await api.delete(`/favorites/${eventId}`);
      } else {
        await api.post("/favorites", { eventId });
      }
    } catch {
      set({ favorites: current });
    }
  },
  load: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ favorites: new Set(), loading: false });
      return;
    }
    set({ loading: true });
    try {
      const res = await api.get("/favorites");
      if (res.data.success) {
        const ids = new Set<string>(
          (res.data.data as { event_id: string }[]).map((f) => f.event_id)
        );
        set({ favorites: ids, loading: false });
      } else {
        set({ loading: false });
      }
    } catch {
      set({ loading: false });
    }
  },
  isFavorite: (eventId: string) => get().favorites.has(eventId),
}));

export interface Ticket {
  ticketId: string;
  qrCode: string;
  qrImage: string | null;
  ticketStatus: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  orderNumber: string | null;
  purchaseDate: string | null;
  event: string | null;
  venue: string | null;
  artists: string[];
  ticketCategory: string | null;
  eventBanner: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface Order {
  invoiceNumber: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string | null;
  purchaseDate: string;
  grandTotal: number;
  totalTicket: number;
  eventSummary: string;
}

export interface OrderDetail {
  order: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    status: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
  };
  payment: {
    id: string;
    order_id: string;
    midtrans_id: string | null;
    snap_token: string | null;
    snap_url: string | null;
    amount: string;
    method: string | null;
    status: string;
    transaction_id: string | null;
    payment_type: string | null;
    transaction_status: string | null;
    fraud_status: string | null;
    expiry_time: string | null;
    paid_at: string | null;
    raw_response: string | null;
    created_at: string;
    updated_at: string;
  } | null;
  orderItems: {
    id: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    ticketCategory: {
      id: string;
      name: string;
      price: number;
    };
    event: {
      id: string;
      title: string;
      description: string;
      banner: string | null;
      startDate: string;
      endDate: string;
      venue: {
        id: string;
        name: string;
        address: string;
        city: string;
        province: string;
      } | null;
      organizer: {
        id: string;
        orgName: string;
        logo: string | null;
      } | null;
      artists: {
        id: string;
        name: string;
        genre: string | null;
        bio: string | null;
        image: string | null;
      }[];
    } | null;
    tickets: {
      id: string;
      qrCode: string;
      qrImage: string | null;
      attendeeName: string;
      attendeeEmail: string;
      attendeePhone: string;
      status: string;
    }[];
  }[];
}

interface TicketState {
  tickets: Ticket[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  fetchTickets: (page?: number, limit?: number) => Promise<void>;
  fetchTicketById: (ticketId: string) => Promise<Ticket>;
}

export const useTicketStore = create<TicketState>((set) => ({
  tickets: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  loading: false,
  error: null,
  fetchTickets: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/tickets/my", { params: { page, limit } });
      if (res.data.success) {
        set({
          tickets: res.data.data.tickets,
          total: res.data.data.total,
          page: res.data.data.page,
          limit: res.data.data.limit,
          totalPages: res.data.data.totalPages,
          loading: false,
        });
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      set({ error: error.response?.data?.message || "Failed to load tickets", loading: false });
    }
  },
  fetchTicketById: async (ticketId: string) => {
    const res = await api.get(`/tickets/${ticketId}`);
    return res.data.data;
  },
}));

interface OrderState {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  fetchOrders: (options?: { page?: number; limit?: number; sortBy?: "newest" | "oldest"; search?: string; status?: string }) => Promise<void>;
  fetchOrderDetail: (orderId: string) => Promise<OrderDetail>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  loading: false,
  error: null,
  fetchOrders: async (options = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/orders/my", { params: options });
      if (res.data.success) {
        set({
          orders: res.data.data.orders,
          total: res.data.data.total,
          page: res.data.data.page,
          limit: res.data.data.limit,
          totalPages: res.data.data.totalPages,
          loading: false,
        });
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      set({ error: error.response?.data?.message || "Failed to load orders", loading: false });
    }
  },
  fetchOrderDetail: async (orderId: string) => {
    const res = await api.get(`/orders/${orderId}`);
    return res.data.data;
  },
}));
