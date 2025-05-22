import { useRef } from "react";
import { useState } from "react";
import { useVerifyOTP } from "../hooks/useVerifyOtp";

const VerifyOTPForm = ({ email }) => {
  const [otp, setOtp] = useState('');
  const otpRefs = useRef([]);

  const { verifyOTP, isLoading, error, mssg } = useVerifyOTP();

  const handleChange = (i, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    setOtp((prevOtp) => {
      const newOtp = prevOtp.split("");
      newOtp[i] = value;
      return newOtp.join("");
    });

    if (value && i < otpRefs.current.length - 1) {
      otpRefs.current[i + 1].focus();
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs.current[i - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await verifyOTP(email, otp);
  }

  return (    
    <form className="rule my-10 bg-white max-w-100 rounded-sm p-5" onSubmit={handleSubmit}>
      <h3 className="font-semibold mb-6">Enter OTP sent to {email}:</h3>
      <div className="w-full flex justify-evenly">
      {Array.from({ length: 4 }, (_, i) => (
        <input
          className="border-green-600 border-2 text-center w-1/5 mb-8 rounded-full pl-3 py-2.5 text-lg bg-[#1aac033b] lg:w-1/7"
          key={i}
          type="number"
          maxLength="1"
          value={otp[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          ref={(ref) => (otpRefs.current[i] = ref)}
        />
      ))}
      </div>

      {error && <div className="warning">{error}</div>}
      {!isLoading && <button className="submit-btn">Verify</button>}
      {isLoading && <button disabled className="submit-btn">Verifying otp...</button>}
      {mssg && <p className="text-green-600 text-sm font-semibold my-2 border rounded p-2 italic bg-[#39e9bc]">{mssg}</p>}
    </form>
  );
}
 
export default VerifyOTPForm;