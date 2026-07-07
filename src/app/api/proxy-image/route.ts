import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('No URL provided', { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return new NextResponse('Failed to fetch image', { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Agar Google Photos linki berilsa, u HTML qaytaradi.
    // Biz o'sha HTML ichidan rasmni o'zini (og:image) qidirib topamiz!
    if (contentType.includes('text/html')) {
      const html = await response.text();
      // Open Graph image metasini qidirish
      const match = html.match(/<meta property="og:image" content="([^"]+)"/i) || html.match(/<meta itemprop="image" content="([^"]+)"/i);
      
      if (match && match[1]) {
        const imageUrl = match[1];
        // Haqiqiy rasmni yuklab olish
        const imgResponse = await fetch(imageUrl);
        if (imgResponse.ok) {
          const imgBlob = await imgResponse.blob();
          return new NextResponse(imgBlob, {
            headers: {
              'Content-Type': imgResponse.headers.get('content-type') || 'image/jpeg',
              'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400'
            }
          });
        }
      }
      return new NextResponse('Rasm topilmadi', { status: 404 });
    }

    const blob = await response.blob();

    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Proxy image error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
