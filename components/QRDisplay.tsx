'use client'
import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

export default function QRDisplay({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 256,
        margin: 2,
        color: { dark: '#4338CA', light: '#FFFFFF' },
      })
    }
  }, [url])

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas ref={canvasRef} className="rounded-xl shadow-sm" />
      <p className="text-xs text-gray-400 break-all text-center max-w-xs">{url}</p>
    </div>
  )
}
