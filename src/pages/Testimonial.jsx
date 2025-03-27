import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { fetchTestimonials, setSlidesPerView } from "../redux/testimonialsSlice";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

const Testimonial = () => {
    const dispatch = useDispatch();
    const { data: testimonials, loading, error } = useSelector((state) => state.testimonials);
    const slidesPerView = useSelector((state) => state.testimonials.slidesPerView);

    // Fetch testimonials only if they haven't been loaded yet
    useEffect(() => {
        if (testimonials.length === 0) {
            dispatch(fetchTestimonials());
        }
    }, [dispatch, testimonials.length]);

    // Handle resize with debouncing
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            let newSlidesPerView = 3;

            if (width <= 480) newSlidesPerView = 1;
            else if (width <= 768) newSlidesPerView = 2;

            dispatch(setSlidesPerView(newSlidesPerView));
        };

        // Run once initially
        handleResize();

        let resizeTimeout;
        const debounceResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 200); // Debounced to avoid frequent triggers
        };

        window.addEventListener('resize', debounceResize);

        return () => window.removeEventListener('resize', debounceResize);
    }, [dispatch]);

    return (
        <section className="testimonials-section">
            <h2 className="section-heading">What Users Are Saying</h2>

            {loading && <p>Loading testimonials...</p>}
            {error && <p>{error}</p>}

            <Swiper
                modules={[Autoplay]}
                spaceBetween={30}
                slidesPerView={slidesPerView}
                loop={false}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
            >
                {testimonials.map((testimonial, index) => (
                    <SwiperSlide key={testimonial.id || index}>
                        <div className="testimonial-card">
                            <div className="testimonial-header">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="testimonial-user-image"
                                    loading="lazy"
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
