import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EventWithDetails {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  price: number;
  capacity: number;
  image_url: string | null;
  is_featured: boolean | null;
  organizer_id: string;
  category_id: string | null;
  created_at: string;
  category: { id: string; name: string; icon: string | null } | null;
  organizer: { id: string; full_name: string | null; avatar_url: string | null } | null;
  bookings_count: number;
}

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data: events, error } = await supabase
        .from("events")
        .select(`
          *,
          category:categories(id, name, icon),
          organizer:profiles(id, full_name, avatar_url)
        `)
        .order("date", { ascending: true });

      if (error) throw error;

      // Get booking counts for each event
      const eventIds = events?.map((e) => e.id) || [];
      const { data: bookings } = await supabase
        .from("bookings")
        .select("event_id")
        .in("event_id", eventIds)
        .eq("payment_status", "paid");

      const bookingCounts = (bookings || []).reduce((acc, b) => {
        acc[b.event_id] = (acc[b.event_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return (events || []).map((event) => ({
        ...event,
        bookings_count: bookingCounts[event.id] || 0,
      })) as EventWithDetails[];
    },
  });
}

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      if (!id) return null;

      const { data: event, error } = await supabase
        .from("events")
        .select(`
          *,
          category:categories(id, name, icon),
          organizer:profiles(id, full_name, avatar_url)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!event) return null;

      // Get booking count
      const { count } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("event_id", id)
        .eq("payment_status", "paid");

      return {
        ...event,
        bookings_count: count || 0,
      } as EventWithDetails;
    },
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });
}

export function useOrganizerEvents(organizerId: string | undefined) {
  return useQuery({
    queryKey: ["organizer-events", organizerId],
    queryFn: async () => {
      if (!organizerId) return [];

      const { data: events, error } = await supabase
        .from("events")
        .select(`
          *,
          category:categories(id, name, icon)
        `)
        .eq("organizer_id", organizerId)
        .order("date", { ascending: true });

      if (error) throw error;

      // Get booking counts
      const eventIds = events?.map((e) => e.id) || [];
      const { data: bookings } = await supabase
        .from("bookings")
        .select("event_id, ticket_count, total_price, payment_status")
        .in("event_id", eventIds);

      const eventStats = (bookings || []).reduce((acc, b) => {
        if (!acc[b.event_id]) {
          acc[b.event_id] = { attendees: 0, revenue: 0 };
        }
        if (b.payment_status === "paid") {
          acc[b.event_id].attendees += b.ticket_count;
          acc[b.event_id].revenue += Number(b.total_price);
        }
        return acc;
      }, {} as Record<string, { attendees: number; revenue: number }>);

      return (events || []).map((event) => ({
        ...event,
        attendees: eventStats[event.id]?.attendees || 0,
        revenue: eventStats[event.id]?.revenue || 0,
      }));
    },
    enabled: !!organizerId,
  });
}

export function useOrganizerStats(organizerId: string | undefined) {
  return useQuery({
    queryKey: ["organizer-stats", organizerId],
    queryFn: async () => {
      if (!organizerId) return null;

      // Get all events for this organizer
      const { data: events } = await supabase
        .from("events")
        .select("id")
        .eq("organizer_id", organizerId);

      const eventIds = events?.map((e) => e.id) || [];

      // Get all paid bookings for these events
      const { data: bookings } = await supabase
        .from("bookings")
        .select("ticket_count, total_price, created_at")
        .in("event_id", eventIds)
        .eq("payment_status", "paid");

      const totalRevenue = (bookings || []).reduce(
        (sum, b) => sum + Number(b.total_price),
        0
      );
      const totalTickets = (bookings || []).reduce(
        (sum, b) => sum + b.ticket_count,
        0
      );

      return {
        totalRevenue,
        totalTickets,
        totalEvents: events?.length || 0,
        totalAttendees: totalTickets,
      };
    },
    enabled: !!organizerId,
  });
}
