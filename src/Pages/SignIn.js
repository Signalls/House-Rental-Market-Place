import { useState } from 'react'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
function SignIn() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false)
    const [visibility, setVisibility] = useState(false)
    const [formData, setFormdata] = useState({
        email: '',
        password: ''
    });
    const { email, password } = formData;
    const onChange = (e) => {
        setFormdata((prevstate) => ({
            ...prevstate,
            [e.target.id]: e.target.value,
        }))

    }
    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const auth = getAuth()
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            if (userCredential.user) {
                navigate('/userprofile')
            }
        } catch (error) {
            toast.error('Credentials')
        }
    }
    return (
        <>
            <div className='pageContainer'>
                <header>
                    <p className='pageHeader'> Welcome Back!</p>
                </header>

                <form onSubmit={onSubmit}>
                    <input type='email'
                        className='emailInput'
                        placeholder='Email'
                        value={email}
                        id='email'
                        onChange={onChange} />

                    <div className='passwordInputDiv'>
                        <input type={showPassword ? 'text' : 'password'}
                            className='passwordInput'
                            placeholder='Password'
                            value={password}
                            id='password'
                            onChange={onChange} />
                        <img src={visibilityIcon}
                            alt='show password'
                            className='showPassword'
                            onClick={() => setShowPassword((prevstate) =>
                                !prevstate)}
                        />
                    </div>
                    <Link to='/forgot-password'
                        className='forgotPasswordLink'>Forgot Password
                    </Link>
                    <div className='signInbar'>
                        <p className='signInText'>
                            Sign In
                        </p>
                        <button className='signInButton'>
                            <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
                        </button>
                    </div>
                </form>
                {/* Google Auth */}
                <Link to='/sign-up' className='registerLink'> Signup Instead </Link>
            </div >

        </>
    )
}
export default SignIn;