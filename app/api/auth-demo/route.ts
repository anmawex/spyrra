import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { password } = await req.json()
  
  // En producción, asegúrate de configurar DEMO_PASSWORD en Vercel
  const correctPassword = process.env.DEMO_PASSWORD || 'spyrra123'

  if (password === correctPassword) {
    // Establecer cookie segura
    (await cookies()).set('access_granted', 'true', { 
      // maxAge: 1 día de sesión
      maxAge: 60 * 60 * 24,
      httpOnly: true, // No accesible por JS
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: false, message: 'Invalid code' }, { status: 401 })
}
