"use client";

import { Menu, Search, Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface NavbarProps {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

const demoNotifications = [
  { id: 1, message: "System maintenance scheduled for tonight." },
  { id: 2, message: "New FMEA analysis assigned to you." },
  { id: 3, message: "Password will expire in 5 days." },
];

const demoSearchItems = [
  "Dashboard",
  "Equipment",
  "Failure Modes",
  "Tasks",
  "Teams",
  "Users",
];

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, isSidebarOpen }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const user = session?.user;
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.image);

  useEffect(() => {
    // Always fetch the latest user data from the backend
    fetch("/api/users/me")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.avatar?.url) setAvatarUrl(data.avatar.url);
      });
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast({ title: 'Success', description: 'Logged out successfully' });
    router.push('/login');
  };

  const [searchTerm, setSearchTerm] = useState("");
  const filteredSearch = demoSearchItems.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <header className="bg-primary text-primary-foreground shadow-md py-3 fixed w-full top-0 z-40 overflow-x-hidden">
      <div className="container mx-auto px-4 flex items-center justify-between w-full max-w-full">
        <div className="flex items-center space-x-4 min-w-0">
          {/* Sidebar toggle/close button */}
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10 flex-shrink-0"
              onClick={onMenuClick}
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
          <Link href="/" className="flex items-center min-w-0">
            <span className="text-lg font-bold whitespace-nowrap">DWTask AMS - FMEA</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2 min-w-0">
          {/* Search button with dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10 hidden sm:inline-flex"
              >
                <Search className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="mb-2"
                autoFocus
              />
              {filteredSearch.length > 0 ? (
                filteredSearch.map(item => (
                  <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No results found</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Bell/notification button with dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10 hidden sm:inline-flex"
              >
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {demoNotifications.length > 0 ? (
                demoNotifications.map(n => (
                  <DropdownMenuItem key={n.id}>{n.message}</DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Theme toggle button */}
          <ThemeToggle />
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="gap-2">
                  <Avatar className="h-7 w-7" onClick={() => { if (avatarUrl) window.open(avatarUrl, '_blank'); }} style={{ cursor: avatarUrl ? 'pointer' : 'default' }}>
                    <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={user?.name || 'User'} />
                    <AvatarFallback>{user?.name ? user.name[0] : 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline-block">
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  Settings
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                  <DropdownMenuItem onClick={() => router.push('/teams')}>
                    Team Management
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="secondary" size="sm" onClick={() => router.push('/login')}>
                Login
              </Button>
              <Button variant="secondary" size="sm" onClick={() => router.push('/signup')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar; 