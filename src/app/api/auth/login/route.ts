import { NextRequest, NextResponse } from 'next/server';
import { apiConfig } from '@/config/api';

// API route'u dynamic olarak çalıştırmaya zorla
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const API_BASE_URL = apiConfig.baseUrl;

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        const response = await fetch(`${API_BASE_URL}/Auth/Login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Login failed' },
                { status: response.status }
            );
        }

        const data = await response.json();
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}