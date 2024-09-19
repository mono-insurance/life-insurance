import React from "react";
import Contact from "../components/CustomerPage/Contact";
import AboutUs from "../components/CustomerPage/AboutUs";
import Footer from "../components/CustomerPage/Footer";
import Hero from "../components/CustomerPage/Hero";
import Navbar from "../components/CustomerPage/Navbar";
import HomeCircles from "../components/CustomerPage/HomeCircles";

const Home = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <AboutUs />
            <HomeCircles />
            <Contact />
            <Footer />
        </>
    );
};

export default Home;