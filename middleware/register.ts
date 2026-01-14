import { IRegister } from "@/interface/user";
 
export const Mregister = (user: IRegister) => {
    const { firstName, lastName, email, password, confirmPassword } = user
    const a = []
    if (firstName.length < 2 && firstName.length > 20) {
        a.push({ error: true, message: "First name must be at least 2 characters long and at most 20 characters long", code: "E01" })
    }
 
    if (lastName.length < 2 && lastName.length > 20) {
        a.push({ error: true, message: "Last name must be at least 2 characters long and at most 20 characters long", code: "E02" })
    }
 
    if (email.length < 3 && email.length > 50) {
        a.push({ error: true, message: "Email must be at least 3 characters long and at most 50 characters long", code: "E03" })
    }
 
    if (password.length < 3 && password.length > 20) {
        a.push({ error: true, message: "Password must be at least 3 characters long and at most 20 characters long", code: "E04" })
    }
 
    if (confirmPassword.length < 3 && confirmPassword.length > 20) {
        a.push({ error: true, message: "Confirm password must be at least 3 characters long and at most 20 characters long", code: "E05" })
    }
 
    if (password !== confirmPassword) {
        a.push({ error: true, message: "password and confirm password must be the same", code: "E06" })
    }
 
    return a
}