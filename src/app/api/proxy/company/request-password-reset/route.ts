import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { isSuccess: false, message: 'Email adresi gerekli' },
        { status: 400 }
      );
    }

    console.log('Password reset request for email:', email);

    // Backend API URL'i
    const backendUrl = process.env.API_BASE_URL || 'https://0.0.0.0/api';
    
    // Frontend app URL for reset links
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mutlugunum.com';
    
    console.log('Using backend URL:', backendUrl);
    console.log('Using app URL for reset links:', appUrl);
    
    const response = await fetch(`${backendUrl}/Company/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
      },
      body: JSON.stringify({
        email: email,
        callbackUrl: `${appUrl}/auth/reset-password`
      }),
    });

    // Backend'den gelen response'u handle et
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Text response
      const text = await response.text();
      data = { 
        isSuccess: response.ok, 
        message: text || (response.ok ? 'Şifre sıfırlama maili gönderildi' : 'Bir hata oluştu')
      };
    }
    
    console.log('Backend password reset response:', data);
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Password reset request proxy error:', error);
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