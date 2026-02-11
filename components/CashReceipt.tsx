'use client';

import { useState } from 'react';
import { formatAmount } from '@/lib/utils';
import { PaymentResponse } from '@/types/payment';

const defaultForm = {
  amount: '10000',
  receiptType: 'PERSONAL' as 'PERSONAL' | 'BUSINESS',
  phoneNumber: '010-1234-5678',
  registrationNumber: '123-45-67890',
  orderName: '커피 2잔',
};

export default function CashReceipt() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymentResponse | null>(null);
  const [formData, setFormData] = useState(defaultForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/payment/cashreceipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(formData.amount),
          receiptType: formData.receiptType,
          phoneNumber: formData.phoneNumber || undefined,
          registrationNumber: formData.registrationNumber || undefined,
          orderName: formData.orderName,
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        setFormData(defaultForm);
      }
    } catch (error) {
      console.error('Cash receipt error:', error);
      alert('현금영수증 발행 중 오류가 발생했습니다.');
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
        <span className="text-2xl mr-2">🧾</span>
        현금영수증
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
          <label className="label">영수증 타입</label>
          <select
            name="receiptType"
            value={formData.receiptType}
            onChange={handleChange}
            className="input"
          >
            <option value="PERSONAL">개인 소득공제</option>
            <option value="BUSINESS">사업자 지출증빙</option>
          </select>
        </div>

        {formData.receiptType === 'PERSONAL' ? (
          <div>
            <label className="label">휴대폰 번호</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="input"
              placeholder="010-1234-5678"
              required
            />
          </div>
        ) : (
          <div>
            <label className="label">사업자등록번호 / 주민등록번호</label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              className="input"
              placeholder="123-45-67890"
              required
            />
          </div>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? '발행중...' : '현금영수증 발행'}
        </button>
      </form>

      {result && (
        <div
          className={`mt-4 p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
        >
          <h3 className={`font-bold mb-2 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
            {result.success ? '✓ 발행 성공' : '✗ 발행 실패'}
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
                  <strong>금액:</strong> {formatAmount(result.amount)}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
