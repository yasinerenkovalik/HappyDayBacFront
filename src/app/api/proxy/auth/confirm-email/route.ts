import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { apiConfig } from '@/config/api';

// API route'u dynamic olarak çalıştırmaya zorla
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// SSL sertifika sorununu çözmek için Node.js fetch'ini disable edip native fetch kullan
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, token } = body;
    
    if (!companyId || !token) {
      return NextResponse.json(
        { isSuccess: false, message: 'Company ID ve token gerekli' },
        { status: 400 }
      );
    }

    console.log('Email confirmation request:', { companyId, token });

    // Backend API URL'i (centralized, supports HTTPS)
    const backendUrl = apiConfig.baseUrl;
    
    console.log('Using backend URL:', backendUrl);
    
    const response = await fetch(`${backendUrl}/Company/confirm-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        companyId: companyId,
        token: token
      }),
      ...(backendUrl.startsWith('https://') && {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        agent: new (require('https').Agent)({ rejectUnauthorized: false })
      })
    });

    const data = await response.json();
    
    console.log('Backend confirmation response:', data);
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Email confirmation proxy error:', error);
    return NextResponse.json(
      { 
        isSuccess: false, 
        message: 'Sunucu bağlantısı kurulamadı. Lütfen daha sonra tekrar deneyin.',
        error: error.message 
      },
      { status: 500 }
    );
  }
}