"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { firebaseAuth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const idToken = await credential.user.getIdToken();

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });

      if (!response.ok) throw new Error("No se pudo crear sesión");
      toast.success("Sesión iniciada");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error de login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto mt-20 w-full max-w-md">
      <CardHeader>
        <CardTitle>Ingreso administrador</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@centro.cl" type="email" required />
          <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" required />
          <Button disabled={loading} className="w-full" type="submit">
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
