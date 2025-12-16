import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EventCard } from "@/components/events/EventCard";
import { mockEvents, categories } from "@/data/mockEvents";

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;

      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "free" && event.price === 0) ||
        (priceFilter === "paid" && event.price > 0);

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchQuery, selectedCategory, priceFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-8 lg:pt-32 lg:pb-12 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Discover Amazing <span className="text-gradient-primary">Events</span>
            </h1>
            <p className="text-muted-foreground">
              Find your next unforgettable experience from concerts to conferences
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border sticky top-16 lg:top-20 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-2">
              <Button
                variant={priceFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setPriceFilter("all")}
              >
                All Prices
              </Button>
              <Button
                variant={priceFilter === "free" ? "default" : "outline"}
                size="sm"
                onClick={() => setPriceFilter("free")}
              >
                Free
              </Button>
              <Button
                variant={priceFilter === "paid" ? "default" : "outline"}
                size="sm"
                onClick={() => setPriceFilter("paid")}
              >
                Paid
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "gradient-primary border-0"
                    : "hover:bg-secondary"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-10 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Showing {filteredEvents.length} events
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvents.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No events found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search query
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setPriceFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
