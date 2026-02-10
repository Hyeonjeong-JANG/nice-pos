/**
 * 카드 결제 API
 *
 * POST /api/payment/card - 카드 결제 승인
 * DELETE /api/payment/card - 카드 결제 취소
 */

import { NextRequest, NextResponse } from 'next/server';
import { processCardPayment, cancelPayment } from '@/lib/nice-api';
import { CardPaymentRequest, PaymentCancelRequest } from '@/types/payment';

/**
 * 카드 결제 승인
 */
export async function POST(request: NextRequest) {
  try {
    const body: CardPaymentRequest = await request.json();

    // 입력 검증
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_AMOUNT', message: '유효하지 않은 금액입니다.' } },
        { status: 400 }
      );
    }

    if (!body.cardNumber || !body.expiryMonth || !body.expiryYear) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CARD', message: '카드 정보가 올바르지 않습니다.' } },
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
    const result = await processCardPayment(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Card payment error:', error);
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

/**
 * 카드 결제 취소
 */
export async function DELETE(request: NextRequest) {
  try {
    const body: PaymentCancelRequest = await request.json();

    if (!body.transactionId) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_TRANSACTION', message: '거래 ID가 필요합니다.' } },
        { status: 400 }
      );
    }

    if (!body.cancelReason) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_REASON', message: '취소 사유가 필요합니다.' } },
        { status: 400 }
      );
    }

    const result = await cancelPayment(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Card payment cancel error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '취소 처리 중 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
