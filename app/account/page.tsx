import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  IconUser,
  IconMail,
  IconLock,
  IconArrowLeft,
  IconShieldCheck,
} from "@tabler/icons-react";
import { AccountForm } from "@/components/account-form";

export const revalidate = 0;

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) redirect("/login");

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  const userId = Number(payload.userId || payload.id);

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
            <IconArrowLeft className="size-4" />
          </div>
          Retour au Dashboard
        </Link>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
          <IconUser className="text-blue-600 size-8" /> Mon Compte
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Gérez vos informations personnelles et votre sécurité.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
              <IconUser className="text-blue-600 dark:text-blue-400 size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Informations personnelles
              </h2>
              <p className="text-sm text-zinc-500">
                Modifiez votre nom et prénom
              </p>
            </div>
          </div>

          <AccountForm
            type="profile"
            initialData={{
              firstName: user.firstName,
              lastName: user.lastName,
            }}
          />
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-2xl">
              <IconMail className="text-purple-600 dark:text-purple-400 size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Adresse email
              </h2>
              <p className="text-sm text-zinc-500">
                Modifiez votre adresse email de connexion
              </p>
            </div>
          </div>

          <AccountForm
            type="email"
            initialData={{
              email: user.email,
            }}
          />
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-2xl">
              <IconLock className="text-red-600 dark:text-red-400 size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Mot de passe
              </h2>
              <p className="text-sm text-zinc-500">
                Changez votre mot de passe
              </p>
            </div>
          </div>

          <AccountForm type="password" />
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 flex gap-3">
          <IconShieldCheck className="text-amber-600 dark:text-amber-500 shrink-0 size-5" />
          <div>
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
              Sécurité de votre compte
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-400 mt-1">
              Nous vous recommandons d'utiliser un mot de passe fort et unique. Activez la validation en deux étapes pour plus de sécurité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}