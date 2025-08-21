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
          background: 'linear-gradient(45deg, #000000, #1a1a1a, #333333)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Pulsing glow effect background */}
        <div
          style={{
            position: 'absolute',
            inset: '0',
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        
        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: '0',
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '150px 150px',
            opacity: 0.3,
          }}
        />
        
        {/* Main title */}
        <div
          style={{
            fontSize: '96px',
            fontWeight: '300',
            color: '#ffffff',
            textAlign: 'center',
            letterSpacing: '0.1em',
            textShadow: '0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,255,255,0.3)',
            marginBottom: '40px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          BapBapBapBapBap
        </div>
        
        {/* Subtitle */}
        <div
          style={{
            fontSize: '36px',
            fontWeight: '300',
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            letterSpacing: '0.05em',
            textShadow: '0 0 20px rgba(255,255,255,0.3)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          just tap it
        </div>
        
        {/* Decorative particles */}
        <div
          style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#90ee90',
            top: '20%',
            left: '15%',
            boxShadow: '0 0 20px #90ee90',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            background: '#87ceeb',
            top: '30%',
            right: '20%',
            boxShadow: '0 0 15px #87ceeb',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '25px',
            height: '25px',
            borderRadius: '50%',
            background: '#ffd700',
            bottom: '25%',
            left: '10%',
            boxShadow: '0 0 25px #ffd700',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#ff69b4',
            bottom: '20%',
            right: '15%',
            boxShadow: '0 0 18px #ff69b4',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}