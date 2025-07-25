import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get all pending applications (users with PENDING status)
    const applications = await prisma.user.findMany({
      where: {
        status: 'PENDING'
      },
      include: {
        profile: true,
        host: {
          include: {
            media: {
              orderBy: { sortOrder: 'asc' }
            }
          }
        },
        artist: {
          include: {
            media: {
              orderBy: { sortOrder: 'asc' }
            },
            bandMembers: {
              orderBy: { sortOrder: 'asc' }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}