"use client";

import React, { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';

export default function InquiryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [agree, setAgree] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    emailPrefix: '',
    emailDomain: '',
    phone1: '010',
    phone2: '',
    phone3: '',
    address: '',
    details: '',
    captchaInput: ''
  });
  const [captcha, setCaptcha] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateCaptcha();
      setAgree(false);
      setFormData({
        name: '', emailPrefix: '', emailDomain: '', phone1: '010', phone2: '', phone3: '', address: '', details: '', captchaInput: ''
      });
      // Load Daum Postcode script dynamically
      if (!document.getElementById('daum-postcode-script')) {
        const script = document.createElement('script');
        script.id = 'daum-postcode-script';
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [isOpen]);

  const generateCaptcha = () => {
    const chars = '0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  const handlePostcode = () => {
    if (!(window as any).daum || !(window as any).daum.Postcode) {
      alert("주소 검색 시스템을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    new (window as any).daum.Postcode({
      oncomplete: function(data: any) {
        setFormData(prev => ({ ...prev, address: data.address }));
      }
    }).open();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return alert("개인정보수집 및 이용 약관에 동의해주세요.");
    if (!formData.name) return alert("이름을 입력해주세요.");
    if (formData.captchaInput !== captcha) return alert("자동등록방지 숫자가 일치하지 않습니다.");
    
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: `${formData.emailPrefix}@${formData.emailDomain}`,
        phone: `${formData.phone1}-${formData.phone2}-${formData.phone3}`,
        address: formData.address,
        details: formData.details
      };
      
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert("성공적으로 접수되었습니다. 담당자가 확인 후 빠른 시일 내에 연락드리겠습니다.");
        onClose();
      } else {
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch (err) {
      alert("알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="inquiry-overlay" onClick={onClose}>
      <div className="inquiry-box" onClick={e => e.stopPropagation()}>
        <button className="inquiry-close" onClick={onClose}><X size={26} /></button>
        <h2 className="inquiry-header-title">온라인 문의</h2>
        
        <form onSubmit={handleSubmit} className="inquiry-form-body">
          {/* STEP 01 */}
          <div className="iq-step">
            <div className="iq-step-left">
              <strong>STEP01</strong>
              <p>개인정보수집<br/>약관동의</p>
            </div>
            <div className="iq-step-right">
              <div className="iq-terms">
                <strong>(주)태평프레시 개인정보처리방침</strong>
                <p>(주)태평프레시(이하 &apos;회사&apos;라 함)는 고객님의 개인정보를 중요시하며, 정보통신망 이용촉진 및 정보보호에 관한 법률을 준수하고 있습니다.</p>
                <p>회사는 개인정보처리방침을 통하여 고객님께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.</p>
                
                <strong>1. 수집하는 개인정보 항목 및 수집 방법</strong>
                <p>- 필수수집항목: 성명, 휴대전화번호, 이메일, 주소</p>
                <p>- 수집 방법: 홈페이지 온라인 문의 상담 신청을 통한 수집</p>

                <strong>2. 개인정보의 수집 및 이용목적</strong>
                <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
                <p>- 제품 상담, 서비스 제공에 따른 본인 확인, 고지사항 전달, 상담 결과 회신</p>

                <strong>3. 개인정보의 보유 및 이용기간</strong>
                <p>회사는 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</p>
                <p>- 보존 항목: 상담 신청 시 기재한 개인정보 및 상담 내용</p>
                <p>- 보존 기간: 상담 종료 후 1년 (단, 관계 법령에 의해 보존이 필요한 경우 해당 기간 보관)</p>

                <strong>4. 개인정보의 파기절차 및 방법</strong>
                <p>전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.</p>

                <strong>5. 이용자 및 법정대리인의 권리와 그 행사방법</strong>
                <p>이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수도 있습니다.</p>
                
                <p>※ 그 외 사항은 홈페이지 하단의 [개인정보처리방침] 전문을 확인해 주시기 바랍니다.</p>
              </div>
              <label className="iq-agree">
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
                <span>개인정보취급방침에 동의합니다.</span>
              </label>
            </div>
          </div>

          <div className="iq-divider" />

          {/* STEP 02 */}
          <div className="iq-step">
            <div className="iq-step-left">
              <strong>STEP02</strong>
              <p>개인정보 입력</p>
            </div>
            <div className="iq-step-right">
              <table className="iq-table">
                <tbody>
                  <tr>
                    <th>이름 <span className="req">*</span></th>
                    <td>
                      <input type="text" name="name" className="iq-input" value={formData.name} onChange={handleChange} required />
                    </td>
                  </tr>
                  <tr>
                    <th>E-mail <span className="req">*</span></th>
                    <td>
                      <div className="iq-flex-row">
                        <input type="text" name="emailPrefix" className="iq-input" placeholder="이메일" value={formData.emailPrefix} onChange={handleChange} required />
                        <span className="iq-separator">@</span>
                        <input type="text" name="emailDomain" className="iq-input" placeholder="도메인" value={formData.emailDomain} onChange={handleChange} required />
                        <select 
                          className="iq-select" 
                          onChange={(e) => setFormData(prev => ({ ...prev, emailDomain: e.target.value }))}
                          value={['naver.com', 'gmail.com', 'hanmail.net', 'nate.com'].includes(formData.emailDomain) ? formData.emailDomain : ''}
                        >
                          <option value="">직접입력</option>
                          <option value="naver.com">naver.com</option>
                          <option value="gmail.com">gmail.com</option>
                          <option value="hanmail.net">hanmail.net</option>
                          <option value="nate.com">nate.com</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>연락처 <span className="req">*</span></th>
                    <td>
                       <div className="iq-flex-row">
                        <select name="phone1" className="iq-select-small" value={formData.phone1} onChange={handleChange}>
                          <option value="010">010</option>
                          <option value="02">02</option>
                          <option value="031">031</option>
                          <option value="051">051</option>
                        </select>
                        <span className="iq-separator">-</span>
                        <input type="text" name="phone2" className="iq-input-small" placeholder="1234" maxLength={4} value={formData.phone2} onChange={handleChange} required />
                        <span className="iq-separator">-</span>
                        <input type="text" name="phone3" className="iq-input-small" placeholder="5678" maxLength={4} value={formData.phone3} onChange={handleChange} required />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="iq-divider" />

          {/* STEP 03 */}
          <div className="iq-step">
            <div className="iq-step-left">
              <strong>STEP03</strong>
              <p>의뢰정보 입력</p>
            </div>
            <div className="iq-step-right">
               <table className="iq-table">
                <tbody>
                  <tr>
                    <th>주소</th>
                    <td>
                      <div className="iq-flex-row">
                        <input type="text" name="address" className="iq-input iq-address-input" value={formData.address} onChange={handleChange} readOnly placeholder="주소 검색 버튼을 이용해주세요" />
                        <button type="button" className="btn-address" onClick={handlePostcode}>주소 검색</button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>문의사항 <span className="req">*</span></th>
                    <td>
                      <textarea name="details" className="iq-textarea" value={formData.details} onChange={handleChange} required></textarea>
                    </td>
                  </tr>
                  <tr>
                    <th>자동등록방지</th>
                    <td>
                      <div className="iq-captcha-row">
                        <div className="captcha-display">{captcha}</div>
                        <input type="text" name="captchaInput" className="iq-input-small" placeholder="" value={formData.captchaInput} onChange={handleChange} required />
                        <button type="button" className="btn-icon" onClick={generateCaptcha} title="새로고침">
                          <RefreshCw size={16} />
                        </button>
                      </div>
                      <p className="captcha-hint">자동등록방지 숫자를 순서대로 입력하세요.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="iq-submit-area">
            <button type="submit" className="btn-iq-submit" disabled={isSubmitting}>
              {isSubmitting ? '전송중...' : '전송'}
            </button>
            <button type="button" className="btn-iq-cancel" onClick={onClose}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
}
