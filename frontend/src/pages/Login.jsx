import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(email, password);
  }

  return (
    <form className="rule my-10 bg-white max-w-100 rounded-sm p-5" onSubmit={handleSubmit}>
      <h3 className="text-center text-lg font-bold mb-6">Log in</h3>

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

      {!isLoading && <button className="submit-btn">Login</button>}
      {isLoading && <button className="submit-btn" disabled>Logging in...</button>}
      {error && <div className="warning">{error}</div>}
    </form>
  );
}
 
export default Login;