import { useState, useEffect } from 'react';
import axios from 'axios';
import './UserForm.css';

const UserForm = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [user, setUser] = useState({})

  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const createUser = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/users', {
        name,
        phone_number: phoneNumber,
      });

      setMessage(response.data.message);
      setUser(response.data.user)
    } catch (error) {
      console.error('Error creating user:', error.message);
      setMessage('Error creating user');
    }
  };

  const generateOTP = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/users/generateOTP', {
        phone_number: phoneNumber,
      });

      setMessage(response.data.message);
      setCountdown(300)
    } catch (error) {
      console.error('Error generating OTP:', error.message);
      setMessage('Error generating OTP');
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/${user.id}/verifyOTP`, {
        params: { otp },
      });
  
      if (response.data.success) {
        setMessage('OTP verified successfully');
        setOtp(''); // Clear OTP after successful verification
        setCountdown(0); // Reset countdown after successful verification
      } else {
        setMessage('Incorrect OTP or OTP has expired');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
      setMessage('Error verifying OTP');
    }
  };
  const formattedTime = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="glass-card">
      <h2>User Form</h2>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <br />
      <label>
        Phone Number:
        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      </label>
      <br />
      <button className="action-button" onClick={createUser}>
        Create User
      </button>
      <button className="action-button" onClick={generateOTP}>
        Generate OTP
      </button>
      <br />
      {message && <p>{message}</p>}
      {message === 'Error generating OTP' && (
        <p>Make sure the user with the provided phone number exists.</p>
      )}
      {message === 'Error creating user' && <p>An error occurred while creating the user.</p>}
      {message === 'Error verifying OTP' && <p>An error occurred while verifying the OTP.</p>}
      {message !== 'Error generating OTP' && !message.startsWith('Error') && (
        <>
          <label>
            OTP:
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
          </label>
          <button className="action-button" onClick={verifyOTP}>
            Verify OTP
          </button>
        </>
      )}
      {countdown > 0 && (
        <div className="otp-countdown">
          Time left for OTP expiration: {formattedTime()}
        </div>
      )}
    </div>
  );
};

export default UserForm;
