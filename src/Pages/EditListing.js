import { useState, useRef, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate, useParams } from 'react-router-dom'
import { serverTimestamp, getDoc, doc, updateDoc } from 'firebase/firestore'
import Spinner from '../Components/Spinner'
import { toast } from 'react-toastify'
import { db } from '../firebase.config'
import { v4 as uuidv4 } from 'uuid'
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL
} from 'firebase/storage'
export default function EditListing() {
    const [geolocationEnabled, setGeoLocationEnabled] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        type: 'rent',
        bedrooms: 1,
        batherooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: true,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0
    })
    const { type, name, batherooms, bedrooms, furnished, latitude, longitude, address, offer, regularPrice, discountedPrice,
        images, parking } = formData
    const auth = getAuth()
    const [loading, setLoading] = useState(false)
    const [listing, setListing] = useState(false)

    const navigate = useNavigate()
    const params = useParams()
    const isMounted = useRef(true)

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        let geolocation = {}
        let location
        if (discountedPrice >= regularPrice) {
            setLoading(false)
            toast.error('Discounted price should be less than regular Price')
            return
        }
        if (images.lenght > 6) {
            setLoading(false)
            toast.error('Image max 6')
            return
        }
        if (geolocationEnabled) {

        }
        else {
            geolocation.lat = latitude
            geolocation.lng = longitude
            location = address
        }
        const storageImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
                const storageRef = ref(storage, 'images/' + fileName)

                const uploadTask = uploadBytesResumable(storageRef, image)
                uploadTask.on('state_changed',
                    (snapshot) => {

                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                            default:
                                console.log('error')
                        }
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                        reject(error)
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );

            })

        }
        const imageurl = await Promise.all(
            [...images].map((image) => storageImage(image))
        ).catch(() => {
            setLoading(false)
            toast.error('error trying to upload images')
            return
        })

        const formDataCopy = {
            ...formData,
            imageurl,
            timestamp: serverTimestamp()

        }
        delete formDataCopy.images
        location && (formDataCopy.location = address)
        //update listing
        const docRef = doc(db, 'listings', params.listingId)
        await updateDoc(docRef, formDataCopy)
        setLoading(false)
        toast.success('Listings successfully saved!')
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }


    const onMutate = (e) => {
        let boolean = null

        if (e.target.value === true) {
            boolean = true
        }
        if (e.target.value === 'false') {
            boolean = false
        }
        //Files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files

            }))
        }
        //Text,files,boolean
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,

            }))
        }

    }
    //Checking authentication
    useEffect(() => {
        if (listing && listing.userRef !== auth.currentUser.uid) {
            toast.error('cant update listing')
            navigate('/')
        }
    })

    //fetchlisting
    useEffect(() => {
        setLoading(true)
        const fetchingListing = async () => {
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)
            console.log(docSnap.data())
            if (docSnap.exists()) {
                setListing(docSnap.data())
                setFormData({ ...docSnap.data() })
                setLoading(false)
            }
            else {
                navigate('/')
                toast.error('Listing does not exist')
            }

        }
        fetchingListing()
    }, [])
    //setuserRef to loggedin user
    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData({ ...formData, userRef: user.uid })
                }
                else {
                    navigate('sign-in')
                }
            })
        }
        return () => {
            isMounted.current = false
        }
    }, [isMounted])


    return (
        <div>
            {loading ? <Spinner /> : <div className='profile'>

                <header>
                    <p className='pageHeader'> Edit Listing</p>

                </header>
                <main>
                    <form onSubmit={onSubmit}>
                        <label className='formLabel'>Sell or Rent</label>
                        <div className='formButtons'>
                            <button
                                type='button'
                                className={type === 'sale' ? 'formButtonActive' : 'formButton'}
                                id='type'
                                value='sale'
                                onClick={onMutate}
                            >Sell
                            </button>
                            <button
                                type='button'
                                className={type === 'rent' ? 'formButtonActive' : 'formButton'}
                                id='type'
                                value='rent'
                                onClick={onMutate}
                            >Rent
                            </button>
                        </div>
                        <label className='formLabel'> Name</label>
                        <input
                            className='formInputName'
                            type='text'
                            id='name'
                            value={name}
                            onChange={onMutate}
                            maxLength='32'
                            minLength='10'
                            required
                        />
                        <div className='formRooms flex'>
                            <div>
                                <label className='formLabel'> Bedrooms</label>
                                <input
                                    className='formInputSmall'
                                    type='number'
                                    value={bedrooms}
                                    id='bedrooms'
                                    onChange={onMutate}
                                    min='1'
                                    max='50'
                                />
                            </div>
                            <div>
                                <label className='formLabel'> Batherooms</label>
                                <input
                                    className='formInputSmall'
                                    type='number'
                                    value={batherooms}
                                    id='batherooms'
                                    onChange={onMutate}
                                    min='1'
                                    max='50'
                                />
                            </div>

                        </div>
                        <label className='formLabel'>Parking Spot</label>
                        <div className='formbutton flex'>
                            <button className={parking ? 'formButtonActive' : 'formButton'}
                                type='button'
                                id='parking'
                                onClick={onMutate}
                                min='1'
                                value={true}
                                max='50'>
                                Yes
                            </button>
                            <button className={!parking && parking !== null ? 'formButtonActive' : 'formButton'}
                                type='button'
                                id='parking'
                                onClick={onMutate}
                                min='1'
                                value={false}
                                max='50'>
                                No
                            </button>
                        </div>
                        <label className='formLabel'>Furnished</label>
                        <div className='formbutton flex'>
                            <button className={furnished ? 'formButtonActive' : 'formButton'}
                                type='button'
                                id='furnished'
                                onClick={onMutate}
                                min='1'
                                value={true}
                                max='50'>
                                Yes
                            </button>
                            <button className={!furnished && furnished !== null ? 'formButtonActive' : 'formButton'}
                                type='button'
                                id='furnished'
                                onClick={onMutate}
                                min='1'
                                value={false}
                                max='50'>
                                No
                            </button>
                        </div>
                        <label className='formLabel'> Address</label>
                        <textarea
                            className='formInputAddress'
                            type='text'
                            id='address'
                            value={address}
                            onChange={onMutate}
                            required
                        />
                        {!geolocationEnabled && (
                            <div className='formLatLng flex'>
                                <div>
                                    <label className='formLabel'> Latitude</label>
                                    <input
                                        className='formInputSmall'
                                        type='number'
                                        id='latitude'
                                        value={latitude}
                                        onChange={onMutate}
                                        required />
                                </div>
                                <div>
                                    <label className='formLabel'> Logitude</label>
                                    <input
                                        className='formInputSmall'
                                        type='number'
                                        id='longitude'
                                        value={longitude}
                                        onChange={onMutate}
                                        required />
                                </div>
                            </div>
                        )}
                        <label className='formLabel'>Offer</label>
                        <div className='formbutton flex'>
                            <button className={offer ? 'formButtonActive' : 'formButton'}
                                type='button'
                                id='offer'
                                onClick={onMutate}
                                value={true}
                            >
                                Yes
                            </button>
                            <button className={!offer && offer !== null ? 'formButtonActive' : 'formButton'}
                                type='button'
                                id='offer'
                                onClick={onMutate}
                                value={false}
                            >
                                No
                            </button>
                        </div>
                        <label className='formLabel'> Regular Price</label>
                        <   div className='formPriceDiv'>
                            <input className='formInputSmall'
                                type='number'
                                id='regularPrice'
                                value={regularPrice}
                                onChange={onMutate}
                                min='50'
                                max='750000000'
                                required />
                            {type === 'rent' && (<p className='formPriceText'># / Month</p>)}
                        </div>
                        <label className='formLabel'> Discounted Price</label>
                        <div className='formPriceDiv'>
                            <input className='formInputSmall'
                                type='number'
                                id='discountedPrice'
                                value={discountedPrice}
                                onChange={onMutate}
                                min='50'
                                max='750000000'
                                required />
                            {type === 'rent' && (<p className='formPriceText'># / Month</p>)}
                        </div>
                        <label className='formLabel'>Images</label>
                        <p className='imagesInfo'>The first image will be the cover (max 6).</p>
                        <input className='formInputFile'
                            type='file'
                            id='images'
                            onChange={onMutate}
                            max='6'
                            accept='.jpeg,.png,.jpg'
                            multiple
                            required />
                        <button className='primaryButton createListingButton' type='submit'> Edit Listing
                        </button>
                    </form>
                </main>
            </div>}
        </div >
    )
}