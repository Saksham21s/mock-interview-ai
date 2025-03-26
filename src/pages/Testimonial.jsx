import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { fetchTestimonials } from "../redux/testimonialsSlice";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const Testimonial = () => {
    const dispatch = useDispatch();
    const { data: testimonials, loading, error } = useSelector((state) => state.testimonials);

    useEffect(() => {
        dispatch(fetchTestimonials());
    }, [dispatch]);

    useEffect(() => {
    }, [testimonials]);

    return (
        <section className="testimonials-section">
            <h2 className="section-heading">What Users Are Saying</h2>

            {loading && <p>Loading testimonials...</p>}
            {error && <p>{error}</p>}

            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={3}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
            >
                {testimonials && testimonials.map((testimonial, index) => (
                    <SwiperSlide key={testimonial.id || index}>
                        <div className="testimonial-card">
                            <div className="testimonial-header">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="testimonial-user-image"
                                />
                                <div className="testimonial-user-info">
                                    <h3>{testimonial.name}</h3>
                                    <span>{testimonial.jobTitle}</span>
                                </div>
                            </div>
                            <p>"{testimonial.text}"</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Testimonial;
