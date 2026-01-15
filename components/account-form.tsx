"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

interface UserProfile {
  id: number
  email: string
  firstName: string
  lastName: string
}

export function AccountForm() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/user/profile")
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        } else {
          setError("Failed to load profile")
        }
      } catch (error) {
        setError("Error loading profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(event.currentTarget)
    const firstName = formData.get("firstName")
    const lastName = formData.get("lastName")
    const email = formData.get("email")

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        body: JSON.stringify({ firstName, lastName, email }),
        headers: { "Content-Type": "application/json" },
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        setError(result.message || "Failed to update profile")
      } else {
        setSuccess("Profile updated successfully!")
        setProfile(result.data)
      }
    } catch (err) {
      setError("Unable to contact server")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading...</p>
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        {success && (
          <div className="p-3 text-sm font-medium text-green-600 bg-green-50 rounded-md">
            {success}
          </div>
        )}

        {error && (
          <div className="p-3 text-sm font-medium text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="firstName">First Name</FieldLabel>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            defaultValue={profile?.firstName}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            defaultValue={profile?.lastName}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={profile?.email}
            required
          />
        </Field>

        <Field>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}