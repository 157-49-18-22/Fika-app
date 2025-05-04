import React, { useState } from 'react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setSuccess('');
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/email/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Failed to send OTP.');
      } else {
        setInfo(data.message || 'OTP sent to your email.');
        setStep(2);
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    }
    setLoading(false);
  };

  // Step 2: Verify OTP (call backend)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!enteredOtp || enteredOtp.length < 4) {
      setError('Please enter the OTP sent to your email.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: enteredOtp })
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Invalid OTP.');
      } else {
        setStep(3);
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    }
    setLoading(false);
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setInfo('');
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: enteredOtp, newPassword })
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Failed to reset password.');
      } else {
        setSuccess('Password reset successful! You can now login with your new password.');
        setStep(4);
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="forgot-password-page" style={{minHeight:'70vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f8f9fa'}}>
      <div className="forgot-password-card" style={{background:'#fff',borderRadius:16,boxShadow:'0 8px 32px rgba(0,0,0,0.08)',padding:32,maxWidth:400,width:'100%'}}>
        <h2 style={{textAlign:'center',marginBottom:18}}>Forgot Password</h2>
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div style={{marginBottom:18}}>
              <label style={{fontWeight:500,marginBottom:6,display:'block'}}>Enter your registered email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #ddd'}}
                required
              />
            </div>
            {info && <div style={{color:'#4caf50',marginBottom:10}}>{info}</div>}
            {error && <div style={{color:'#ff4444',marginBottom:10}}>{error}</div>}
            <button type="submit" style={{width:'100%',padding:12,borderRadius:8,background:'linear-gradient(90deg,#6a11cb,#2575fc)',color:'#fff',fontWeight:600,border:'none'}} disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div style={{marginBottom:18}}>
              <label style={{fontWeight:500,marginBottom:6,display:'block'}}>Enter OTP sent to your email</label>
              <input
                type="text"
                value={enteredOtp}
                onChange={e => setEnteredOtp(e.target.value)}
                placeholder="Enter OTP"
                style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #ddd'}}
                required
              />
              <div style={{fontSize:'0.93rem',color:'#6a11cb',marginTop:6}}>
                <b>Note:</b> Only the latest OTP (from the most recent resend) is valid.
              </div>
            </div>
            {error && <div style={{color:'#ff4444',marginBottom:10}}>{error}</div>}
            <button type="submit" style={{width:'100%',padding:12,borderRadius:8,background:'linear-gradient(90deg,#6a11cb,#2575fc)',color:'#fff',fontWeight:600,border:'none',marginBottom:10}} disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
            <button type="button" onClick={handleSendOtp} style={{width:'100%',padding:12,borderRadius:8,background:'linear-gradient(90deg,#ff9800,#ff5e62)',color:'#fff',fontWeight:600,border:'none'}} disabled={loading}>{loading ? 'Resending...' : 'Resend OTP'}</button>
            {info && <div style={{color:'#4caf50',marginTop:10}}>{info}</div>}
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div style={{marginBottom:18}}>
              <label style={{fontWeight:500,marginBottom:6,display:'block'}}>Enter New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="New Password"
                style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #ddd'}}
                required
              />
            </div>
            <div style={{marginBottom:18}}>
              <label style={{fontWeight:500,marginBottom:6,display:'block'}}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #ddd'}}
                required
              />
            </div>
            {error && <div style={{color:'#ff4444',marginBottom:10}}>{error}</div>}
            <button type="submit" style={{width:'100%',padding:12,borderRadius:8,background:'linear-gradient(90deg,#6a11cb,#2575fc)',color:'#fff',fontWeight:600,border:'none'}} disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
          </form>
        )}
        {step === 4 && (
          <div style={{textAlign:'center',color:'#4caf50',fontWeight:600}}>
            {success}
            <div style={{marginTop:18}}>
              <a href="/login" style={{color:'#2575fc',textDecoration:'underline'}}>Back to Login</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 