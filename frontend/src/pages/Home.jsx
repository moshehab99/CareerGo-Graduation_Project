import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import FeaturedJobs from "../components/FeaturedJobs";
import Categories from "../components/Categories";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedJobs />
        <Categories />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

