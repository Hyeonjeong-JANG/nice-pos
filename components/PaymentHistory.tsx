'use client';

import { useState, useEffect } from 'react';
import { formatAmount, formatDate } from '@/lib/utils';
import { PaymentHistoryItem, PaymentStatus, PaymentMethod } from '@/types/payment';

export default function PaymentHistory() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<PaymentHistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/payment/history?page=${page}&limit=10`);
      const data = await response.json();

      if (data.success) {
        setItems(data.items);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Load history error:', error);
      alert('결제 내역 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [page]);

  const handleCancel = async (transactionId: string) => {
    if (!confirm('정말 취소하시겠습니까?')) return;

    const cancelReason = prompt('취소 사유를 입력하세요:');
    if (!cancelReason) return;

    try {
      const response = await fetch('/api/payment/card', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, cancelReason }),
      });

      const data = await response.json();

      if (data.success) {
        alert('결제가 취소되었습니다.');
        loadHistory();
      } else {
        alert(data.message || '취소 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('취소 처리 중 오류가 발생했습니다.');
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    const colors = {
      [PaymentStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [PaymentStatus.APPROVED]: 'bg-green-100 text-green-800',
      [PaymentStatus.CANCELLED]: 'bg-red-100 text-red-800',
      [PaymentStatus.FAILED]: 'bg-gray-100 text-gray-800',
    };

    const labels = {
      [PaymentStatus.PENDING]: '대기중',
      [PaymentStatus.APPROVED]: '승인완료',
      [PaymentStatus.CANCELLED]: '취소됨',
      [PaymentStatus.FAILED]: '실패',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getMethodBadge = (method: PaymentMethod) => {
    const icons = {
      [PaymentMethod.CARD]: '💳',
      [PaymentMethod.QR]: '📱',
      [PaymentMethod.CASH_RECEIPT]: '🧾',
    };

    const labels = {
      [PaymentMethod.CARD]: '카드',
      [PaymentMethod.QR]: 'QR',
      [PaymentMethod.CASH_RECEIPT]: '현금영수증',
    };

    return (
      <span className="flex items-center gap-1">
        <span>{icons[method]}</span>
        <span className="text-sm">{labels[method]}</span>
      </span>
    );
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <span className="text-2xl mr-2">📋</span>
          결제 내역
        </h2>
        <button onClick={loadHistory} className="btn-secondary" disabled={loading}>
          {loading ? '조회중...' : '새로고침'}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">결제 내역이 없습니다.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    거래번호
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    주문명
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    결제방법
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    금액
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    상태
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    일시
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.transactionId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">
                      {item.transactionId.substring(0, 12)}...
                    </td>
                    <td className="px-4 py-3 text-sm">{item.orderName}</td>
                    <td className="px-4 py-3 text-sm">{getMethodBadge(item.method)}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold">
                      {formatAmount(item.amount)}
                    </td>
                    <td className="px-4 py-3 text-center">{getStatusBadge(item.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.status === PaymentStatus.APPROVED && (
                        <button
                          onClick={() => handleCancel(item.transactionId)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          취소
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">총 {total}건</div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>
              <span className="px-4 py-2 text-sm font-medium">페이지 {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={items.length < 10}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
