import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Share2, 
  Heart,
  ArrowLeft,
  Ticket,
  Shield,
  CheckCircle2,
  Minus,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useEvent } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: event, isLoading } = useEvent(id);
  const { user } = useAuth();
  const [ticketCount, setTicketCount] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4">
          <Skeleton className="h-[400px] w-full rounded-2xl" />
          <div className="mt-8 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-bold text-foreground">Event not found</h1>
          <Button asChild className="mt-4">
            <Link to="/events">Browse Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  const spotsLeft = event.capacity - event.bookings_count;
  const percentageFull = (event.bookings_count / event.capacity) * 100;
  const formattedDate = format(new Date(event.date), "MMMM d, yyyy");
  const formattedTime = event.time.slice(0, 5);
  const totalPrice = Number(event.price) * ticketCount;

  const handleBookNow = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book tickets.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    if (ticketCount > spotsLeft) {
      toast({
        title: "Not enough spots",
        description: `Only ${spotsLeft} spots available.`,
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);

    try {
      // For free events, create booking directly
      if (Number(event.price) === 0) {
        const qrCodeData = `EVT-${event.id}-${user.id}-${Date.now()}`;
        
        const { error } = await supabase.from("bookings").insert({
          event_id: event.id,
          user_id: user.id,
          ticket_count: ticketCount,
          total_price: 0,
          payment_status: "paid",
          qr_code_data: qrCodeData,
        });

        if (error) throw error;

        toast({
          title: "Booking Confirmed!",
          description: `You've successfully booked ${ticketCount} ticket(s) for ${event.title}.`,
        });
        navigate("/dashboard");
      } else {
        // For paid events, redirect to Stripe checkout
        const response = await supabase.functions.invoke("create-checkout", {
          body: {
            eventId: event.id,
            ticketCount,
            successUrl: `${window.location.origin}/events/${event.id}?success=true`,
            cancelUrl: `${window.location.origin}/events/${event.id}?canceled=true`,
          },
        });

        if (response.error) throw response.error;

        const { url } = response.data;
        if (url) {
          window.location.href = url;
        }
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Image */}
      <section className="pt-16 lg:pt-20">
        <div className="relative h-[300px] lg:h-[400px]">
          <img
            src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          <div className="absolute top-24 left-4 sm:left-8">
            <Button variant="glass" size="sm" asChild>
              <Link to="/events">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="gradient-primary border-0">
                  {event.category?.name || "General"}
                </Badge>
                {spotsLeft < 50 && (
                  <Badge variant="destructive">Almost Sold Out!</Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {event.title}
              </h1>

              <p className="text-muted-foreground mb-6">{event.description}</p>

              {/* Event Details */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary">
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium text-foreground">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary">
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium text-foreground">{formattedTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary sm:col-span-2">
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">{event.location}</p>
                  </div>
                </div>
              </div>

              {/* Organizer */}
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">Organizer</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">
                      {event.organizer?.full_name?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {event.organizer?.full_name || "Unknown Organizer"}
                    </p>
                    <p className="text-sm text-muted-foreground">Event Organizer</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Booking Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg sticky top-24">
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-foreground">
                  {Number(event.price) === 0 ? "Free" : `$${event.price}`}
                </span>
                {Number(event.price) > 0 && (
                  <span className="text-muted-foreground"> / ticket</span>
                )}
              </div>

              {/* Ticket Quantity */}
              {spotsLeft > 0 && (
                <div className="mb-6">
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Number of tickets
                  </label>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                      disabled={ticketCount <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-xl font-bold w-12 text-center">
                      {ticketCount}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setTicketCount(Math.min(spotsLeft, ticketCount + 1))
                      }
                      disabled={ticketCount >= spotsLeft}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {Number(event.price) > 0 && ticketCount > 1 && (
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      Total: <span className="font-semibold">${totalPrice}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Capacity Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {event.bookings_count} attending
                  </span>
                  <span className="font-medium text-foreground">
                    {spotsLeft} spots left
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full transition-all duration-500"
                    style={{ width: `${percentageFull}%` }}
                  />
                </div>
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full mb-4"
                onClick={handleBookNow}
                disabled={isBooking || spotsLeft === 0}
              >
                <Ticket className="w-5 h-5 mr-2" />
                {isBooking
                  ? "Processing..."
                  : spotsLeft === 0
                  ? "Sold Out"
                  : "Book Now"}
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="lg" className="flex-1">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-success" />
                  <span>Secure checkout with Stripe</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Instant QR code ticket delivery</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
