// LoginPage.js
import React, { useState } from 'react';
import './LoginPage.css';

export default function LoginPage() {
  // 상태 관리: 이메일과 비밀번호 입력값 저장
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 로그인 버튼 클릭 시 실행
  const handleLogin = () => {
    console.log('Login attempt:', { email, password });
    // 실제 구현 시: API 호출, 토큰 저장 등
  };

  // Enter 키 입력 시 로그인 실행
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // 소셜 로그인 버튼 클릭 시 실행
  const socialLogin = (provider) => {
    console.log('Social login:', provider);
    // 실제 구현 시: OAuth 인증 페이지로 리다이렉트
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="profile-circle"></div>
        
        <h1 className="title">Welcome back</h1>
        <p className="subtitle">Sign in to continue</p>

        <div className="input-group">
          {/* 이메일 입력: value로 양방향 바인딩, onChange로 상태 업데이트 */}
          <input
            type="email"
            placeholder="Email address"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          
          {/* 비밀번호 입력 */}
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          
          <button onClick={handleLogin} className="login-button">
            Login
          </button>
        </div>

        <p className="divider-text">Or sign in with</p>

        {/* 첫 번째 줄: 카카오, 애플, 구글 */}
        <div className="social-grid">
          <button 
            className="social-button"
            onClick={() => socialLogin('kakao')}
          >
            <div className="social-icon kakao-icon">K</div>
            <span className="social-label">Kakao</span>
          </button>

          <button 
            className="social-button"
            onClick={() => socialLogin('apple')}
          >
            <div className="social-icon apple-icon">
              <span style={{ fontSize: '24px' }}>🍎</span>
            </div>
            <span className="social-label">Apple</span>
          </button>

          <button 
            className="social-button"
            onClick={() => socialLogin('google')}
          >
            <div className="social-icon google-icon">G</div>
            <span className="social-label">Google</span>
          </button>
        </div>

        {/* 두 번째 줄: 네이버, Add 버튼들 */}
        <div className="social-grid">
          <button 
            className="social-button"
            onClick={() => socialLogin('naver')}
          >
            <div className="social-icon naver-icon">N</div>
            <span className="social-label">Naver</span>
          </button>

          <button className="social-button">
            <div className="social-icon add-icon">+</div>
            <span className="social-label">Add</span>
          </button>

          <button className="social-button">
            <div className="social-icon add-icon">+</div>
            <span className="social-label">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}