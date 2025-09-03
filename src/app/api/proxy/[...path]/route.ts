import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://193.111.77.142/api';

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
        const path = params.path.join('/');
        const searchParams = request.nextUrl.searchParams.toString();
        const url = `${API_BASE_URL}/${path}${searchParams ? `?${searchParams}` : ''}`;

        console.log('🔄 Proxy GET Request:', url);

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

        const data = await response.json();
        console.log('✅ Backend success response');
        
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
        const searchParams = request.nextUrl.searchParams.toString();
        const url = `${API_BASE_URL}/${path}${searchParams ? `?${searchParams}` : ''}`;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Authorization header'ını kopyala
        const authHeader = request.headers.get('authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const response = await fetch(url, {
            method: 'DELETE',
            headers,
        });

        const data = await response.json();
        return NextResponse.json(data, { 
            status: response.status,
            headers: getResponseHeaders()
        });
    } catch (error) {
        console.error('Proxy DELETE error:', error);
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