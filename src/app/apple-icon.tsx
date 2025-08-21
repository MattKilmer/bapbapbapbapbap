import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #000000, #1a1a1a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderRadius: '20%',
        }}
      >
        {/* Main "B" */}
        <div
          style={{
            fontSize: '120px',
            fontWeight: 'bold',
            color: '#ffffff',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          B
        </div>
        
        {/* Decorative dots */}
        <div
          style={{
            position: 'absolute',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#90ee90',
            top: '20px',
            right: '20px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#87ceeb',
            bottom: '25px',
            left: '25px',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}