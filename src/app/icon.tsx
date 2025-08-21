import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 48,
  height: 48,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(45deg, #000000, #333333)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Main "B" */}
        <div
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#ffffff',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          B
        </div>
        
        {/* Small decorative dot */}
        <div
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#90ee90',
            bottom: '8px',
            right: '8px',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}