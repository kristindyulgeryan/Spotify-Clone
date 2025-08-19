import { axiosInstance } from "@/lib/axios.js";
import type { Message } from "@/types";
import { io } from "socket.io-client";
import { create } from "zustand";

interface ChatStore {
  users: any[];
  isLoading: boolean;
  error: string | null;
  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messages: Message[];
  fetchUsers: () => Promise<void>;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
}

const baseURL = "http://localhost:5000";

const socket = io(baseURL, {
  autoConnect: false, // only connect if user is authenticated
  withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],

  fetchUsers: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get("/users");
      console.log("Fetched users:", response.data);
      set({ users: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  initSocket: (userId: string) => {
    if (!get().isConnected) socket.connect();
    socket.auth = { userId };
    socket.emit("user_connected", userId);

    socket.on("user_online", (users: string[]) => {
      set({ onlineUsers: new Set(users) });
    });

    socket.on("activities", (activities: [string, string][]) => {
      set({ userActivities: new Map(activities) });
    });

    socket.on("user_connected", (userId: string) => {
      set((state) => ({
        onlineUsers: new Set([...state.onlineUsers, userId]),
      }));
    });

    socket.on("user_disconnected", (userId: string) => {
      set((state) => {
        const newOnlineUsers = new Set(state.onlineUsers);
        newOnlineUsers.delete(userId);
        return { onlineUsers: newOnlineUsers };
      });
    });

    socket.on("receive_message", (message: Message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    socket.on("message_sent", (message: Message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    socket.on("activity_updated", ({ userId, activity }) => {
      set((state) => {
        const newActivities = new Map(state.userActivities);
        newActivities.set(userId, activity);
        return { userActivities: newActivities };
      });
    });

    set({ isConnected: true });
  },

  disconnectSocket: () => {},
  sendMessage: async () => {},
}));
