import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EventWithDetails } from "@/hooks/useEvents";
import { format } from "date-fns";

interface EventCardProps {
  event: EventWithDetails;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const spotsLeft = event.capacity - event.bookings_count;
  const isAlmostFull = spotsLeft < 20;

  const formattedDate = format(new Date(event.date), "MMMM d, yyyy");
  const formattedTime = event.time.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/events/${event.id}`}>
        <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop"}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            
            {/* Category Badge */}
            <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground border-0">
              {event.category?.name || "General"}
            </Badge>

            {/* Favorite Button */}
            <button
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-card transition-colors"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Heart className="w-4 h-4" />
            </button>

            {/* Price */}
            <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <span className="text-lg font-bold text-foreground">
                {Number(event.price) === 0 ? "Free" : `$${event.price}`}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {event.description}
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{formattedDate}</span>
                <Clock className="w-4 h-4 text-primary ml-2" />
                <span>{formattedTime}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="line-clamp-1">{event.location}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span className={cn(
                    isAlmostFull ? "text-destructive font-medium" : "text-muted-foreground"
                  )}>
                    {spotsLeft} spots left
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  by {event.organizer?.full_name || "Unknown"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
