import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { mobileNumber, password, deviceId } = await req.json();

    if (!mobileNumber || !password || !deviceId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { mobileNumber },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid mobile number or password' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid mobile number or password' }, { status: 401 });
    }

    // Strict Device Locking Logic
    if (user.currentDeviceId && user.currentDeviceId !== deviceId) {
      return NextResponse.json({ 
        error: 'Device limit reached.', 
        message: 'You are already logged in on another device. Please contact admin at +916353287918 to unlock your account.' 
      }, { status: 403 });
    }

    // Success: Generate new session
    const sessionToken = crypto.randomUUID();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        currentDeviceId: deviceId,
        sessionToken: sessionToken,
      },
    });

    // Set cookie
    (await cookies()).set({
      name: 'session_token',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, mobileNumber: user.mobileNumber, role: user.role } 
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
