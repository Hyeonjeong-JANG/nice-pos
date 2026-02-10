import PaymentCard from '@/components/PaymentCard';
import PaymentQR from '@/components/PaymentQR';
import CashReceipt from '@/components/CashReceipt';
import PaymentHistory from '@/components/PaymentHistory';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* 소개 */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-2xl font-bold mb-2">NICE POS 결제 시스템 POC</h2>
        <p className="text-gray-700 mb-4">
          웹과 앱을 모두 지원하는 통합 결제 시스템입니다.
          <br />
          카드 결제, QR 결제, 현금영수증 발행 기능을 제공합니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded-lg">
            <div className="text-2xl mb-1">💳</div>
            <div className="font-semibold">카드 결제</div>
            <div className="text-gray-600">신용/체크카드 결제 및 취소</div>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <div className="text-2xl mb-1">📱</div>
            <div className="font-semibold">QR 결제</div>
            <div className="text-gray-600">제로페이, 카카오페이 등</div>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <div className="text-2xl mb-1">🧾</div>
            <div className="font-semibold">현금영수증</div>
            <div className="text-gray-600">소득공제 및 지출증빙</div>
          </div>
        </div>
      </div>

      {/* 결제 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentCard />
        <PaymentQR />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CashReceipt />
        <div className="card bg-blue-50">
          <h3 className="font-bold mb-2">💡 테스트 가이드</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• 카드번호: 15자리 이상 입력 시 승인</li>
            <li>• 모든 결제는 시뮬레이션 모드입니다</li>
            <li>• 결제 후 아래 결제 내역에서 확인 가능</li>
            <li>• 승인된 결제는 취소 가능합니다</li>
          </ul>
        </div>
      </div>

      {/* 결제 내역 */}
      <PaymentHistory />
    </div>
  );
}
