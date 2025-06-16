import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/client';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await writeClient.fetch(
      `*[_type == "careerEmail" && email == $email][0]`,
      { email }
    );

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 409 }
      );
    }

    // Create new career email subscription
    const result = await writeClient.create({
      _type: 'careerEmail',
      email: email,
      subscribedAt: new Date().toISOString(),
      status: 'active',
    });

    return NextResponse.json(
      { message: 'Email subscribed successfully', id: result._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error subscribing email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 