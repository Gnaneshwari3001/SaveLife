
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Droplet, LayoutDashboard, Users, Heart, Building, LogOut } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { toast } from "@/hooks/use-toast"

const adminNavLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/donors", label: "Donors", icon: Users },
  { href: "/admin/requests", label: "Requests", icon: Heart },
  { href: "/admin/banks", label: "Blood Banks", icon: Building },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      })
      router.push("/admin/login")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive",
      })
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarContent>
            <SidebarHeader>
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <Droplet className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg">Admin Panel</span>
              </Link>
            </SidebarHeader>
            <SidebarMenu>
              {adminNavLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <Link href={link.href}>
                    <SidebarMenuButton isActive={pathname === link.href}>
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 sm:justify-end">
            <SidebarTrigger className="sm:hidden" />
            <ThemeToggle />
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
