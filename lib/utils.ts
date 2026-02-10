/**
 * 유틸리티 함수
 */

/**
 * 금액 포맷팅 (원화)
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

/**
 * 카드 번호 마스킹
 */
export function maskCardNumber(cardNumber: string): string {
  if (cardNumber.length < 12) return cardNumber;

  const first = cardNumber.substring(0, 4);
  const last = cardNumber.substring(cardNumber.length - 4);
  const masked = '*'.repeat(cardNumber.length - 8);

  return `${first}${masked}${last}`;
}

/**
 * 날짜 포맷팅
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

/**
 * 전화번호 포맷팅
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  return phone;
}

/**
 * 할부 개월 표시
 */
export function formatInstallment(installment: number): string {
  if (installment === 0) return '일시불';
  return `${installment}개월`;
}

/**
 * classNames 헬퍼 (Tailwind CSS)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
