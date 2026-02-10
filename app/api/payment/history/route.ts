/**
 * 결제 내역 조회 API
 *
 * GET /api/payment/history - 결제 내역 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPaymentHistory } from '@/lib/nice-api';
import { PaymentHistoryFilter } from '@/types/payment';

/**
 * 결제 내역 조회
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filter: PaymentHistoryFilter = {
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      method: (searchParams.get('method') as any) || undefined,
      status: (searchParams.get('status') as any) || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    };

    const result = await getPaymentHistory(filter);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Payment history error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '결제 내역 조회 중 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
