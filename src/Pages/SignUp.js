import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import Oauth from '../Components/Oauth'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'


function SignIn() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false)
    const [visibility, setVisibility] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const { name, email, password } = formData;
    const onChange = (e) => {
        setFormData((prevstate) => ({
            ...prevstate,
            [e.target.id]: e.target.value,
        }))

    }
    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const auth = getAuth();
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredentials.user

            updateProfile(auth.currentUser, {
                displayName: name,
            })

            const formDataCopy = { ...formData }
            delete formDataCopy.password
            formDataCopy.timestamp = serverTimestamp()

            await setDoc(doc(db, 'users', user.uid), formDataCopy)
            navigate('/')
        } catch (error) {
            toast.error('Wrong Credentials ')
        }
    }

    return (
        <>
            <div className='pageContainer'>
                <header>
                    <p className='pageHeader'> Welcome Back!</p>
                </header>

                <form onSubmit={onSubmit}>
                    <input type='text'
                        className='nameInput'
                        placeholder='Name'
                        value={name}
                        id='name'
                        onChange={onChange} />

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
                    <div className='signUpBar'>
                        <p className='signUpText'>
                            Sign Up

                        </p>
                        <button className='signUpButton'>
                            <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
                        </button>

                    </div>

                </form>
                <Oauth />
                <Link to='/sign-in' className='registerLink'> Sign In Instead </Link>
            </div >

        </>
    )
}
export default SignIn;
