"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData)

    if (data.password !== data.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
        headers: { "Content-Type": "application/json" },
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        setError(result.message || "Une erreur est survenue")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (e) {
      setError("Erreur de connexion au serveur.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Créer un compte</CardTitle>
        <CardDescription>Entrez vos informations ci-dessous</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            {error && (
              <div className="text-red-500 text-sm font-medium mb-4">{error}</div>
            )}

            <Field>
              <FieldLabel htmlFor="lastName">Nom</FieldLabel>
              <Input id="lastName" name="lastName" type="text" placeholder="Dupont" required />
            </Field>

            <Field>
              <FieldLabel htmlFor="firstName">Prénom</FieldLabel>
              <Input id="firstName" name="firstName" type="text" placeholder="Jean" required />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" name="email" type="email" placeholder="exemple@email.com" required />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
              <Input id="password" name="password" type="password" required />
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirmer le mot de passe</FieldLabel>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </Field>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Création du compte..." : "Créer un compte"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}