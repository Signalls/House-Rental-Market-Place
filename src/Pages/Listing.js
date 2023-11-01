import { useState, useEffect } from "react"
import { Link, useParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Spinner from '../Components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import { MapContainer, Popup, Marker, TileLayer } from "react-leaflet"
import 'swiper/css';
import MySwiperComponent from "./SwiperComponent"



export default function Listing() {
    const [listing, setListing] = useState({})
    const [loading, setLoading] = useState(true)
    const [shareLinkIconCopied, setShareLinkIconCopied] = useState(false)

    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchListings = async () => {
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setListing(docSnap.data())
                setLoading(false)
            }
        }
        fetchListings()
    }, [params.listingId, listing.imageurl])

    if (loading) {
        return <Spinner />
    }
    console.log(listing.imageurl)
    return (
        <main>
            <MySwiperComponent listing={listing} />


            <div className="shareIconDiv" onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setShareLinkIconCopied(true)
                setTimeout(() => {
                    setShareLinkIconCopied(false)
                    console.log(listing.imageurl)

                }, 2000);
            }}>
                <img src={shareIcon} alt='share' />

            </div>
            {shareLinkIconCopied && <p className="linkCopied"> Link Copied</p>}
            <div className="listingDetails">
                <p className="listingName">{listing.name} -# {listing.offer ?
                    listing.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') :
                    listing.regularPrice.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}

                </p>
                <p className="listingLocation">{listing.location}</p>
                <p className="listingType"> For {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>
                {listing.offer && (<p className='discountPrice'>#{listing.regularPrice - listing.discountedPrice} discount</p>)}
                <ul className="listingDetailList">
                    <li>{listing.bedrooms > 1 ? `${listing.bedrooms} bedrooms` : '1 bedroom'}</li>
                    <li>{listing.batherooms > 1 ? `${listing.batherooms} batherooms` : '1 batheroom'}</li>
                    <li>{listing.parking && 'Parking spot'}</li>
                    <li>{listing.furnished && 'Furnished'}</li>

                </ul><p className="listingLocationTitle">Location</p>
                <div className="leafletContainer">
                    <MapContainer
                        style={{ height: '100%', width: '100%' }}
                        center={[listing.latitude, listing.longitude]}
                        zoom={13}
                        scrollWheelZoom={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>contributors'
                            url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png' />

                        <Marker
                            position={[listing.latitude, listing.longitude]}
                        >
                            <Popup>{listing.location}</Popup>
                        </Marker>
                    </MapContainer>
                </div>

                {
                    auth.currentUser !== listing.userRef && (
                        <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className="primaryButton">
                            Contact LandLord
                        </Link>
                    )
                }
            </div >
        </main >
    )
}