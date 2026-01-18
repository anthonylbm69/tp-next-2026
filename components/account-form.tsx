"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconCheck, IconX, IconEdit, IconEye, IconEyeOff } from "@tabler/icons-react";

type AccountFormProps = {
  type: "profile" | "email" | "password";
  initialData?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
};

export function AccountForm({ type, initialData }: AccountFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false); // ✅ Mode édition

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordRules = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    if (type === "password") {
      if (!isPasswordValid) {
        setError("Le mot de passe ne respecte pas tous les critères");
        setLoading(false);
        return;
      }
      if (data.newPassword !== data.confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(`/api/account/update-${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        setError(result.message || "Une erreur est survenue");
      } else {
        setSuccess(true);
        setIsEditing(false); // ✅ Ferme le mode édition
        if (type === "password") {
          (e.target as HTMLFormElement).reset();
          setPassword("");
        }
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing && type !== "password") {
    return (
      <div className="space-y-4">
        {type === "profile" && (
          <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Prénom et Nom</p>
              <p className="font-semibold text-zinc-900 dark:text-white">
                {initialData?.firstName} {initialData?.lastName}
              </p>
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <IconEdit className="size-4" />
              Modifier
            </Button>
          </div>
        )}

        {type === "email" && (
          <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Adresse email</p>
              <p className="font-semibold text-zinc-900 dark:text-white">
                {initialData?.email}
              </p>
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <IconEdit className="size-4" />
              Modifier
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center gap-2">
          <IconCheck className="size-4" />
          Modifications enregistrées avec succès
        </div>
      )}

      {type === "profile" && (
        <>
          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
              Prénom
            </label>
            <Input
              name="firstName"
              type="text"
              defaultValue={initialData?.firstName}
              required
              placeholder="Jean"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
              Nom
            </label>
            <Input
              name="lastName"
              type="text"
              defaultValue={initialData?.lastName}
              required
              placeholder="Dupont"
            />
          </div>
        </>
      )}

      {type === "email" && (
        <div>
          <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
            Nouvelle adresse email
          </label>
          <Input
            name="email"
            type="email"
            defaultValue={initialData?.email}
            required
            placeholder="nouvelle@email.com"
          />
        </div>
      )}

      {type === "password" && (
        <>
          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
              Mot de passe actuel
            </label>
            <div className="relative">
              <Input
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                {showCurrentPassword ? (
                  <IconEyeOff className="size-5" />
                ) : (
                  <IconEye className="size-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <Input
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                {showNewPassword ? (
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
                  text="Au moins une majuscule"
                />
                <ValidationRule
                  isValid={passwordRules.hasLowerCase}
                  text="Au moins une minuscule"
                />
                <ValidationRule
                  isValid={passwordRules.hasNumber}
                  text="Au moins un chiffre"
                />
                <ValidationRule
                  isValid={passwordRules.hasSpecialChar}
                  text="Au moins un caractère spécial"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
              Confirmer le nouveau mot de passe
            </label>
            <div className="relative">
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
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
                  isValid={password === confirmPassword}
                  text="Les mots de passe correspondent"
                />
              </div>
            )}
          </div>
        </>
      )}

      <div className="flex gap-3">
        {type !== "password" && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(false)}
            className="flex-1"
          >
            Annuler
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading || (type === "password" && !isPasswordValid)}
          className={type !== "password" ? "flex-1" : "w-full"}
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}

function ValidationRule({ isValid, text }: { isValid: boolean; text: string }) {
  return (
    <div
      className={`flex items-center gap-2 text-sm transition-colors ${
        isValid
          ? "text-green-600 dark:text-green-500"
          : "text-zinc-400 dark:text-zinc-600"
      }`}
    >
      {isValid ? (
        <IconCheck className="h-4 w-4 shrink-0" />
      ) : (
        <IconX className="h-4 w-4 shrink-0" />
      )}
      <span>{text}</span>
    </div>
  );
}