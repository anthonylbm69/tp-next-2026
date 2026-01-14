import { IRegister } from "../../../../interface/user";
import { Mregister } from "../../../../middleware/register";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ArgonHash } from "@/lib/argon2i";

export async function POST(req: NextRequest) {

    const { firstName, lastName, email, password, confirmPassword }: IRegister = await req.json()

    const middle = Mregister({ firstName, lastName, email, password, confirmPassword })

    if (middle.length > 0) {
        return Response.json(middle)
    }

    try {
        const ps = await ArgonHash(password);

        if (!ps || ps === "false") {
            return Response.json({ error: true, message: "Hash failed", code: "E02" }, { status: 500 });
        }

        await prisma.user.create({
            data: { firstName, lastName, email, password: ps },
        });

        return Response.json({
            error: false,
            data: { firstName, lastName, email }
        }, { status: 201 }); // 201 = Created

    } catch (e: any) {
        console.error(e);

        // Si l'email existe déjà dans la base
        if (e.code === 'P2002') {
            return Response.json({
                error: true,
                message: "Cet email est déjà utilisé.",
                code: "E03"
            }, { status: 400 });
        }

        return Response.json({ error: true, message: "Erreur serveur", code: "E02" }, { status: 500 });
    }
}
