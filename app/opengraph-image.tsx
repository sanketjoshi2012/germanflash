import { ImageResponse } from 'next/og'

export const alt = 'germanflash — Learn German A1 with spaced repetition'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fafafa',
          fontFamily: 'sans-serif',
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 500,
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          germanflash
        </div>
        <div
          style={{
            fontSize: 36,
            color: '#a1a1aa',
            marginTop: 24,
            fontWeight: 400,
          }}
        >
          Learn German A1 with spaced repetition
        </div>
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 100,
            fontSize: 48,
            fontWeight: 500,
          }}
        >
          <span style={{ color: '#3b82f6' }}>der</span>
          <span style={{ color: '#ec4899' }}>die</span>
          <span style={{ color: '#22c55e' }}>das</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
