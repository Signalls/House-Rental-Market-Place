import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase.config'
import ListingItem from '../Components/ListingItem'
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    doc
}
    from 'firebase/firestore'
import { toast } from 'react-toastify'
import Spinner from '../Components/Spinner'

export default function Category() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(false)
    const [lastfetchedlisting, setlastfetchedListing] = useState(null)
    const params = useParams()
    useEffect(() => {
        const fetchListings = async () => {
            try {
                //get reference
                setLoading(true)
                const listingsRef = collection(db, 'listings')

                //create query
                const q = query(
                    listingsRef,
                    where('type', '==', params.categoryName),
                    orderBy('timestamp', 'desc'),
                    limit(10)
                )
                //execute query

                const querySnap = await getDocs(q)
                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setlastfetchedListing(lastVisible)
                const listings = []

                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data(),
                    })
                })
                console.log(listings)
                setListings(listings)
                setLoading(false)

            } catch (error) {
                toast.error('could not fetch listings')
            }
        }
        fetchListings()
    }, [params.categoryName])

    //fetching more listing

    const onfetchMoreListings = async () => {
        try {
            //get reference
            setLoading(true)
            const listingsRef = collection(db, 'listings')

            //create query
            const q = query(
                listingsRef,
                where('type', '==', params.categoryName),
                orderBy('timestamp', 'desc'),
                startAfter(lastfetchedlisting),
                limit(10)
            )
            //execute query

            const querySnap = await getDocs(q)
            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setlastfetchedListing(lastVisible)
            const listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })
            setListings((prevState) => [...prevState, ...listings])
            setLoading(false)

        } catch (error) {
            toast.error('could not fetch listings')
        }
    }
    return (
        <div>
            {loading ? <Spinner /> : <div className='category'>
                <header>
                    <p className='pageHeader'>
                        {params.categoryName === 'rent' ?
                            'Places for rent' : 'Places for sale'}</p>
                </header>
                {loading ? (
                    <Spinner />
                ) : listings && listings.length > 0 ? (
                    <>
                        <main>
                            <ul className='categoryListings'>
                                {listings.map((listing) => (
                                    <ListingItem
                                        listing={listing.data}
                                        id={listing.id}
                                        key={listing.id} />

                                ))}

                            </ul>

                        </main>
                        <br />
                        <br />
                        {lastfetchedlisting && (
                            <p className='loadMore' onClick={onfetchMoreListings}> Load More</p>
                        )}
                    </>
                ) : (
                    <p>No Listings for {params.categoryName}</p>
                )
                }

            </div >}
        </div >
    )
}