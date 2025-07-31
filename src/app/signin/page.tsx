
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Droplet } from "lucide-react"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { toast } from "@/hooks/use-toast"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = ref(database, 'users/' + user.uid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        const role = userData.role;

        toast({
            title: "Login Successful",
            description: "Welcome back!",
        });
        
        if (role === 'admin') {
            router.push("/admin/dashboard");
        } else {
            router.push("/dashboard");
        }
      } else {
        throw new Error("User role not found.");
      }

    } catch (error: any) {
      console.error("Authentication Error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50">
      <Card className="mx-auto max-w-sm shadow-lg">
        <CardHeader>
          <Link href="/" className="flex justify-center items-center mb-4">
              <Droplet className="h-8 w-8 text-primary" />
          </Link>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password"
                placeholder="********" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
             <div className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="underline">
                    Sign up
                </Link>
             </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
