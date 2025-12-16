import { useParams, Link } from "react-router-dom";
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
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { mockEvents } from "@/data/mockEvents";
import { toast } from "@/hooks/use-toast";

export default function EventDetail() {
  const { id } = useParams();
  const event = mockEvents.find((e) => e.id === id);

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

  const spotsLeft = event.capacity - event.attendees;
  const percentageFull = (event.attendees / event.capacity) * 100;

  const handleBookNow = () => {
    toast({
      title: "Booking Started!",
      description: "Connect Lovable Cloud to enable real bookings and payments.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Image */}
      <section className="pt-16 lg:pt-20">
        <div className="relative h-[300px] lg:h-[400px]">
          <img
            src={event.image}
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
                <Badge className="gradient-primary border-0">{event.category}</Badge>
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
                    <p className="font-medium text-foreground">{event.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary">
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium text-foreground">{event.time}</p>
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
                      {event.organizer.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{event.organizer}</p>
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
                  {event.price === 0 ? "Free" : `$${event.price}`}
                </span>
                {event.price > 0 && (
                  <span className="text-muted-foreground"> / ticket</span>
                )}
              </div>

              {/* Capacity Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {event.attendees} attending
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
              >
                <Ticket className="w-5 h-5 mr-2" />
                Book Now
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
