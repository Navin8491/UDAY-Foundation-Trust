"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Heart,
  Calendar,
  Image as ImageIcon,
  GraduationCap,
  Users,
  UserCheck,
  Handshake,
  FileText,
  ShieldCheck,
  Mail,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Globe,
  User,
  Eye,
  Volume2,
  VolumeX,
} from "lucide-react";
import { SITE } from "@/constants/site";
import { signOutAdmin, onAuthStateChanged } from "@/services/auth";
import { Loader2, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  subscribeNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  NotificationItem,
} from "@/services/db";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("en");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Notification features state
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'unread', 'read', 'volunteer', 'donation', 'partnership', 'event', 'contact'
  const [filterDate, setFilterDate] = useState("all"); // 'all', 'today', '7days', '30days'
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(20);
  const [lastNotificationCount, setLastNotificationCount] = useState<number | null>(null);

  // Initialize sound setting and ask push permission
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("notif_sound_enabled");
      setSoundEnabled(saved === "true");
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  const playNotificationSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      
      osc.stop(ctx.currentTime + 0.4);
    } catch (err) {
      console.error("Audio synth error:", err);
    }
  };

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeNotifications(
      (items) => {
        setNotifications(items || []);
        
        // Play audio & show native push notification if unread count increases
        const currentUnread = (items || []).filter(n => !n.read_status).length;
        if (lastNotificationCount !== null && currentUnread > lastNotificationCount) {
          const latest = items[0];
          
          // Sound
          if (localStorage.getItem("notif_sound_enabled") === "true") {
            playNotificationSound();
          }
          
          // Native push notification
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted" && latest) {
            new Notification(latest.title, {
              body: latest.message,
            });
          }
        }
        setLastNotificationCount(currentUnread);
      },
      (err) => {
        console.error("Realtime notifications subscription failed in AdminLayout:", err);
      },
    );
    return () => unsubscribe();
  }, [user, lastNotificationCount]);

  // Apply Search and Filters
  const filteredNotifications = notifications.filter((n) => {
    // Dismiss check
    if (dismissedIds.includes(n.id)) return false;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const titleMatch = n.title?.toLowerCase().includes(term);
      const msgMatch = n.message?.toLowerCase().includes(term);
      const typeMatch = n.type?.toLowerCase().includes(term);
      if (!titleMatch && !msgMatch && !typeMatch) return false;
    }

    // Status / Category Type filter
    if (filterType === "unread") {
      if (n.read_status) return false;
    } else if (filterType === "read") {
      if (!n.read_status) return false;
    } else if (filterType !== "all") {
      if (n.type !== filterType) return false;
    }

    // Date filter
    if (filterDate !== "all") {
      const notifTime = new Date(n.created_at).getTime();
      const diffMs = Date.now() - notifTime;
      const oneDay = 24 * 60 * 60 * 1000;
      if (filterDate === "today" && diffMs > oneDay) return false;
      if (filterDate === "7days" && diffMs > 7 * oneDay) return false;
      if (filterDate === "30days" && diffMs > 30 * oneDay) return false;
    }

    return true;
  });

  const paginatedNotifications = filteredNotifications.slice(0, visibleLimit);

  const unreadCount = notifications.filter((n) => !n.read_status).length;

  const getRelativeTime = (dateStr: string) => {
    const now = Date.now();
    const past = new Date(dateStr).getTime();
    const diffMs = now - past;
    const diffSec = Math.max(0, Math.floor(diffMs / 1000));
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${diffDay}d ago`;
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
    } catch (e) {
      console.error("Failed to mark notification read:", e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      toast.success("All notifications marked as read");
    } catch (e) {
      console.error("Failed to mark all notifications read:", e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      toast.success("Notification deleted permanently");
      setDeletingId(null);
    } catch (e) {
      console.error("Failed to delete notification:", e);
    }
  };

  const handleNavigate = (type: string) => {
    setNotifOpen(false);
    switch (type) {
      case "volunteer":
        router.push("/admin/volunteers");
        break;
      case "partnership":
        router.push("/admin/partnerships");
        break;
      case "donation":
        router.push("/admin/donations");
        break;
      case "contact":
        router.push("/admin/contact");
        break;
      case "event":
        router.push("/admin/events");
        break;
      case "program":
        router.push("/admin/programs");
        break;
      default:
        router.push("/admin/dashboard");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        router.push("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    // Close mobile drawer on route change
    setMobileOpen(false);
  }, [pathname]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-[#4040A1]" />
      </div>
    );
  }

  const menuItems = [
    { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Donations", to: "/admin/donations", icon: Heart },
    { label: "Events", to: "/admin/events", icon: Calendar },
    { label: "Gallery", to: "/admin/gallery", icon: ImageIcon },
    { label: "Programs", to: "/admin/programs", icon: GraduationCap },
    { label: "Team Members", to: "/admin/team", icon: Users },
    { label: "Volunteers", to: "/admin/volunteers", icon: UserCheck },
    { label: "Partnerships", to: "/admin/partnerships", icon: Handshake },
    { label: "Certificates", to: "/admin/certificates", icon: FileText },
    { label: "Transparency", to: "/admin/transparency", icon: ShieldCheck },
    { label: "Contact Messages", to: "/admin/contact", icon: Mail },
    { label: "Reports", to: "/admin/reports", icon: BarChart3 },
    { label: "Settings", to: "/admin/settings", icon: Settings },
  ];

  return (
    <div
      className={`min-h-screen font-sans flex text-slate-800 ${dark ? "bg-slate-950 text-slate-100 dark" : "bg-slate-50"}`}
    >
      {/* BACKGROUND DECORATIONS (Vercel-like Glows) */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#4040A1]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#7A9D1C]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* MOBILE DRAWER BACKDROP */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden animate-fade-in"
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200/80 shadow-xs flex flex-col justify-between transition-all duration-300 lg:sticky lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } w-64 lg:${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={SITE.logo}
              alt="Uday logo"
              className="h-10 w-10 rounded-full flex-none shadow-xs"
            />
            {!collapsed && (
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-bold text-sm text-primary truncate">Uday Trust</span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  Admin Portal
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Collapse toggle (desktop only) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 cursor-pointer"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
            {/* Close toggle (mobile only) */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Sidebar Menu Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
          {menuItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.to}
                href={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? "bg-[#4040A1]/10 text-primary border-l-4 border-primary pl-2 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-l-4 border-transparent"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 flex-none transition-transform group-hover:scale-105" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 flex-none" />
            {!collapsed && <span>Exit Portal</span>}
          </button>
        </div>
      </aside>

      {/* RIGHT SIDE MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs h-16 flex items-center px-4 md:px-6 justify-between gap-4">
          {/* Left: Mobile hamburger menu & Page Name indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-50 text-slate-500 cursor-pointer"
              aria-label="Toggle Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-60">
              <Search className="h-4 w-4 text-slate-400 flex-none" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full text-xs font-medium focus:outline-hidden bg-transparent"
              />
            </div>
          </div>

          {/* Right: Actions block */}
          <div className="flex items-center gap-2.5">
            {/* Language indicator */}
            <div className="relative">
              <button
                onClick={() => setLang(lang === "en" ? "gu" : "en")}
                className="h-10 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                title="Toggle Interface Language"
              >
                <Globe className="h-4 w-4 text-primary" />
                <span>{lang}</span>
              </button>
            </div>

            {/* Dark Mode toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="h-10 w-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
              title="Toggle Light/Dark Theme"
            >
              {dark ? (
                <Sun className="h-4 w-4 text-amber-500" />
              ) : (
                <Moon className="h-4 w-4 text-primary" />
              )}
            </button>

            {/* Notifications Box */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setProfileOpen(false);
                }}
                className="h-10 w-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center relative cursor-pointer"
                title={`Notifications (${unreadCount} unread)`}
              >
                <Bell className="h-4 w-4 text-slate-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse border-2 border-white" />
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40 cursor-default" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-96 bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-200 flex flex-col max-h-[500px]">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                      <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                        Notifications ({filteredNotifications.filter(n => !n.read_status).length} unread)
                      </span>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[10px] text-primary font-bold hover:underline cursor-pointer bg-transparent border-0"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const val = !soundEnabled;
                            setSoundEnabled(val);
                            localStorage.setItem("notif_sound_enabled", String(val));
                            toast.success(`Sound alerts ${val ? "enabled" : "disabled"}`);
                          }}
                          className={`p-1 rounded-lg border ${soundEnabled ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-slate-50 border-slate-200 text-slate-400"} flex items-center justify-center cursor-pointer`}
                          title={soundEnabled ? "Disable Sound Alert" : "Enable Sound Alert"}
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Search & Filters */}
                    <div className="space-y-2 mb-3">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search notifications..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      
                      <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto no-scrollbar">
                        <button
                          type="button"
                          onClick={() => setFilterType("all")}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold border transition-colors cursor-pointer ${filterType === "all" ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                        >
                          All
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilterType("unread")}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold border transition-colors cursor-pointer ${filterType === "unread" ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                        >
                          Unread
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilterType("read")}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold border transition-colors cursor-pointer ${filterType === "read" ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                        >
                          Read
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilterType("volunteer")}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold border transition-colors cursor-pointer ${filterType === "volunteer" ? "bg-blue-500 text-white border-blue-500" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                        >
                          Volunteer
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilterType("donation")}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold border transition-colors cursor-pointer ${filterType === "donation" ? "bg-emerald-500 text-white border-emerald-500" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                        >
                          Donation
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilterType("partnership")}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold border transition-colors cursor-pointer ${filterType === "partnership" ? "bg-purple-500 text-white border-purple-500" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                        >
                          Partnership
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilterType("event")}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold border transition-colors cursor-pointer ${filterType === "event" ? "bg-amber-500 text-white border-amber-500" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                        >
                          Events
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilterType("contact")}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold border transition-colors cursor-pointer ${filterType === "contact" ? "bg-slate-500 text-white border-slate-500" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                        >
                          Contact
                        </button>
                      </div>

                      <div className="flex gap-1 border-t border-slate-100 pt-1.5">
                        <span className="text-[9px] text-slate-400 font-bold uppercase py-0.5 mr-1">Date:</span>
                        {["all", "today", "7days", "30days"].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setFilterDate(d)}
                            className={`px-1.5 py-0.5 rounded text-[8px] font-bold transition-colors cursor-pointer ${filterDate === d ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                          >
                            {d === "all" ? "All" : d === "today" ? "Today" : d === "7days" ? "7 Days" : "30 Days"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notification List */}
                    <div className="overflow-y-auto no-scrollbar flex-1 space-y-2.5 divide-y divide-slate-100/50 pr-1">
                      {paginatedNotifications.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 font-semibold flex flex-col items-center justify-center gap-1">
                          <CheckCircle2 className="h-8 w-8 text-slate-300 animate-bounce" />
                          <span>No matching notifications</span>
                        </div>
                      ) : (
                        paginatedNotifications.map((n) => {
                          let badgeClass = "bg-slate-100 text-slate-600";
                          if (n.type === "volunteer") badgeClass = "bg-blue-100 text-blue-800";
                          else if (n.type === "donation") badgeClass = "bg-emerald-100 text-emerald-800";
                          else if (n.type === "partnership") badgeClass = "bg-purple-100 text-purple-800";
                          else if (n.type === "event") badgeClass = "bg-amber-100 text-amber-800";
                          else if (n.type === "contact") badgeClass = "bg-slate-100 text-slate-800";
                          else if (n.type === "system") badgeClass = "bg-rose-100 text-rose-800";

                          return (
                            <div
                              key={n.id}
                              onClick={() => {
                                setSelectedNotif(n);
                                if (!n.read_status) handleMarkRead(n.id);
                              }}
                              className={`pt-2.5 first:pt-0 group relative flex flex-col p-2 rounded-xl transition-all hover:bg-slate-100 cursor-pointer ${
                                n.read_status ? "bg-white opacity-70" : "bg-slate-50/70 border-l-4 border-primary"
                              }`}
                            >
                              <div className="flex items-start gap-2 justify-between pr-14">
                                <div>
                                  <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${badgeClass}`}>
                                    {n.type}
                                  </span>
                                  {!n.read_status && (
                                    <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                                  )}
                                  <h4 className="font-bold text-slate-800 text-[12px] mt-1 leading-snug">
                                    {n.title}
                                  </h4>
                                  <p className="text-slate-500 text-[10px] mt-0.5 leading-relaxed line-clamp-2">
                                    {n.message}
                                  </p>
                                  <span className="text-[9px] text-slate-400 font-bold block mt-1">
                                    {getRelativeTime(n.created_at)}
                                  </span>
                                </div>
                              </div>

                              {/* Local Close & Other Actions */}
                              <div className="absolute right-2 top-2 flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDismissedIds(prev => [...prev, n.id]);
                                    toast.success("Notification dismissed locally");
                                  }}
                                  className="h-5 w-5 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer border border-transparent"
                                  title="Dismiss Locally"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeletingId(n.id);
                                  }}
                                  className="h-5 w-5 rounded-md hover:bg-rose-50 text-rose-500 flex items-center justify-center cursor-pointer border border-transparent"
                                  title="Delete Permanent"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Pagination / Load More */}
                    {filteredNotifications.length > visibleLimit && (
                      <button
                        type="button"
                        onClick={() => setVisibleLimit(prev => prev + 20)}
                        className="w-full mt-2 py-1.5 text-center text-xs font-bold text-primary hover:bg-slate-50 border border-slate-100 rounded-xl cursor-pointer"
                      >
                        Load More
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotifOpen(false);
                }}
                className="h-10 rounded-xl border border-slate-200 pl-2 pr-3 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <div className="hidden md:flex flex-col text-left leading-none">
                  <span className="text-xs font-bold">Admin User</span>
                  <span className="text-[9px] text-slate-400 font-semibold">
                    Super Administrator
                  </span>
                </div>
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 shadow-xl rounded-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        router.push("/admin/settings");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="h-4 w-4" /> Profile Info
                    </button>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        router.push("/admin/settings");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <Settings className="h-4 w-4" /> Settings
                    </button>
                    <div className="h-px bg-slate-100 my-1" />
                    <button
                      onClick={async () => {
                        setProfileOpen(false);
                        try {
                          await signOutAdmin();
                          router.push("/admin/login");
                        } catch (e) {
                          console.error("Sign out error:", e);
                        }
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 text-xs font-semibold text-rose-600 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* CONTAINER FOR NESTED ROUTE VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* DETAIL DRAWER OVERLAY */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setSelectedNotif(null)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-1 rounded-lg">
                  {selectedNotif.type} Details
                </span>
                <button
                  onClick={() => setSelectedNotif(null)}
                  className="h-8 w-8 rounded-lg hover:bg-slate-50 flex items-center justify-center border-0 cursor-pointer text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800 leading-snug">{selectedNotif.title}</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Received: {new Date(selectedNotif.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs text-slate-600 leading-relaxed font-medium">
                  {selectedNotif.message}
                </div>

                {selectedNotif.related_record_id && (
                  <div className="border border-slate-100 rounded-xl p-4 space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Related Record Details</span>
                    <div className="grid grid-cols-2 gap-y-2 text-xs">
                      <span className="text-slate-400 font-semibold">Record ID:</span>
                      <span className="text-slate-700 font-bold break-all select-all">{selectedNotif.related_record_id}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-6 flex gap-3">
              {selectedNotif.related_record_id && (
                <button
                  onClick={() => {
                    handleNavigate(selectedNotif.type);
                    setSelectedNotif(null);
                  }}
                  className="flex-1 py-2 px-4 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/95 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-primary/20 border-0"
                >
                  <Eye className="h-4 w-4" /> Go to Module
                </button>
              )}
              <button
                onClick={() => {
                  setDeletingId(selectedNotif.id);
                  setSelectedNotif(null);
                }}
                className="py-2 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-transparent"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setDeletingId(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-bold text-slate-800">Delete Notification?</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed font-semibold">
              This action will permanently delete this notification record from the database. It cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer bg-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 cursor-pointer border-0 shadow-sm shadow-rose-600/10"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminLayout;
