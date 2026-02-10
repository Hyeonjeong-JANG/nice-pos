/**
 * QR 결제 API
 *
 * POST /api/payment/qr - QR 결제 승인
 */

import { NextRequest, NextResponse } from 'next/server';
import { processQRPayment } from '@/lib/nice-api';
import { QRPaymentRequest } from '@/types/payment';

/**
 * QR 결제 승인
 */
export async function POST(request: NextRequest) {
  try {
    const body: QRPaymentRequest = await request.json();

    // 입력 검증
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_AMOUNT', message: '유효하지 않은 금액입니다.' } },
        { status: 400 }
      );
    }

    if (!body.qrType) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_QR_TYPE', message: 'QR 결제 타입이 필요합니다.' } },
        { status: 400 }
      );
    }

    if (!body.orderName) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_ORDER', message: '주문명이 필요합니다.' } },
        { status: 400 }
      );
    }

    // 결제 처리
    const result = await processQRPayment(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('QR payment error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '결제 처리 중 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
