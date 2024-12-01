import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/auth-context';
import { getSellers } from '@/app/admin/sellers/actions';

export const GET = withAdmin(async (request) => {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  try {
    const data = await getSellers({ status, search, page });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch sellers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sellers' },
      { status: 500 }
    );
  }
});
