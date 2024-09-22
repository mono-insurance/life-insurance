import React from "react";
import image from "../../images/heroimg.jpg";
import "../../styles/hero.css";

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1>
                    Suraksha -  <br />
                    E Insurance
                </h1>
                <p>
                    Witness the devastating consequences of car accidents. Don't let unforeseen circumstances jeopardize your financial stability. Protect yourself and your loved ones with our comprehensive auto insurance policies. Our coverage includes collision, comprehensive, liability, and more, ensuring you're prepared for any eventuality.
                </p>
            </div>
            <div className="hero-img">
                <img
                    src={image}
                    alt="hero"
                />
            </div>
        </section>
    );
};

export default Hero;