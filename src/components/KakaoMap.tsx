'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [errorInfo, setErrorInfo] = useState("");

  useEffect(() => {
    let checkInterval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    const initMap = () => {
      try {
        window.kakao.maps.load(() => {
          if (!mapRef.current) return;

          const position = new window.kakao.maps.LatLng(37.5976, 127.0988);
          mapRef.current.innerHTML = '';

          const map = new window.kakao.maps.Map(mapRef.current, {
            center: position,
            level: 3,
          });

          const marker = new window.kakao.maps.Marker({
            position: position,
            map: map,
          });

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:8px 12px;font-size:13px;font-weight:600;white-space:nowrap;color:#333;">(주)태평프레시</div>`,
          });
          infowindow.open(map, marker);

          map.addControl(new window.kakao.maps.ZoomControl(), window.kakao.maps.ControlPosition.RIGHT);

          const handleResize = () => {
            map.relayout();
            map.setCenter(position);
          };
          window.addEventListener('resize', handleResize);
        });
      } catch (err) {
        console.error("Map init error:", err);
        setErrorInfo("지도 초기화 중 오류가 발생했습니다.");
      }
    };

    if (window.kakao?.maps?.Map) {
      // 이미 완전히 로드된 경우
      initMap();
    } else {
      // 로드 대기
      checkInterval = setInterval(() => {
        if (window.kakao?.maps) {
          clearInterval(checkInterval);
          clearTimeout(timeout);
          initMap();
        }
      }, 100);

      timeout = setTimeout(() => {
        clearInterval(checkInterval);
        setErrorInfo("카카오맵 서버와 연결할 수 없습니다. 일시적인 네트워크 문제이거나 로드 지연일 수 있습니다.");
      }, 10000);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="map-container">
      <div ref={mapRef} className="kakao-map" style={{ width: '100%', height: '100%' }} />
      {errorInfo && (
        <div className="map-placeholder">
          <p style={{ color: '#ef4444', textAlign: 'center', padding: '0 20px', lineHeight: '1.6' }}>
            <strong>지도 연결 실패</strong><br />{errorInfo}
          </p>
        </div>
      )}
    </div>
  );
}
