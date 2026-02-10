/**
 * NICE POS 결제 관련 타입 정의
 */

// 결제 방법
export enum PaymentMethod {
  CARD = 'CARD',           // 신용/체크카드
  QR = 'QR',               // QR 결제
  CASH_RECEIPT = 'CASH',   // 현금영수증
}

// 결제 상태
export enum PaymentStatus {
  PENDING = 'PENDING',     // 대기중
  APPROVED = 'APPROVED',   // 승인완료
  CANCELLED = 'CANCELLED', // 취소됨
  FAILED = 'FAILED',       // 실패
}

// QR 결제 타입
export enum QRPaymentType {
  ZERO_PAY = 'ZERO_PAY',       // 제로페이
  KAKAO_PAY = 'KAKAO_PAY',     // 카카오페이
  NAVER_PAY = 'NAVER_PAY',     // 네이버페이
  SAMSUNG_PAY = 'SAMSUNG_PAY', // 삼성페이
}

// 카드 결제 요청
export interface CardPaymentRequest {
  amount: number;                // 결제 금액
  cardNumber: string;            // 카드 번호
  expiryMonth: string;           // 유효기간 월 (MM)
  expiryYear: string;            // 유효기간 년 (YY)
  installment: number;           // 할부 개월 (0: 일시불)
  orderName: string;             // 주문명
  customerName?: string;         // 고객명
  customerPhone?: string;        // 고객 전화번호
}

// QR 결제 요청
export interface QRPaymentRequest {
  amount: number;                // 결제 금액
  qrType: QRPaymentType;         // QR 결제 타입
  orderName: string;             // 주문명
  customerPhone?: string;        // 고객 전화번호
}

// 현금영수증 발행 요청
export interface CashReceiptRequest {
  amount: number;                // 금액
  phoneNumber?: string;          // 휴대폰 번호
  registrationNumber?: string;   // 사업자/주민번호
  receiptType: 'PERSONAL' | 'BUSINESS'; // 개인/사업자
  orderName: string;             // 주문명
}

// 결제 응답
export interface PaymentResponse {
  success: boolean;              // 성공 여부
  transactionId: string;         // 거래 고유 번호
  approvalNumber?: string;       // 승인 번호
  approvedAt?: string;           // 승인 시각
  amount: number;                // 결제 금액
  method: PaymentMethod;         // 결제 방법
  status: PaymentStatus;         // 결제 상태
  message: string;               // 응답 메시지
  receiptUrl?: string;           // 영수증 URL
}

// 결제 취소 요청
export interface PaymentCancelRequest {
  transactionId: string;         // 거래 고유 번호
  cancelAmount?: number;         // 취소 금액 (부분취소)
  cancelReason: string;          // 취소 사유
}

// 결제 내역 조회 필터
export interface PaymentHistoryFilter {
  startDate?: string;            // 시작일 (YYYY-MM-DD)
  endDate?: string;              // 종료일 (YYYY-MM-DD)
  method?: PaymentMethod;        // 결제 방법
  status?: PaymentStatus;        // 결제 상태
  page?: number;                 // 페이지 번호
  limit?: number;                // 페이지당 항목 수
}

// 결제 내역 항목
export interface PaymentHistoryItem {
  transactionId: string;         // 거래 고유 번호
  approvalNumber: string;        // 승인 번호
  amount: number;                // 금액
  method: PaymentMethod;         // 결제 방법
  status: PaymentStatus;         // 상태
  orderName: string;             // 주문명
  customerName?: string;         // 고객명
  createdAt: string;             // 생성 시각
  cancelledAt?: string;          // 취소 시각
}

// 결제 내역 응답
export interface PaymentHistoryResponse {
  success: boolean;
  items: PaymentHistoryItem[];
  total: number;                 // 전체 항목 수
  page: number;                  // 현재 페이지
  limit: number;                 // 페이지당 항목 수
}

// API 에러 응답
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
