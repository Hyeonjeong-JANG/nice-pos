'use client';

import { useState } from 'react';
import { formatAmount } from '@/lib/utils';
import { PaymentResponse, QRPaymentType } from '@/types/payment';

export default function PaymentQR() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymentResponse | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    qrType: QRPaymentType.KAKAO_PAY,
    orderName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/payment/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseInt(formData.amount),
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        setFormData({
          amount: '',
          qrType: QRPaymentType.KAKAO_PAY,
          orderName: '',
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const qrTypeLabels: Record<QRPaymentType, string> = {
    [QRPaymentType.ZERO_PAY]: '제로페이',
    [QRPaymentType.KAKAO_PAY]: '카카오페이',
    [QRPaymentType.NAVER_PAY]: '네이버페이',
    [QRPaymentType.SAMSUNG_PAY]: '삼성페이',
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className="text-2xl mr-2">📱</span>
        QR 결제
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">결제 금액 (원)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="input"
            placeholder="10000"
            required
            min="100"
          />
        </div>

        <div>
          <label className="label">주문명</label>
          <input
            type="text"
            name="orderName"
            value={formData.orderName}
            onChange={handleChange}
            className="input"
            placeholder="커피 2잔"
            required
          />
        </div>

        <div>
          <label className="label">QR 결제 타입</label>
          <select name="qrType" value={formData.qrType} onChange={handleChange} className="input">
            {Object.entries(qrTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-success w-full" disabled={loading}>
          {loading ? '처리중...' : 'QR 결제하기'}
        </button>

        {loading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-success"></div>
            <p className="text-sm text-gray-600 mt-2">QR 코드 스캔을 기다리는 중...</p>
          </div>
        )}
      </form>

      {result && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <h3 className={`font-bold mb-2 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
            {result.success ? '✓ 결제 성공' : '✗ 결제 실패'}
          </h3>
          <div className="text-sm space-y-1">
            <p>
              <strong>메시지:</strong> {result.message}
            </p>
            {result.success && (
              <>
                <p>
                  <strong>거래번호:</strong> {result.transactionId}
                </p>
                <p>
                  <strong>승인번호:</strong> {result.approvalNumber}
                </p>
                <p>
                  <strong>결제금액:</strong> {formatAmount(result.amount)}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
