import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, updateProfile } from 'firebase/auth'
import { db } from './firebase.config'
import { updateDoc, doc, collection, query, orderBy, where, deleteDoc, getDocs } from 'firebase/firestore'
import { toast } from 'react-toastify'
import arrowRight from './assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from './assets/svg/homeIcon.svg'
import ListingItem from './Components/ListingItem'



function UserProfile() {
    const auth = getAuth()
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    })
    const [loading, setloading] = useState(true)
    const [listings, setListings] = useState(null)

    const { name, email } = formData
    const [changeDetails, setChangeDetails] = useState(false)
    const navigate = useNavigate();

    const onLogout = () => {
        auth.signOut()
        navigate('/')
    }
    const onDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete listing?')) {
            await deleteDoc(doc(db, 'listings', listingId))
            const updatedListings = listings.filter((listing) => listing.id !== listingId)
            setListings(updatedListings)
            toast.success('successfully deleted listing')

        }
    }
    const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                //Update displayname in firebase
                await updateProfile(auth.currentUser, {
                    displayName: name,
                })
                //Update in fireStore
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name,
                })
                toast.success('Profile update successful')

            }
        } catch (error) {
            toast.error('unable to update user details')
        }
    }
    const onchange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }
    useEffect(() => {
        const fetchuserlisting = async () => {
            const listingRef = collection(db, 'listings')
            const q = query(listingRef,
                where('userRef', '==', auth.currentUser.uid),
                orderBy('timestamp', 'desc'))

            const querySnap = await getDocs(q)

            let listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()

                })
            })
            setListings(listings)
            setloading(false)

        }
        fetchuserlisting()

    }, [auth.currentUser.uid])
    return (
        <div className='profile'>
            <header className='profileHeader'>
                <p className='pageHeader'>My profile</p>
                <button type='button' onClick={onLogout} className='logOut'>Logout</button>

            </header>
            <main>
                <div className='profileDetailsHeader'>
                    <p className='profileDetailsText'>Personal Details</p>
                    <p className='changePersonalDetails' onClick={() => {
                        changeDetails && onSubmit()
                        setChangeDetails(!changeDetails)

                    }}>{changeDetails ? 'Done' : 'Change'}

                    </p>

                </div>

                <div className='profileCard'>
                    <form>
                        <input className={!changeDetails ?
                            'profileName' : 'profileNameActive'}
                            type='text'
                            id='name'
                            disabled={!changeDetails}
                            value={name}
                            onChange={onchange} />

                        <input className={!changeDetails ?
                            'profileEmail' : 'profileEmailActive'}
                            type='text'
                            id='email'
                            disabled={!changeDetails}
                            value={email}
                            onChange={onchange} />


                    </form>

                </div>
                <Link
                    to='/create-listing' className='createListing'>
                    <img src={homeIcon} alt='home' />
                    <p> Sell or rent your home</p>
                    <img src={arrowRight} alt='arrow right' />

                </Link>
                {!loading && listings.length > 0 && (
                    <>
                        <p className='listingText'>Your Listings</p>
                        <ul className='listingList'>
                            {listings.map((listing) =>
                                <ListingItem
                                    listing={listing.data}
                                    id={listing.id}
                                    key={listing.id}
                                    onDelete={() => onDelete(listing.id)}
                                    onEdit={() => onEdit(listing.id)}
                                />
                            )}

                        </ul>
                    </>

                )}
            </main >
        </div >
    )

}
export default UserProfile
