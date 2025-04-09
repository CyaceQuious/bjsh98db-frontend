export function checkUserName(userName: string): boolean {
    return /^\w+$/.test(userName) || userName.length === 0;
}

export function checkPassword(password: string): boolean {
    return /^\w+$/.test(password) || password.length === 0;
}