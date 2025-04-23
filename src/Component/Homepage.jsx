import React from "react";
import "./Homepage.css";
import Navbar from "./Navbar/Navbar";
import Hero from "./Hero/Hero";
import FeaturedCollection from "./FeaturedCollection/FeaturedCollection";
import CollectionIntro from "./CollectionIntro/CollectionIntro";
import FashionShowcase from "./FashionShowcase/FashionShowcase";
import StyleEmpower from "./StyleEmpower/StyleEmpower";
import FashionGrid from "./FashionGrid/FashionGrid";
import InstaFeed from "./InstaFeed/InstaFeed";
import Footer from "./Footer/Footer";

function Homepage() {
  return (
    <div className="homepage">
      <Navbar />
      <Hero />
      <FeaturedCollection />
      <CollectionIntro />
      <FashionShowcase />
      <StyleEmpower />
      <FashionGrid />
      <InstaFeed />
      <Footer />
    </div>
  );
}

export default Homepage;
