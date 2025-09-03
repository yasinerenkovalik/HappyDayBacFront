// Common types used across the application

export interface Organization {
    id: string;
    name: string;
    description: string;
    category: string;
    city: string;
    price: number;
    rating: number;
    images: string[];
    features: string[];
    contact: {
        phone: string;
        email: string;
        address: string;
    };
}

export interface Company {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    description: string;
    logo?: string;
    organizations: Organization[];
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'company' | 'user';
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface SearchFilters {
    category?: string;
    city?: string;
    date?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
}