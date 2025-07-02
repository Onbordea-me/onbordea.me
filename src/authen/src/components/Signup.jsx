import React , { useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'; 

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");
    const navigate = useNavigate();

    const {session, signUpNewUser} = UserAuth();
    console.log(session);
    console.log(email, password);

    //logic for signing up a new user
    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true);
        try {
            const result = await signUpNewUser(email, password);
            if (result.success) {
                navigate("/Dashboard");
            }
        }
        catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    return(
     <div>
        <form onSubmit={handleSignup} className='max-w-md m-auto pt-24'>
            <h2 className='font-bold pb-2'>Sign Up</h2>
            <p>Already have an account? <Link to ="/Signin">Sign in!</Link></p>
            <div className='flex flex-col py-4'>
                <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" className='p-3 mt-6' type="email" />
                <input onChange={(e) => setPassword(e.target.value)} placeholder="Password" className='p-3 mt-6' type="password" />
                <button type="submit" disabled={loading} className='mt-6 w-full'>Sign up</button>
                {error && <p className="text-red-600 text-center pt-4"> {error}</p>}
            </div>
        </form>
    </div>
    );
}
export default Signup;