import argon2i from 'argon2';

export const ArgonHash = async (password: string) => {
    try {
        return await argon2i.hash(password);
    } catch (e) {
        console.error("Erreur ArgonHash:", e);
        return null; 
    }
}

export const ArgonVerify = async (hash: string, passwordPlan: string) => {
    try {
        return await argon2i.verify(hash, passwordPlan);
    } catch (e) {
        console.error("Erreur ArgonVerify:", e);
        return false;
    }
}