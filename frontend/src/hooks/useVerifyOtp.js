import { useState } from "react"
import { useAuthContext } from "./useAuthContext";

export const useVerifyOTP = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const [mssg, setMssg] = useState(null);

  const verifyOTP = async (email, otp) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch('https://mern-tutorial-zpvg.onrender.com/api/user/verifyOtp', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, otp})
    })
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      setMssg("Congratulations! your account has been verified successfully, kindly wait as your account is being prepared");
      setTimeout(() => {
        // save the user to local storage
        localStorage.setItem('user', JSON.stringify(json));
        
        // update the authContext
        dispatch({type: 'LOGIN', payload: json})
        
        setIsLoading(false);
      }, 4000)
    }
  }

  return { verifyOTP, isLoading, error, mssg };

}