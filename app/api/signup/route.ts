// app/api/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Account already exists' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: { email, password }, 
    });

    console.log('User created:', user);

    return NextResponse.json(
      {
        success: true,
        user: { id: user.id, email: user.email },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json(
      { error: 'uhhhh' },
      { status: 500 }
    );
  }
}
