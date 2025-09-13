import { NextRequest, NextResponse } from 'next/server';

// API route'u dynamic olarak çalıştırmaya zorla
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const IMAGE_BASE_URL = 'http://193.111.77.142';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    
    // Handle placeholder requests
    if (path === 'placeholder.jpg') {
      // Generate a simple SVG placeholder
      const svg = `<svg width="400" height="256" viewBox="0 0 400 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="256" fill="#F3F4F6"/>
        <path d="M200 128H160L180 108H140L160 88H200L220 108H260L240 128H200Z" fill="#D5D9DD"/>
        <text x="200" y="140" text-anchor="middle" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="14">No Image</text>
      </svg>`;
      
      return new NextResponse(svg, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const url = `${IMAGE_BASE_URL}/${path}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      // Return placeholder on 404
      const svg = `<svg width="400" height="256" viewBox="0 0 400 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="256" fill="#F3F4F6"/>
        <path d="M200 128H160L180 108H140L160 88H200L220 108H260L240 128H200Z" fill="#D5D9DD"/>
        <text x="200" y="140" text-anchor="middle" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="14">Image Not Found</text>
      </svg>`;
      
      return new NextResponse(svg, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    // Return placeholder on error
    const svg = `<svg width="400" height="256" viewBox="0 0 400 256" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="256" fill="#F3F4F6"/>
      <path d="M200 128H160L180 108H140L160 88H200L220 108H260L240 128H200Z" fill="#D5D9DD"/>
      <text x="200" y="140" text-anchor="middle" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Error Loading Image</text>
    </svg>`;
    
    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}