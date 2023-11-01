import React from 'react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


const MySwiperComponent = ({ listing }) => {
    return (
        <Swiper

            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={1}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
        >
            {listing.imageurl.map((url, index) => (
                <SwiperSlide key={index}>
                    <div
                        style={{
                            background: `url(${url}) center no-repeat`,
                            backgroundSize: 'cover',
                            height: '500px',
                            justifyContent: 'center',
                        }}
                        className="swiperSlideDiv"
                    ></div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default MySwiperComponent;
