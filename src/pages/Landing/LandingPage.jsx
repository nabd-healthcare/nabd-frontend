import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import AISection from './components/AISection';
import HowItWorks from './components/HowItWorks';
import DoctorsSlider from './components/DoctorsSlider';
import Testimonials from './components/Testimonials';

import FAQ from './components/FAQ';
import DownloadApp from './components/DownloadApp';
import CTA from './components/CTA';
import Footer from './components/Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-[#0070CD]/20 selection:text-[#0070CD]" dir="rtl">
            <Header />
            <main>
                <Hero />
                <Features />
                <AISection />
                <HowItWorks />
                <DoctorsSlider />
                <Testimonials />

                <DownloadApp />
                <FAQ />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
