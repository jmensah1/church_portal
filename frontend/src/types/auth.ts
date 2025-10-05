// Authentication types for the Church Portal

export interface User {
    userId: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    msg?: string;
}

export interface ApiError {
    msg: string;
    statusCode: number;
}
