import { useState } from "react";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const signup = async (email, password, onSent) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch('https://mern-tutorial-zpvg.onrender.com/api/user/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email,password})
    })
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      onSent(email);
      setIsLoading(false);
    }
  }

  return { signup, isLoading, error };
}