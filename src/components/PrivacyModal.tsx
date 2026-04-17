"use client";

import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="modal-container privacy-modal"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="modal-header">
              <h2 className="modal-title">개인정보처리방침</h2>
              <button className="btn-close-modal" onClick={onClose}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-content privacy-content">
              <div className="policy-section">
                <h3>총 칙</h3>
                <p>
                  (주)태평프레시 (이하&apos;회사&apos; 또는 &apos;(주)태평프레시&apos;라 함)는 고객님의 개인정보보호를 매우 중요시하며, 정보통신망 이용촉진 및 정보보호 등에 관한 법, 통신비밀보호법 등에서 요구하는 사항을 준수합니다. (주)태평프레시는 정보통신망 이용촉진 및 정보보호 등에 관한 법률에 따라 개인정보취급방침을 홈페이지를 통해 공개하는 등 고객님의 개인정보보호에 최선의 노력을 다하고 있습니다. (주)태평프레시의 개인정보취급방침은 다음과 같은 내용을 담고 있습니다.
                </p>
                <ul className="policy-index">
                  <li>1. 이용자의 개인 정보 보호</li>
                  <li>2. 수집하는 개인정보 항목 및 수집 방법</li>
                  <li>3. 개인정보의 제3자 제공 및 공유</li>
                  <li>4. 개인정보의 공유 및 제공</li>
                  <li>5. 개인정보의 보유 및 이용 기간</li>
                  <li>6. 개인정보 파기 절차 및 방법</li>
                  <li>7. 이용자 및 법정대리인의 권리와 행사 방법</li>
                  <li>8. 개인정보 자동 수집 장치의 설치 / 운영 및 거부에 관한 사항</li>
                  <li>9. 개인정보 보호를 위한 기술적, 관리적 보호 장치</li>
                  <li>10. 개인정보에 대한 관리책임자</li>
                  <li>11. 이용자의 권리와 의무</li>
                  <li>12. 고지의 의무</li>
                </ul>
              </div>

              <div className="policy-section">
                <h3>1. 이용자의 개인정보 보호</h3>
                <p>&quot;개인정보&quot;란 살아 있는 개인에 관한 정보로서 성명, 전화번호 등 및 영상 등을 통하여 개인을 알아볼 수 있는 정보(해당 정보만으로는 특정 개인을 알아볼 수 없더라도 다른 정보와 쉽게 결합하여 알아볼 수 있는 것을 포함한다)를 말합니다. (주)태평프레시는 관련 법률, 정부의 지침을 준수하여 고객님께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.</p>
              </div>

              <div className="policy-section">
                <h3>2. 수집하는 개인정보 항목 및 수집 방법</h3>
                <p><strong>(1) 개인정보 수집 항목</strong></p>
                <p>1. (주)태평프레시는 회원가입, 원활한 고객상담, 본인 확인, 고지사항 전달 및 확인, 본인의사 확인 등 의사소통을 위한 절차에의 이용, (주)태평프레시 또는 (주)태평프레시 제휴사의 서비스(상품) 및 이벤트 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
                <ul>
                  <li>필수수집항목 : 성명, 실명인증값, 생년월일, 성별, 아이디, 비밀번호, 주소, 전화번호, 휴대전화번호, 이메일</li>
                  <li>선택수집항목 : 직업, 결혼여부, 결혼기념일</li>
                </ul>
                <p>2. 서비스 이용 과정에서 IP Address, 쿠키, 서비스 이용기록, 접속 로그, 방문 일시 등이 자동으로 생성되어 수집될 수 있습니다.</p>
                <p><strong>(2) 개인정보 수집 방법</strong></p>
                <p>(주)태평프레시는 홈페이지, 회원정보 수정 등을 통해 개인정보를 수집합니다.</p>
              </div>

              <div className="policy-section">
                <h3>3. 개인정보의 수집 목적 및 활용</h3>
                <p>(주)태평프레시는 수집한 개인정보를 회원관리, 서비스 제공에 관한 계약이행 및 요금 정산, 마케팅 및 광고에 활용합니다.</p>
              </div>

              <div className="policy-section">
                <h3>4. 개인정보의 공유 및 제공</h3>
                <p>회사는 원칙적으로 이용자의 개인정보를 대외에 공개하지 않습니다. 다만, 이용자가 사전에 동의한 경우나 법령의 규정에 의거한 경우에는 예외로 합니다.</p>
              </div>

              <div className="policy-section">
                <h3>5. 개인정보의 보유 및 이용 기간</h3>
                <p>이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용 목적이 달성되면 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우(계약 철회 등 기록 5년, 대금결제 기록 5년 등)에는 해당 기간 동안 보관합니다.</p>
              </div>

              <div className="policy-section">
                <h3>6. 개인정보 파기 절차 및 방법</h3>
                <p>(주)태평프레시는 목적 달성 후 해당 정보를 지체 없이 파기하며, 종이에 출력된 개인정보는 분쇄하거나 소각하고, 전자적 파일은 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.</p>
              </div>

              <div className="policy-section">
                <h3>7. 이용자 및 법정대리인의 권리와 행사 방법</h3>
                <p>이용자 및 법정 대리인은 언제든지 등록되어 있는 자신 혹은 법률에 의한 대리인의 개인정보를 조회하거나 수정할 수 있으며 가입 해지를 요청할 수도 있습니다.</p>
              </div>

              <div className="policy-section">
                <h3>8. 개인정보 자동 수집 장치의 설치/운영 및 거부</h3>
                <p>회사는 이용자들에게 특화된 맞춤 서비스를 제공하기 위해서 쿠키(cookie)를 사용합니다. 이용자는 웹 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.</p>
              </div>

              <div className="policy-section">
                <h3>9. 개인정보 보호를 위한 기술적, 관리적 보호 장치</h3>
                <p>(주)태평프레시는 개인정보의 안전성 확보를 위해 비밀번호 암호화, 해킹 대비 대책, 취급 직원 최소화 및 교육 등 관리적 대책을 강구하고 있습니다.</p>
              </div>

              <div className="policy-section">
                <h3>10. 개인정보에 대한 관리책임자</h3>
                <p>(주)태평프레시는 고객의 개인정보 관련 민원을 처리하기 위해 관련 조직을 운영하고 있습니다. 궁금하신 사항은 고객센터(02-6954-7988)로 문의해 주시기 바랍니다.</p>
              </div>

              <div className="policy-section">
                <h3>11. 이용자의 권리와 의무</h3>
                <p>고객님은 자신의 개인정보를 최신의 상태로 정확하게 입력할 의무가 있으며, 타인의 정보를 도용할 경우 관련 법령에 의해 처벌받을 수 있습니다.</p>
              </div>

              <div className="policy-section">
                <h3>12. 고지의 의무</h3>
                <p>현 개인정보 처리방침의 내용 추가, 삭제 및 수정이 있을 시에는 개정 최소 7일전부터 홈페이지를 통해 고지할 것입니다.</p>
                <div className="policy-dates">
                  <p>공고일자 : 2026년 1월 01일</p>
                  <p>시행일자 : 2026년 1월 01일</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-modal-close-bottom" onClick={onClose}>닫기</button>
            </div>
          </motion.div>
        </>
      )}
      <style jsx>{`
        .privacy-modal {
          max-width: 800px;
          height: 80vh;
          display: flex;
          flex-direction: column;
        }
        .privacy-content {
          overflow-y: auto;
          padding: 30px;
          color: #334155;
          line-height: 1.7;
          font-size: 14px;
        }
        .policy-section {
          margin-bottom: 25px;
        }
        .policy-section h3 {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 12px;
          border-left: 4px solid #3b82f6;
          padding-left: 12px;
        }
        .policy-index {
          background: #f8fafc;
          padding: 20px 40px;
          border-radius: 8px;
          margin: 15px 0;
          font-size: 13px;
        }
        .policy-dates {
          margin-top: 20px;
          padding: 15px;
          background: #f1f5f9;
          border-radius: 6px;
          font-weight: 600;
        }
        .policy-dates p {
          margin: 0;
        }
        .btn-modal-close-bottom {
          width: 100%;
          padding: 12px;
          background: #f1f5f9;
          border: none;
          border-radius: 6px;
          color: #475569;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-modal-close-bottom:hover {
          background: #e2e8f0;
        }
      `}</style>
    </AnimatePresence>
  );
}
