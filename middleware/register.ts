import { IRegister } from "@/interface/user";

export const Mregister = (user: IRegister) => {
    const { firstName, lastName, email, password, confirmPassword } = user;
    const errors = [];

    // Validation du prénom
    if (firstName.length < 2 || firstName.length > 20) { // ✅ Corrigé: && en ||
        errors.push({ 
            error: true, 
            message: "Le prénom doit contenir entre 2 et 20 caractères", 
            code: "E01" 
        });
    }

    // Validation du nom
    if (lastName.length < 2 || lastName.length > 20) { // ✅ Corrigé: && en ||
        errors.push({ 
            error: true, 
            message: "Le nom doit contenir entre 2 et 20 caractères", 
            code: "E02" 
        });
    }

    // Validation de l'email
    if (email.length < 3 || email.length > 50) { // ✅ Corrigé: && en ||
        errors.push({ 
            error: true, 
            message: "L'email doit contenir entre 3 et 50 caractères", 
            code: "E03" 
        });
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.push({ 
            error: true, 
            message: "Format d'email invalide", 
            code: "E03B" 
        });
    }

    // ✅ Nouvelles validations du mot de passe
    if (password.length < 8) {
        errors.push({ 
            error: true, 
            message: "Le mot de passe doit contenir au moins 8 caractères", 
            code: "E04A" 
        });
    }

    if (password.length > 100) {
        errors.push({ 
            error: true, 
            message: "Le mot de passe ne doit pas dépasser 100 caractères", 
            code: "E04B" 
        });
    }

    // Vérification majuscule
    if (!/[A-Z]/.test(password)) {
        errors.push({ 
            error: true, 
            message: "Le mot de passe doit contenir au moins une majuscule", 
            code: "E04C" 
        });
    }

    // Vérification minuscule
    if (!/[a-z]/.test(password)) {
        errors.push({ 
            error: true, 
            message: "Le mot de passe doit contenir au moins une minuscule", 
            code: "E04D" 
        });
    }

    // Vérification chiffre
    if (!/[0-9]/.test(password)) {
        errors.push({ 
            error: true, 
            message: "Le mot de passe doit contenir au moins un chiffre", 
            code: "E04E" 
        });
    }

    // Vérification caractère spécial
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push({ 
            error: true, 
            message: "Le mot de passe doit contenir au moins un caractère spécial", 
            code: "E04F" 
        });
    }

    // Validation confirmation mot de passe
    if (password !== confirmPassword) {
        errors.push({ 
            error: true, 
            message: "Les mots de passe ne correspondent pas", 
            code: "E06" 
        });
    }

    return errors;
}