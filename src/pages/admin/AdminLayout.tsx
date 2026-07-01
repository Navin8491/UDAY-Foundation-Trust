import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { SITE } from "@/constants/site";
import { signOutAdmin, onAuthStateChanged } from "@/services/auth";
import { Loader2, Trash2, CheckCircle2 } from "lucide-react";
import {
  subscribeNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  NotificationItem
} from "@/services/db";

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("en");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeNotifications(
      (items) => {
        setNotifications(items || []);
      },
      (err) => {
        console.error("Realtime notifications subscription failed in AdminLayout:", err);
      }
    );
    return () => unsubscribe();
  }, []);

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
    } catch (e) {
      console.error("Failed to mark all notifications read:", e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
    } catch (e) {
      console.error("Failed to delete notification:", e);
    }
  };

  const handleNavigate = (type: string) => {
    setNotifOpen(false);
    switch (type) {
      case "volunteer":
        navigate("/admin/volunteers");
        break;
      case "partnership":
        navigate("/admin/partnerships");
        break;
      case "donation":
        navigate("/admin/donations");
        break;
      case "contact":
        navigate("/admin/contact");
        break;
      case "event":
        navigate("/admin/events");
        break;
      case "program":
        navigate("/admin/programs");
        break;
      default:
        navigate("/admin/dashboard");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setLoading(false);
      if (!currentUser) {
        navigate("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Close mobile drawer on route change
    setMobileOpen(false);
  }, [location.pathname]);

  if (loading) {
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
    <div className={`min-h-screen font-sans flex text-slate-800 ${dark ? "bg-slate-950 text-slate-100 dark" : "bg-slate-50"}`}>
      
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
      <aside className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200/80 shadow-xs flex flex-col justify-between transition-all duration-300 lg:sticky lg:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } w-64 lg:${collapsed ? "w-20" : "w-64"}`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img src={SITE.logo} alt="Uday logo" className="h-10 w-10 rounded-full flex-none shadow-xs" />
            {!collapsed && (
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-bold text-sm text-primary truncate">Uday Trust</span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Admin Portal</span>
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
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
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
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? "bg-[#4040A1]/10 text-primary border-l-4 border-primary pl-2 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-l-4 border-transparent"
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-none transition-transform group-hover:scale-105" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => navigate("/")}
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
              {dark ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-primary" />}
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
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-900">
                        Notifications ({unreadCount})
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[10px] text-primary font-bold hover:underline cursor-pointer bg-transparent border-0"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto no-scrollbar space-y-2.5 divide-y divide-slate-100/50">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 font-semibold flex flex-col items-center justify-center gap-1">
                          <CheckCircle2 className="h-8 w-8 text-slate-300" />
                          <span>No notifications yet</span>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`pt-2.5 first:pt-0 group relative flex flex-col ${
                              n.read_status ? "opacity-75" : ""
                            }`}
                          >
                            <div className="flex items-start gap-2 justify-between pr-10">
                              <div>
                                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                                  n.type === "volunteer" ? "bg-blue-50 text-blue-600" :
                                  n.type === "partnership" ? "bg-amber-50 text-amber-600" :
                                  n.type === "donation" ? "bg-emerald-50 text-emerald-600" :
                                  "bg-slate-50 text-slate-600"
                                }`}>
                                  {n.type}
                                </span>
                                <h4 className="font-bold text-slate-800 text-[13px] mt-1 leading-snug">
                                  {n.title}
                                </h4>
                                <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                                  {n.message}
                                </p>
                                <span className="text-[9px] text-slate-400 font-bold block mt-1">
                                  {getRelativeTime(n.created_at)}
                                </span>
                              </div>
                            </div>

                            {/* Actions toolbar */}
                            <div className="absolute right-0 top-2.5 flex items-center gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              {!n.read_status && (
                                <button
                                  onClick={() => handleMarkRead(n.id)}
                                  className="h-6 w-6 rounded-md hover:bg-emerald-50 text-emerald-600 flex items-center justify-center cursor-pointer border border-transparent hover:border-emerald-100"
                                  title="Mark as Read"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                              {n.related_record_id && (
                                <button
                                  onClick={() => handleNavigate(n.type)}
                                  className="h-6 w-6 rounded-md hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer border border-transparent hover:border-slate-200"
                                  title="View Details"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(n.id)}
                                className="h-6 w-6 rounded-md hover:bg-rose-50 text-rose-600 flex items-center justify-center cursor-pointer border border-transparent hover:border-rose-100"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
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
                  <span className="text-[9px] text-slate-400 font-semibold">Super Administrator</span>
                </div>
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 shadow-xl rounded-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <button 
                      onClick={() => { setProfileOpen(false); navigate("/admin/settings"); }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="h-4 w-4" /> Profile Info
                    </button>
                    <button 
                      onClick={() => { setProfileOpen(false); navigate("/admin/settings"); }}
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
                          navigate("/admin/login");
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
          <Outlet />
        </main>
      </div>

    </div>
  );
}
export default AdminLayout;
