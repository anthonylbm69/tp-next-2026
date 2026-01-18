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
import { IconCheck, IconX, IconEye, IconEyeOff } from "@tabler/icons-react"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const passwordRules = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const isPasswordValid = Object.values(passwordRules).every(Boolean)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData)

    if (!isPasswordValid) {
      setError("Le mot de passe ne respecte pas tous les critères")
      setLoading(false)
      return
    }

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
              <div className="p-3 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md mb-4">
                {error}
              </div>
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
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  {showPassword ? (
                    <IconEyeOff className="size-5" />
                  ) : (
                    <IconEye className="size-5" />
                  )}
                </button>
              </div>

              {password && (
                <div className="mt-3 space-y-2">
                  <ValidationRule
                    isValid={passwordRules.minLength}
                    text="Au moins 8 caractères"
                  />
                  <ValidationRule
                    isValid={passwordRules.hasUpperCase}
                    text="Au moins une majuscule (A-Z)"
                  />
                  <ValidationRule
                    isValid={passwordRules.hasLowerCase}
                    text="Au moins une minuscule (a-z)"
                  />
                  <ValidationRule
                    isValid={passwordRules.hasNumber}
                    text="Au moins un chiffre (0-9)"
                  />
                  <ValidationRule
                    isValid={passwordRules.hasSpecialChar}
                    text="Au moins un caractère spécial (!@#$%...)"
                  />
                </div>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirmer le mot de passe</FieldLabel>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  {showConfirmPassword ? (
                    <IconEyeOff className="size-5" />
                  ) : (
                    <IconEye className="size-5" />
                  )}
                </button>
              </div>

              {confirmPassword && (
                <div className="mt-2">
                  <ValidationRule
                    isValid={passwordsMatch}
                    text="Les mots de passe correspondent"
                  />
                </div>
              )}
            </Field>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isPasswordValid || !passwordsMatch}
            >
              {loading ? "Création du compte..." : "Créer un compte"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

function ValidationRule({ isValid, text }: { isValid: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-sm transition-colors ${isValid
        ? 'text-green-600 dark:text-green-500'
        : 'text-zinc-400 dark:text-zinc-600'
      }`}>
      {isValid ? (
        <IconCheck className="h-4 w-4 shrink-0" />
      ) : (
        <IconX className="h-4 w-4 shrink-0" />
      )}
      <span>{text}</span>
    </div>
  )
}