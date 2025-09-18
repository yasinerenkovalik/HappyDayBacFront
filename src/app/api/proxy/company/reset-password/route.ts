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
    const { companyId, token, newPassword } = body;
    
    if (!companyId || !token || !newPassword) {
      return NextResponse.json(
        { isSuccess: false, message: 'Company ID, token ve yeni şifre gerekli' },
        { status: 400 }
      );
    }

    console.log('Password reset confirmation request:', { companyId, token: token.substring(0, 10) + '...' });

    // Backend API URL'i (centralized, HTTPS destekli)
    const backendUrl = apiConfig.baseUrl;
    
    console.log('Using backend URL:', backendUrl);
    
    const response = await fetch(`${backendUrl}/Company/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
      },
      body: JSON.stringify({
        companyId: companyId,
        token: token,
        newPassword: newPassword
      }),
      ...(backendUrl.startsWith('https://') && {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        agent: new (require('https').Agent)({ rejectUnauthorized: false })
      })
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
        message: text || (response.ok ? 'Şifreniz başarıyla güncellendi' : 'Şifre sıfırlama işlemi başarısız')
      };
    }
    
    console.log('Backend password reset confirmation response:', data);
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Password reset confirmation proxy error:', error);
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