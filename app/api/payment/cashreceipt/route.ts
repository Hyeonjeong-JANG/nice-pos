/**
 * 현금영수증 API
 *
 * POST /api/payment/cashreceipt - 현금영수증 발행
 */

import { NextRequest, NextResponse } from 'next/server';
import { issueCashReceipt } from '@/lib/nice-api';
import { CashReceiptRequest } from '@/types/payment';

/**
 * 현금영수증 발행
 */
export async function POST(request: NextRequest) {
  try {
    const body: CashReceiptRequest = await request.json();

    // 입력 검증
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_AMOUNT', message: '유효하지 않은 금액입니다.' } },
        { status: 400 }
      );
    }

    if (!body.receiptType) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_TYPE', message: '영수증 타입이 필요합니다.' } },
        { status: 400 }
      );
    }

    if (!body.phoneNumber && !body.registrationNumber) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_IDENTIFIER',
            message: '휴대폰 번호 또는 사업자/주민번호가 필요합니다.',
          },
        },
        { status: 400 }
      );
    }

    if (!body.orderName) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_ORDER', message: '주문명이 필요합니다.' } },
        { status: 400 }
      );
    }

    // 현금영수증 발행
    const result = await issueCashReceipt(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Cash receipt error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '현금영수증 발행 중 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
