import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://193.111.77.142/api';

// Debug environment variables
console.log('🔧 Environment Debug:');
console.log('- API_BASE_URL:', API_BASE_URL);
console.log('- NODE_ENV:', process.env.NODE_ENV);

// Common response headers
const getResponseHeaders = () => ({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
});

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
    try {
        // Path validation
        if (!params.path || params.path.length === 0) {
            return NextResponse.json({
                error: 'Invalid Path',
                message: 'API path is required'
            }, { status: 400 });
        }

        const path = params.path.join('/');
        const searchParams = request.nextUrl.searchParams.toString();
        const url = `${API_BASE_URL}/${path}${searchParams ? `?${searchParams}` : ''}`;

        console.log('🔄 Proxy GET Request:', url);
        console.log('🔄 API_BASE_URL:', API_BASE_URL);
        console.log('🔄 Path:', path);

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Authorization header'ını kopyala
        const authHeader = request.headers.get('authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
            console.log('🔑 Auth header present:', authHeader.substring(0, 20) + '...');
        } else {
            console.log('❌ No auth header found');
        }

        console.log('📡 Calling backend:', url);
        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        console.log('📡 Backend response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Backend error response:', errorText);
            return NextResponse.json({
                error: 'Backend Error',
                message: errorText,
                status: response.status
            }, {
                status: response.status,
                headers: getResponseHeaders()
            });
        }

        const data = await response.json();
        console.log('✅ Backend success response:', data);

        return NextResponse.json(data, {
            status: response.status,
            headers: getResponseHeaders()
        });
    } catch (error) {
        console.error('💥 Proxy GET error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        if (error instanceof TypeError && error.message.includes('fetch')) {
            return NextResponse.json({
                error: 'Connection Error',
                message: 'Backend sunucusuna bağlanılamıyor',
                details: errorMessage
            }, {
                status: 503,
                headers: getResponseHeaders()
            });
        }

        return NextResponse.json({
            error: 'Internal Server Error',
            details: errorMessage
        }, {
            status: 500,
            headers: getResponseHeaders()
        });
    }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
    try {
        // Path validation
        if (!params.path || params.path.length === 0) {
            return NextResponse.json({
                error: 'Invalid Path',
                message: 'API path is required'
            }, { status: 400 });
        }

        const path = params.path.join('/');
        const url = `${API_BASE_URL}/${path}`;

        console.log('🚀 Making POST request to:', url);
        console.log('🔄 API_BASE_URL:', API_BASE_URL);
        console.log('🔄 Path:', path);

        const headers: HeadersInit = {};

        // Authorization header'ını kopyala
        const authHeader = request.headers.get('authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const contentType = request.headers.get('content-type');
        let body;

        if (contentType?.includes('application/json')) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(await request.json());
        } else if (contentType?.includes('multipart/form-data')) {
            body = await request.formData();
        } else {
            body = await request.text();
            if (contentType) {
                headers['Content-Type'] = contentType;
            }
        }

        console.log('🚀 Making POST request to:', url);
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body,
        });

        console.log('📡 Backend response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Backend error:', errorText);
            return NextResponse.json({
                error: 'Backend Error',
                message: errorText,
                status: response.status
            }, {
                status: response.status,
                headers: getResponseHeaders()
            });
        }

        // Response'u önce text olarak oku, sonra JSON parse et
        const responseText = await response.text();
        console.log('📡 Backend response text:', responseText.substring(0, 200) + '...');
        
        let data;
        try {
            data = JSON.parse(responseText);
            console.log('✅ Backend success response (parsed)');
        } catch (parseError) {
            console.error('❌ JSON parse error:', parseError);
            console.error('❌ Response text:', responseText);
            return NextResponse.json({
                error: 'Invalid JSON Response',
                message: 'Backend returned invalid JSON',
                responseText: responseText.substring(0, 500)
            }, {
                status: 502,
                headers: getResponseHeaders()
            });
        }

        return NextResponse.json(data, {
            status: response.status,
            headers: getResponseHeaders()
        });
    } catch (error) {
        console.error('💥 Proxy POST error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        if (error instanceof TypeError && error.message.includes('fetch')) {
            return NextResponse.json({
                error: 'Connection Error',
                message: 'Backend sunucusuna bağlanılamıyor',
                details: errorMessage
            }, {
                status: 503,
                headers: getResponseHeaders()
            });
        }

        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Proxy sunucusunda hata oluştu',
            details: errorMessage
        }, {
            status: 500,
            headers: getResponseHeaders()
        });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
    try {
        const path = params.path.join('/');
        const url = `${API_BASE_URL}/${path}`;

        const headers: HeadersInit = {};

        // Authorization header'ını kopyala
        const authHeader = request.headers.get('authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const contentType = request.headers.get('content-type');
        let body;

        if (contentType?.includes('application/json')) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(await request.json());
        } else if (contentType?.includes('multipart/form-data')) {
            body = await request.formData();
        } else {
            body = await request.text();
            if (contentType) {
                headers['Content-Type'] = contentType;
            }
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers,
            body,
        });

        const data = await response.json();
        return NextResponse.json(data, {
            status: response.status,
            headers: getResponseHeaders()
        });
    } catch (error) {
        console.error('Proxy PUT error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: 'Internal Server Error',
            details: errorMessage
        }, {
            status: 500,
            headers: getResponseHeaders()
        });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
    try {
        const path = params.path.join('/');
        const url = `${API_BASE_URL}/${path}`;

        console.log('🗑️ Proxy DELETE Request:', url);

        const headers: HeadersInit = {};

        // Authorization header'ını kopyala
        const authHeader = request.headers.get('authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
            console.log('🔑 Auth header present for DELETE');
        }

        // Request body'yi al ve Content-Type'a göre ilet
        const contentType = request.headers.get('content-type');
        let body: any = undefined;

        try {
            if (contentType?.includes('application/json')) {
                headers['Content-Type'] = 'application/json';
                const json = await request.json();
                body = JSON.stringify(json);
                console.log('📤 DELETE JSON body:', json);
            } else if (contentType?.includes('multipart/form-data')) {
                // FormData gönderiminde Content-Type otomatik ayarlansın (boundary ile)
                body = await request.formData();
                console.log('📤 DELETE multipart/form-data body (keys):', Array.from(body.keys()));
            } else if (contentType?.includes('application/x-www-form-urlencoded')) {
                headers['Content-Type'] = contentType;
                body = await request.text();
                console.log('📤 DELETE x-www-form-urlencoded body length:', body?.length || 0);
            } else {
                // Bazı istemciler Content-Type göndermeden gövde iletebilir
                const rawText = await request.text();
                if (rawText) {
                    if (contentType) headers['Content-Type'] = contentType;
                    body = rawText;
                    console.log('📤 DELETE raw body length:', rawText.length);
                } else {
                    console.log('ℹ️ No body in DELETE request');
                }
            }
        } catch (e) {
            console.log('ℹ️ Failed to read DELETE body:', e);
        }

        console.log('📡 Calling backend DELETE:', url);
        const response = await fetch(url, {
            method: 'DELETE',
            headers,
            body,
        });

        console.log('📡 Backend DELETE response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Backend DELETE error:', errorText);
            return NextResponse.json({
                error: 'Backend Error',
                message: errorText,
                status: response.status
            }, {
                status: response.status,
                headers: getResponseHeaders()
            });
        }

        // Response'u önce text olarak oku, sonra JSON parse et
        const responseText = await response.text();
        console.log('📡 Backend DELETE response text:', responseText.substring(0, 200) + '...');
        
        let data;
        try {
            data = JSON.parse(responseText);
            console.log('✅ Backend DELETE success (parsed)');
        } catch (parseError) {
            console.error('❌ DELETE JSON parse error:', parseError);
            console.error('❌ DELETE Response text:', responseText);
            return NextResponse.json({
                error: 'Invalid JSON Response',
                message: 'Backend returned invalid JSON for DELETE',
                responseText: responseText.substring(0, 500)
            }, {
                status: 502,
                headers: getResponseHeaders()
            });
        }

        return NextResponse.json(data, {
            status: response.status,
            headers: getResponseHeaders()
        });
    } catch (error) {
        console.error('💥 Proxy DELETE error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: 'Internal Server Error',
            details: errorMessage
        }, {
            status: 500,
            headers: getResponseHeaders()
        });
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: getResponseHeaders()
    });
}