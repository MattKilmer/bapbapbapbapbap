import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BapBapBapBapBap - just tap it';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #000000, #1a1a1a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Main title */}
        <div
          style={{
            fontSize: '92px',
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: '30px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          BapBapBapBapBap
        </div>
        
        {/* Subtitle */}
        <div
          style={{
            fontSize: '38px',
            fontWeight: 'normal',
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          just tap it
        </div>
        
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: '#90ee90',
            top: '15%',
            left: '10%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#87ceeb',
            top: '25%',
            right: '15%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            background: '#ffd700',
            bottom: '20%',
            left: '8%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '25px',
            height: '25px',
            borderRadius: '50%',
            background: '#ff69b4',
            bottom: '15%',
            right: '12%',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}