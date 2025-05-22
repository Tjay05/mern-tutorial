import { useState } from "react";
import Signup from "../components/Signup";
import VerifyOTPForm from "../components/VerifyOTPForm";

const Register = () => {
  const [email, setEmail] = useState(null);

  return (
    <>
      {!email ? (
        <Signup onSent={setEmail} />
      ) : (
        <VerifyOTPForm email={email} />
      )}
    </>
  );
}
 
export default Register;