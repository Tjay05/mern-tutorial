import { useState } from "react";
import { useSignup } from "../hooks/useSignup"

const Signup = ({ onSent }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {signup, isLoading, error} = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(email, password, onSent);
  }

  return (
    <form className="rule my-10 bg-white max-w-100 rounded-sm p-5" onSubmit={handleSubmit}>
      <h3 className="text-center text-lg font-bold mb-6">Sign Up</h3>

      <label className="label">Email</label>
      <input
        type="email" 
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className='input-field'
      />
      <label className="label">Password</label>
      <input
        type="password" 
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className='input-field'
      />

      {!isLoading && <button className="submit-btn">Sign up</button>}
      {isLoading && <button disabled className="submit-btn">Signing up...</button>}
      {error && <div className="warning">{error}</div>}
    </form>
  );
}
 
export default Signup;