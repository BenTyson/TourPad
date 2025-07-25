import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { artist: true }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (user.artist) {
      return NextResponse.json({ error: 'Artist profile already exists' }, { status: 400 });
    }
    
    // Create artist profile
    const artist = await prisma.artist.create({
      data: {
        userId: user.id,
        genres: ['Folk', 'Singer-Songwriter'],
        tourMonthsPerYear: 6,
      }
    });
    
    return NextResponse.json({
      success: true,
      artist: {
        id: artist.id,
        userId: artist.userId
      }
    });
  } catch (error) {
    console.error('Error creating artist profile:', error);
    return NextResponse.json({ error: 'Failed to create artist profile' }, { status: 500 });
  }
}