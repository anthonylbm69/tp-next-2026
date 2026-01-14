import argon2i from 'argon2';

export const ArgonHash = async (password: string) => {
    try {
        // Il faut obligatoirement le 'return' ici !
        return await argon2i.hash(password);
    } catch (e) {
        console.error("Erreur ArgonHash:", e);
        return null; // Retourner null est plus explicite que "false"
    }
}

export const ArgonVerify = async (hash: string, passwordPlan: string) => {
    try {
        // Ici aussi, on doit retourner le résultat (true ou false)
        return await argon2i.verify(hash, passwordPlan);
    } catch (e) {
        console.error("Erreur ArgonVerify:", e);
        return false;
    }
}