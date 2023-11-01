import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDocs, query, limit, orderBy } from 'firebase/firestore'
import { collection } from 'firebase/firestore';
import { db } from '../firebase.config';
import 'swiper/css'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


export default function Slider() {
    const [listings, setListing] = useState(null)
    const [, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchListings = async () => {

            const listingRef = collection(db, 'listings')
            const q = query(listingRef, orderBy('timestamp', 'desc'),
                limit(5))
            const querySnap = await getDocs(q)
            let listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setListing(listings)
            console.log(listings)
            setLoading(false)
        }
        fetchListings();

    }, [])


    return (
        listings && (
            <>
                <p className='exploreHeading'>Recommended</p>
                <Swiper

                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    slidesPerView={1}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                >
                    {listings.map(({ data, id }) => (
                        <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                            <div
                                style={{
                                    background: `url(${data.imageurl[0]}) center no-repeat`,
                                    backgroundSize: 'cover',
                                    height: '500px',
                                    justifyContent: 'center',
                                }}
                                className="swiperSlideDiv"
                            >
                                <p className='swiperSlideText'>{data.name}</p>
                                <p className='swiperSlidePrice'>
                                    #{data.discountedPrice ?? data.regularPrice}
                                    {data.type === 'rent' && '/Month'}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </>
        )
    )
}