'use client';

import { useState } from 'react';
import { formatAmount } from '@/lib/utils';
import { PaymentResponse } from '@/types/payment';

export default function PaymentCard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymentResponse | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    installment: '0',
    orderName: '',
    customerName: '',
  });

  const defaultForm = {
    amount: '10000',
    cardNumber: '1234-5678-9012-3456',
    expiryMonth: '12',
    expiryYear: '25',
    installment: '0',
    orderName: '커피 2잔',
    customerName: '홍길동',
  };

  // Prefill with defaults for easier testing / placeholder experience
  // but keep controlled inputs so users can edit before submitting
  if (formData.amount === '' && formData.cardNumber === '') {
    // initialize once
    // use a microtask to avoid changing state during render in strict mode
    setTimeout(() => setFormData(defaultForm), 0);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/payment/card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseInt(formData.amount),
          installment: parseInt(formData.installment),
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        // 성공 시 기본값으로 되돌려 반복 테스트에 편리하게 함
        setFormData(defaultForm);
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

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className="text-2xl mr-2">💳</span>
        카드 결제
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
          <label className="label">카드 번호</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            className="input"
            placeholder="1234-5678-9012-3456"
            required
            maxLength={19}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">유효기간 (월)</label>
            <input
              type="text"
              name="expiryMonth"
              value={formData.expiryMonth}
              onChange={handleChange}
              className="input"
              placeholder="12"
              required
              maxLength={2}
            />
          </div>
          <div>
            <label className="label">유효기간 (년)</label>
            <input
              type="text"
              name="expiryYear"
              value={formData.expiryYear}
              onChange={handleChange}
              className="input"
              placeholder="25"
              required
              maxLength={2}
            />
          </div>
        </div>

        <div>
          <label className="label">할부 개월</label>
          <select
            name="installment"
            value={formData.installment}
            onChange={handleChange}
            className="input"
          >
            <option value="0">일시불</option>
            <option value="2">2개월</option>
            <option value="3">3개월</option>
            <option value="6">6개월</option>
            <option value="12">12개월</option>
          </select>
        </div>

        <div>
          <label className="label">고객명 (선택)</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="input"
            placeholder="홍길동"
          />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? '처리중...' : '결제하기'}
        </button>
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
