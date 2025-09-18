import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { apiConfig } from '@/config/api';

// API route'u dynamic olarak çalıştırmaya zorla
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const authToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!authToken) {
      return NextResponse.json(
        { isSuccess: false, message: 'Token gerekli' },
        { status: 401 }
      );
    }

    // Centralized backend URL (supports HTTPS)
    const backendUrl = apiConfig.baseUrl;
    
    const response = await fetch(`${backendUrl}/Auth/check-verification-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
      },
      ...(backendUrl.startsWith('https://') && {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        agent: new (require('https').Agent)({ rejectUnauthorized: false })
      })
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Check verification status proxy error:', error);
    return NextResponse.json(
      { 
        isSuccess: false, 
        message: 'Sunucu bağlantısı kurulamadı. Backend sunucusunun çalıştığından emin olun.',
        error: error.message 
      },
      { status: 500 }
    );
  }
}