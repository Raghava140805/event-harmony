import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Plus,
  BarChart3,
  Users,
  DollarSign,
  Ticket,
  TrendingUp,
  Clock,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Navbar } from "@/components/layout/Navbar";
import { mockEvents } from "@/data/mockEvents";

const stats = [
  {
    label: "Total Revenue",
    value: "$12,450",
    change: "+12.5%",
    icon: DollarSign,
    color: "text-success",
  },
  {
    label: "Tickets Sold",
    value: "1,234",
    change: "+8.2%",
    icon: Ticket,
    color: "text-primary",
  },
  {
    label: "Active Events",
    value: "8",
    change: "+2",
    icon: Calendar,
    color: "text-accent",
  },
  {
    label: "Total Attendees",
    value: "5,678",
    change: "+15.3%",
    icon: Users,
    color: "text-warning",
  },
];

const recentActivity = [
  { type: "sale", message: "New ticket sold for Tech Conference 2024", time: "2 min ago" },
  { type: "registration", message: "John Doe registered for Summer Music Festival", time: "15 min ago" },
  { type: "event", message: "New event 'AI Workshop' created", time: "1 hour ago" },
  { type: "sale", message: "5 tickets sold for Startup Pitch Night", time: "2 hours ago" },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const myEvents = mockEvents.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your events.
              </p>
            </div>
            <Button variant="hero" asChild>
              <Link to="/dashboard/create">
                <Plus className="w-5 h-5 mr-2" />
                Create Event
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-secondary flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-success">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* My Events */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">My Events</h2>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {myEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {event.attendees}/{event.capacity}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          event.attendees / event.capacity > 0.8
                            ? "destructive"
                            : "default"
                        }
                      >
                        {Math.round((event.attendees / event.capacity) * 100)}% full
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Event
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  ))}
                </div>

                <Button variant="ghost" className="w-full mt-4">
                  View All Events
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-6">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        {activity.type === "sale" && (
                          <DollarSign className="w-4 h-4 text-success" />
                        )}
                        {activity.type === "registration" && (
                          <Users className="w-4 h-4 text-primary" />
                        )}
                        {activity.type === "event" && (
                          <Calendar className="w-4 h-4 text-accent" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-card rounded-2xl border border-border p-6 mt-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  This Week
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Page Views</span>
                    <span className="font-semibold text-foreground">2,847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">New Registrations</span>
                    <span className="font-semibold text-foreground">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Conversion Rate</span>
                    <span className="font-semibold text-foreground">5.4%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
