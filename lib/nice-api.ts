/**
 * NICE API 클라이언트
 *
 * 실제 환경에서는 NICE 결제 API와 통신합니다.
 * POC에서는 시뮬레이션 모드로 동작합니다.
 */

import {
  CardPaymentRequest,
  QRPaymentRequest,
  CashReceiptRequest,
  PaymentResponse,
  PaymentCancelRequest,
  PaymentHistoryFilter,
  PaymentHistoryResponse,
  PaymentMethod,
  PaymentStatus,
} from '@/types/payment';

// 환경 변수로 모드 설정 (실제 환경에서는 .env 파일 사용)
const IS_SIMULATION = process.env.NICE_SIMULATION_MODE !== 'false';

// 테스트용 거래 내역 저장소 (실제로는 데이터베이스 사용)
const mockTransactions: Map<string, any> = new Map();

/**
 * 거래 ID 생성
 */
function generateTransactionId(): string {
  return `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 승인 번호 생성
 */
function generateApprovalNumber(): string {
  return Math.random().toString().substr(2, 8);
}

/**
 * 카드 결제 처리
 */
export async function processCardPayment(
  request: CardPaymentRequest
): Promise<PaymentResponse> {
  if (IS_SIMULATION) {
    // 시뮬레이션 모드
    await new Promise((resolve) => setTimeout(resolve, 1500)); // API 호출 시뮬레이션

    const transactionId = generateTransactionId();
    const approvalNumber = generateApprovalNumber();
    const now = new Date().toISOString();

    // 카드 번호 검증 (시뮬레이션)
    if (request.cardNumber.length < 15) {
      return {
        success: false,
        transactionId,
        amount: request.amount,
        method: PaymentMethod.CARD,
        status: PaymentStatus.FAILED,
        message: '유효하지 않은 카드 번호입니다.',
      };
    }

    const transaction = {
      transactionId,
      approvalNumber,
      amount: request.amount,
      method: PaymentMethod.CARD,
      status: PaymentStatus.APPROVED,
      orderName: request.orderName,
      customerName: request.customerName,
      createdAt: now,
    };

    mockTransactions.set(transactionId, transaction);

    return {
      success: true,
      transactionId,
      approvalNumber,
      approvedAt: now,
      amount: request.amount,
      method: PaymentMethod.CARD,
      status: PaymentStatus.APPROVED,
      message: '결제가 승인되었습니다.',
      receiptUrl: `/receipt/${transactionId}`,
    };
  }

  // 실제 NICE API 호출 (구현 필요)
  throw new Error('실제 NICE API 연동이 필요합니다.');
}

/**
 * QR 결제 처리
 */
export async function processQRPayment(
  request: QRPaymentRequest
): Promise<PaymentResponse> {
  if (IS_SIMULATION) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const transactionId = generateTransactionId();
    const approvalNumber = generateApprovalNumber();
    const now = new Date().toISOString();

    const transaction = {
      transactionId,
      approvalNumber,
      amount: request.amount,
      method: PaymentMethod.QR,
      status: PaymentStatus.APPROVED,
      orderName: request.orderName,
      qrType: request.qrType,
      createdAt: now,
    };

    mockTransactions.set(transactionId, transaction);

    return {
      success: true,
      transactionId,
      approvalNumber,
      approvedAt: now,
      amount: request.amount,
      method: PaymentMethod.QR,
      status: PaymentStatus.APPROVED,
      message: `${request.qrType} 결제가 승인되었습니다.`,
      receiptUrl: `/receipt/${transactionId}`,
    };
  }

  throw new Error('실제 NICE API 연동이 필요합니다.');
}

/**
 * 현금영수증 발행
 */
export async function issueCashReceipt(
  request: CashReceiptRequest
): Promise<PaymentResponse> {
  if (IS_SIMULATION) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const transactionId = generateTransactionId();
    const approvalNumber = generateApprovalNumber();
    const now = new Date().toISOString();

    const transaction = {
      transactionId,
      approvalNumber,
      amount: request.amount,
      method: PaymentMethod.CASH_RECEIPT,
      status: PaymentStatus.APPROVED,
      orderName: request.orderName,
      receiptType: request.receiptType,
      createdAt: now,
    };

    mockTransactions.set(transactionId, transaction);

    return {
      success: true,
      transactionId,
      approvalNumber,
      approvedAt: now,
      amount: request.amount,
      method: PaymentMethod.CASH_RECEIPT,
      status: PaymentStatus.APPROVED,
      message: '현금영수증이 발행되었습니다.',
      receiptUrl: `/receipt/${transactionId}`,
    };
  }

  throw new Error('실제 NICE API 연동이 필요합니다.');
}

/**
 * 결제 취소
 */
export async function cancelPayment(
  request: PaymentCancelRequest
): Promise<PaymentResponse> {
  if (IS_SIMULATION) {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const transaction = mockTransactions.get(request.transactionId);

    if (!transaction) {
      return {
        success: false,
        transactionId: request.transactionId,
        amount: 0,
        method: PaymentMethod.CARD,
        status: PaymentStatus.FAILED,
        message: '거래를 찾을 수 없습니다.',
      };
    }

    if (transaction.status === PaymentStatus.CANCELLED) {
      return {
        success: false,
        transactionId: request.transactionId,
        amount: transaction.amount,
        method: transaction.method,
        status: PaymentStatus.CANCELLED,
        message: '이미 취소된 거래입니다.',
      };
    }

    transaction.status = PaymentStatus.CANCELLED;
    transaction.cancelledAt = new Date().toISOString();
    transaction.cancelReason = request.cancelReason;

    return {
      success: true,
      transactionId: request.transactionId,
      amount: transaction.amount,
      method: transaction.method,
      status: PaymentStatus.CANCELLED,
      message: '결제가 취소되었습니다.',
    };
  }

  throw new Error('실제 NICE API 연동이 필요합니다.');
}

/**
 * 결제 내역 조회
 */
export async function getPaymentHistory(
  filter: PaymentHistoryFilter
): Promise<PaymentHistoryResponse> {
  if (IS_SIMULATION) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const items = Array.from(mockTransactions.values());

    // 필터링
    let filteredItems = items;

    if (filter.method) {
      filteredItems = filteredItems.filter((item) => item.method === filter.method);
    }

    if (filter.status) {
      filteredItems = filteredItems.filter((item) => item.status === filter.status);
    }

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return {
      success: true,
      items: paginatedItems.map((item) => ({
        transactionId: item.transactionId,
        approvalNumber: item.approvalNumber,
        amount: item.amount,
        method: item.method,
        status: item.status,
        orderName: item.orderName,
        customerName: item.customerName,
        createdAt: item.createdAt,
        cancelledAt: item.cancelledAt,
      })),
      total: filteredItems.length,
      page,
      limit,
    };
  }

  throw new Error('실제 NICE API 연동이 필요합니다.');
}
