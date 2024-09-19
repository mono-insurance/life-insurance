import React from "react";
import image from "../../images/aboutimg.jpeg";

const AboutUs = () => {
    return (
        <>
            <section className="container">
                <h2 className="page-heading about-heading">About Us</h2>
                <div className="about">
                    <div className="hero-img">
                        <img
                            src={image}
                            alt="hero"
                        />
                    </div>
                    <div className="hero-content">
                        <p>
                            Life's full of uncertainties. Protect what matters most with our comprehensive life insurance plans. Whether you're a parent, a spouse, or a business owner, our policies offer financial security for you and your loved ones. Choose from a variety of options tailored to your specific needs, including term life, whole life, and universal life insurance. With our expert guidance, you can find the perfect plan to safeguard your future and provide peace of mind for years to come
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AboutUs;