import { useState } from "react";
import ScrollBlurItem from '@/components/ui/ScrollBlurItem';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";

// Custom SVG icons to replace lucide-react imports
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MinusIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
  </svg>
);

type ServiceCategory = {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  isOpen?: boolean;
};

export default function ServicesSection() {
  const [services, setServices] = useState<ServiceCategory[]>([
    {
      id: "001",
      number: "(001)",
      title: "Web design and development",
      description: "Modern, responsive, and user-friendly websites designed to engage visitors and drive conversions.",
      image: "/service-web.jpg",
      isOpen: true
    },
    {
      id: "002",
      number: "(002)",
      title: "Social media marketing",
      description: "Strategic social media campaigns to boost your brand presence and engage with your target audience.",
      image: "/service-social.jpg",
      isOpen: false
    },
    {
      id: "003",
      number: "(003)",
      title: "SEO and content marketing",
      description: "Data-driven SEO strategies and compelling content that drives organic traffic and improves rankings.",
      image: "/service-seo.jpg",
      isOpen: false
    },
    {
      id: "004",
      number: "(004)",
      title: "Branding and identity",
      description: "Distinctive brand identities that communicate your values and create lasting impressions.",
      image: "/service-branding.jpg",
      isOpen: false
    }
  ]);

  const toggleService = (id: string) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, isOpen: !service.isOpen } : service
    ));
  };

  return (
    <>
      {/* Services Section with Black Card */}
      <section className="relative min-h-screen py-4 overflow-hidden">
        <div className="relative z-10 w-full h-[calc(100vh-68px)] px-2 mt-11">
          <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl bg-black">
            <div className="w-[calc(100%-80px)] max-w-[1500px] mx-auto py-16">
              {/* Responsive layout for "What we do" section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 mb-8 items-start">
                {/* Left side with 'What we do' - using responsive grid */}
                <div className="lg:col-span-2 flex items-center mb-4 lg:mb-0">
                    <div className="w-5 h-5 bg-white rounded-full mr-2 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 0V10M0 5H10" stroke="black" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <ScrollBlurItem>
                      <span className="text-sm font-bold text-white">What we do</span>
                    </ScrollBlurItem>
                </div>
                
                {/* Main heading with proper spacing - responsive positioning */}
                <div className="lg:col-span-10 lg:pl-12">
                  <ScrollBlurItem>
                    <h1 className="text-[90px] md:text-[130px] lg:text-[180px] font-medium tracking-tighter leading-[0.77] text-white">
                      Services<span className="text-white">.</span>
                    </h1>
                  </ScrollBlurItem>
                  <ScrollBlurItem>
                    <p className="text-sm text-white/50 mt-2">©2025</p>
                  </ScrollBlurItem>
                </div>
              </div>

              {/* Updated Services list to match exact spacing in reference image */}
              <div className="mt-20">
                {services.map((service, index) => (
                  <div key={service.id}>
                    <ServiceItem 
                      service={service} 
                      toggleService={toggleService} 
                      isLast={index === services.length - 1}
                    />
                    
                    <AnimatePresence>
                      {service.isOpen && (
                        <ServiceExpandedContent service={service} />
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* CTA Button - Responsive alignment */}
              <ScrollBlurItem>
                <div className="mt-24 pl-0 lg:pl-32">
                  <Link 
                    href="#"
                    className="inline-block rounded-full border border-white/20 bg-white text-black px-8 py-4 font-bold hover:bg-white/90 transition"
                  >
                    Get started
                  </Link>
                </div>
              </ScrollBlurItem>
            </div>
          </div>
        </div>
      </section>

      {/* How we launch section - responsive layout with consistent spacing */}
      <section className="py-20">
        <div className="w-[calc(100%-80px)] max-w-[1500px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 mb-8 items-start">
            {/* Left side with 'About us' - consistent with What we do */}
            <div className="lg:col-span-2 flex items-center mb-4 lg:mb-0">
                <div className="w-5 h-5 bg-black rounded-full mr-2 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 0V10M0 5H10" stroke="white" strokeWidth="1.5" />
                  </svg>
                </div>
                <span className="text-sm font-bold">About us</span>
            </div>
            
            {/* fabrica text - consistent with Services positioning */}
            <div className="lg:col-span-10 lg:pl-12">
              <p className="text-lg font-bold mb-8">fabrica<sup>®</sup></p>
          
              {/* Main heading - consistent with Services */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              <span className="text-black">How we launch websites and</span><br />
              <span className="text-gray-400">marketing campaigns.</span>
            </h2>
            
            <p className="text-gray-600 font-bold max-w-md mb-4">
              See how our team combines creativity, technology,<br />
              and strategy to build powerful digital solutions.
            </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Cards Section - Responsive grid */}
      <section className="pb-4 -mt-6">
        <div className="w-[calc(100%-80px)] max-w-[1500px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ transform: "translateY(-5px)" }}>
            {/* Card 1 */}
            <div className="bg-black text-white p-5 rounded-xl shadow-md h-auto sm:h-[160px] lg:h-[160px] opacity-90 hover:opacity-100 transition-opacity">
              <div className="flex items-center mb-3">
                <div className="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mr-1"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mr-1"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                <span className="ml-auto text-gray-400 text-sm">01</span>
              </div>
              <div className="flex items-start">
                <div className="mr-4">
                  <Image 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                    alt="Team collaboration"
                    width={50}
                    height={50}
                    className="rounded-lg object-cover w-[50px] h-[50px]"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold">The team that</h3>
                  <p className="text-base font-bold">communicates</p>
                  <p className="text-base font-bold">every step</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-black text-white p-5 rounded-xl shadow-md h-auto sm:h-[160px] lg:h-[160px] opacity-90 hover:opacity-100 transition-opacity">
              <div className="flex items-center mb-3">
                <div className="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mr-1"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                <span className="ml-auto text-gray-400 text-sm">02</span>
              </div>
              <div className="flex items-start">
                <div className="mr-4">
                  <Image 
                    src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                    alt="Customized solutions"
                    width={50}
                    height={50}
                    className="rounded-lg object-cover w-[50px] h-[50px]"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold">Customized</h3>
                  <p className="text-base font-bold">solutions for your</p>
                  <p className="text-base font-bold">unique needs</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-black text-white p-5 rounded-xl shadow-md h-auto sm:h-[160px] lg:h-[160px] opacity-90 hover:opacity-100 transition-opacity">
              <div className="flex items-center mb-3">
                <div className="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                <span className="ml-auto text-gray-400 text-sm">03</span>
              </div>
              <div className="flex items-start">
                <div className="mr-4">
                  <Image 
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1726&q=80" 
                    alt="Transparent pricing"
                    width={50}
                    height={50}
                    className="rounded-lg object-cover w-[50px] h-[50px]"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold">Transparent pricing</h3>
                  <p className="text-base font-bold">with no hidden fees</p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-black text-white p-5 rounded-xl shadow-md h-auto sm:h-[160px] lg:h-[160px] opacity-90 hover:opacity-100 transition-opacity">
              <div className="flex items-center mb-3">
                <div className="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <span className="ml-auto text-gray-400 text-sm">04</span>
              </div>
              <div className="flex items-start">
                <div className="mr-4">
                  <Image 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" 
                    alt="Dedicated support"
                    width={50}
                    height={50}
                    className="rounded-lg object-cover w-[50px] h-[50px]"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold">Proven track</h3>
                  <p className="text-base font-bold">record with</p>
                  <p className="text-base font-bold">measurable results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Player Section - Completely independent */}
      <section className="pb-32 -mt-4">
        <div className="w-[calc(100%-80px)] max-w-[1500px] mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-xl bg-black group cursor-pointer" style={{ height: "820px" }}>
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <div className="w-full h-full transform group-hover:scale-110 group-hover:blur-sm transition-all duration-700 ease-in-out">
                <Image 
                  src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop"
                  alt="Showreel cover"
                  width={1920}
                  height={1080}
                  className="w-full h-full object-cover grayscale"
                  unoptimized
                />
              </div>
            </div>
            
            {/* Play button and text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Play button that stays centered on hover */}
              <div 
                className="relative transform group-hover:scale-110 transition-all duration-700 ease-in-out z-10"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 group-hover:mb-0 transition-all duration-700">
                  <PlayIcon className="h-6 w-6 text-black" />
                </div>
              </div>
              
              {/* Text that fades out on hover */}
              <div className="transform group-hover:opacity-0 group-hover:translate-y-4 transition-all duration-500 ease-in-out">
                <h3 className="text-white text-2xl font-bold text-center">Watch showreel</h3>
                <p className="text-white/70 text-sm font-bold text-center">(2016-25©)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="w-[calc(100%-80px)] max-w-[1500px] mx-auto">
          {/* Section header with consistent styling */}
          <div className="grid grid-cols-1 lg:grid-cols-12 mb-16 items-start">
            {/* Left side with 'Testimonials' label */}
            <div className="lg:col-span-2 flex items-center mb-4 lg:mb-0">
              <div className="w-5 h-5 bg-black rounded-full mr-2 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 0V10M0 5H10" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
              <ScrollBlurItem>
                <span className="text-sm font-bold">Testimonials</span>
              </ScrollBlurItem>
            </div>
            
            {/* Main heading with consistent spacing */}
            <div className="lg:col-span-10 lg:pl-12">
              <ScrollBlurItem>
                <h1 className="text-[90px] md:text-[130px] lg:text-[180px] font-medium tracking-tighter leading-[0.77] text-black">
                  Experiences<span className="text-black">.</span>
                </h1>
                <p className="text-sm text-gray-500 mt-2">©2025</p>
              </ScrollBlurItem>
            </div>
          </div>

          {/* Testimonial Cards Grid - Using a custom grid layout to match the reference image */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[5px]">
            {/* Column 1 - Single tall card with rating */}
            <div className="flex flex-col h-full">
              <div className="bg-black text-white rounded-3xl p-6 flex flex-col h-full justify-between shadow-lg">
                <div className="flex items-start mb-8">
                  <div className="flex items-end">
                    <div className="text-[48px] font-medium text-black leading-none">4.9</div>
                    <div className="text-lg text-gray-500 mb-1 ml-1">/5</div>
                  </div>
                  <div className="ml-4 mt-2">
                    <p className="text-sm text-gray-600">
                      We've delivered<br />
                      56+ projects<br />
                      that help<br />
                      companies<br />
                      generate real<br />
                      results.
                    </p>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <div className="text-sm font-medium mb-2">fabrica®</div>
                  <div className="flex">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                        <Image 
                          src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1522&q=80" 
                          alt="Team member"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                        <Image 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80" 
                          alt="Team member"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                        <Image 
                          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1588&q=80" 
                          alt="Team member"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-black flex items-center justify-center text-white text-xs font-medium">
                        56+
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Trusted by clients worldwide</p>
                  </div>
                  <button className="mt-4 text-sm font-medium bg-black text-white rounded-full py-[18px] px-6 w-full hover:bg-gray-800 transition-colors">
                    Leave a review
                  </button>
                </div>
              </div>
            </div>
            
            {/* Column 2 - Single tall card with testimonial */}
            <div className="flex flex-col h-full space-y-[5px]">
              {/* Top small card with James Carter info */}
              <div className="bg-black text-white rounded-3xl p-6 flex flex-col h-full justify-between shadow-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1522&q=80" 
                      alt="James Carter"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">James Carter</h4>
                    <p className="text-sm text-gray-500">Wilson & Co</p>
                  </div>
                </div>
              </div>
              
              {/* Bottom tall card with testimonial */}
              <div className="bg-black text-white rounded-3xl p-6 flex flex-col h-full justify-between shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <button className="text-gray-400">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                
                <div className="mt-auto">
                  <p className="text-xl font-medium mb-4">
                    Incredible team! They delivered exactly what we needed, on time and beyond expectations.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Column 3 - Tall card on top, short card below */}
            <div className="flex flex-col h-full space-y-[5px]">
              {/* Top tall card */}
              <div className="bg-black text-white rounded-3xl p-6 flex flex-col h-full justify-between shadow-lg">
                <p className="text-xl font-medium mb-4">
                  A smooth process from start to finish. Highly professional team!
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <button className="text-gray-400">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Bottom short card */}
              <div className="bg-black text-white rounded-3xl p-6 flex flex-col h-full justify-between shadow-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1588&q=80" 
                      alt="Emily Davis"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Emily Davis</h4>
                    <p className="text-sm text-gray-500">StartUp Hub</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Column 4 - Short card on top, tall card below */}
            <div className="flex flex-col h-full space-y-[5px]">
              {/* Top short card */}
              <div className="bg-black text-white rounded-3xl p-6 flex flex-col h-full justify-between shadow-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80" 
                      alt="Anna Martinez"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Anna Martinez</h4>
                    <p className="text-sm text-gray-500">Marketing Director</p>
                  </div>
                </div>
              </div>
              
              {/* Bottom tall card */}
              <div className="bg-black text-white rounded-3xl p-6 flex flex-col h-full justify-between shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <button className="text-gray-400">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                
                <div className="mt-auto">
                  <p className="text-xl font-medium">
                    Our new branding is exactly what we envisioned—clean, modern, and unique. #1 in our industry.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Statistics Section with 4 metrics */}
          <div className="mt-24 bg-gray-50 rounded-3xl p-12 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Metric 1 - Ad impressions */}
              <div className="flex flex-col">
                <ScrollBlurItem>
                  <h3 className="text-6xl font-medium text-black mb-2">3m+</h3>
                  <p className="text-gray-600 font-medium">
                    Ad impressions<br />
                    managed
                  </p>
                </ScrollBlurItem>
              </div>
              
              {/* Metric 2 - Projects launched */}
              <div className="flex flex-col">
                <ScrollBlurItem>
                  <h3 className="text-6xl font-medium text-black mb-2">27+</h3>
                  <p className="text-gray-600 font-medium">
                    Successful<br />
                    projects launched
                  </p>
                </ScrollBlurItem>
              </div>
              
              {/* Metric 3 - Satisfaction rate */}
              <div className="flex flex-col">
                <ScrollBlurItem>
                  <h3 className="text-6xl font-medium text-black mb-2">98%</h3>
                  <p className="text-gray-600 font-medium">
                    Client<br />
                    satisfaction rate
                  </p>
                </ScrollBlurItem>
              </div>
              
              {/* Metric 4 - Monthly visitors */}
              <div className="flex flex-col">
                <ScrollBlurItem>
                  <h3 className="text-6xl font-medium text-black mb-2">50k+</h3>
                  <p className="text-gray-600 font-medium">
                    Monthly visitors<br />
                    driven through SEO
                  </p>
                </ScrollBlurItem>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated line separator */}
      <div className="w-[calc(100%-80px)] max-w-[1500px] mx-auto py-8 overflow-hidden">
        <ScrollBlurItem>
          <div className="border-t border-gray-200 transform origin-left transition-all duration-1000" 
               style={{ transform: "scaleX(1)", transformOrigin: "left" }}>
          </div>
        </ScrollBlurItem>
      </div>

      {/* Approach Section */}
      <section className="py-20">
        <div className="w-[calc(100%-80px)] max-w-[1500px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left column with brand and tagline */}
            <div className="md:col-span-3">
              <ScrollBlurItem>
                <div className="mb-6">
                  <p className="text-xl font-medium">fabrica®</p>
                </div>
                <p className="text-gray-600">
                  Every project we take on is<br />
                  designed for long-term success.
                </p>
              </ScrollBlurItem>
            </div>

            {/* Right column with approach text */}
            <div className="md:col-span-9">
              <ScrollBlurItem>
                <h2 className="text-3xl md:text-4xl font-medium mb-8">
                  Our approach is simple: <span className="font-bold">we focus on functionality, speed, 
                  and clarity, ensuring that every project serves a clear 
                  purpose without unnecessary complexity.</span>
                </h2>
              </ScrollBlurItem>
              
              <ScrollBlurItem>
                <p className="text-gray-600 text-lg">
                  We don't overpromise or use flashy marketing language. We simply build well-
                  designed, functional websites and strategies that help businesses succeed.
                </p>
              </ScrollBlurItem>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="py-20">
        <div className="w-[calc(100%-80px)] max-w-[1500px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left column - Case Study Card with Image */}
            <div className="lg:col-span-6">
              <ScrollBlurItem>
                <div className="rounded-3xl overflow-hidden bg-white text-black h-full relative">
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <Image 
                      src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
                      alt="Laptop on desk with website"
                      width={800}
                      height={600}
                      className="w-full h-full object-cover object-center"
                      unoptimized
                    />
                  </div>
                  
                  {/* Content overlay */}
                  <div className="relative z-10 p-8 flex flex-col h-full" style={{minHeight: "600px"}}>
                    {/* Top content */}
                    <div className="bg-amber-900/90 self-start rounded-full px-4 py-2 text-white">
                      <p className="text-white text-sm mb-0">Case study</p>
                    </div>
                    <p className="text-black/70 text-xs mt-2">UX/UI Redesign, Frontend Optimization.</p>
                    
                    {/* Middle content - logo */}
                    <div className="my-auto">
                      <h2 className="text-6xl font-medium text-black">fabrica®</h2>
                    </div>
                    
                    {/* Bottom content */}
                    <div className="mt-auto">
                      <div className="flex flex-col space-y-4">
                        <p className="text-black/80 text-sm">
                          From branding to web<br />
                          development and marketing
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-black/80 text-sm">Live website</span>
                            <svg className="ml-1 w-4 h-4 text-black/60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <span className="text-black/80 text-sm">We do it all.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollBlurItem>
            </div>
            
            {/* Right column - Performance Metrics */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[5px] h-[600px] items-start">
                {/* Performance Boost Card */}
                <div className="bg-black text-white rounded-3xl p-6 flex flex-col h-full justify-between">
                  <p className="text-gray-400 mb-4">Performance Boost:</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-4xl font-bold">Page speed</h3>
                      <p className="text-4xl font-bold text-green-600">+48%,</p>
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold">Bounce rate</h3>
                      <p className="text-4xl font-bold text-green-600">-23%</p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <p className="text-gray-400 mb-2">Conversion Rate Improvement:</p>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold">4.2%</span>
                      <svg className="mx-2 w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-2xl font-bold">5.9%</span>
                    </div>
                  </div>
                </div>
                
                {/* Page Speed Score Card */}
                <div className="bg-black text-white rounded-3xl p-6 flex flex-col h-full justify-between">
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 rounded-full border-[12px] border-gray-100"></div>
                      <div className="absolute inset-0 rounded-full border-[12px] border-black border-t-transparent border-r-transparent border-b-transparent transform -rotate-45"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold">100</span>
                      </div>
                    </div>
                    
                    <p className="mt-4 text-center text-gray-400 font-medium">Pagespeed score</p>
                    <p className="mt-2 text-center text-sm text-gray-400">
                      We prioritize performance without<br />
                      sacrificing visual appeal or<br />
                      functionality.
                    </p>
                  </div>
                </div>
                
                {/* Testimonial Card */}
                <div className="bg-black text-white rounded-3xl p-6 flex flex-col h-full justify-between shadow-lg">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-lg">
                    "Thanks to the redesign, we've seen a steady 60% increase in leads."
                  </p>
                  
                  <div className="mt-auto flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <Image 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1588&q=80" 
                        alt="Angela Smith"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <p className="font-medium">Angela Smith</p>
                  </div>
                </div>
                
                {/* Traffic Stats Card */}
                <div className="bg-black text-white rounded-3xl p-6 flex flex-col h-full justify-between shadow-lg">
                  <div className="flex items-baseline mb-1">
                    <span className="text-5xl font-bold">38K</span>
                    <span className="ml-2 text-sm text-green-600">+30%</span>
                  </div>
                  <p className="text-gray-400 text-sm">Quarterly visits</p>
                  
                  {/* Simple bar chart */}
                  <div className="mt-8">
                    <div className="flex items-end h-32 justify-between">
                      <div className="flex flex-col items-center">
                        <div className="w-8 bg-gray-100 rounded-t" style={{height: '40px'}}></div>
                        <span className="text-xs text-gray-400 mt-1">Dec</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 bg-gray-100 rounded-t" style={{height: '60px'}}></div>
                        <span className="text-xs text-gray-400 mt-1">Jan</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 bg-gray-100 rounded-t" style={{height: '70px'}}></div>
                        <span className="text-xs text-gray-400 mt-1">Feb</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 bg-gray-100 rounded-t" style={{height: '90px'}}></div>
                        <span className="text-xs text-gray-400 mt-1">Mar</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 bg-gray-100 rounded-t" style={{height: '110px'}}></div>
                        <span className="text-xs text-gray-400 mt-1">Apr</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 bg-black rounded-t" style={{height: '130px'}}></div>
                        <span className="text-xs text-gray-400 mt-1">May</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

type ServiceItemProps = {
  service: ServiceCategory;
  toggleService: (id: string) => void;
  isLast: boolean;
};

function ServiceItem({ service, toggleService, isLast }: ServiceItemProps) {
  return (
    <div className="py-6">
      <ScrollBlurItem>
        <div className="flex items-center justify-between relative">
          {/* Left side number aligned with "What we do" text */}
          <div style={{width: "160px", marginLeft: "-160px", flexShrink: 0}}>
            <span className="text-white/50 text-sm font-bold">{service.number}</span>
          </div>
          
          {/* Service title aligned with "Services" text */}
          <div style={{marginLeft: "65px", flexGrow: 1}}>
            <h3 className="text-xl md:text-2xl font-bold text-white">{service.title}</h3>
          </div>
          
          {/* Toggle button with circle positioned on the far right */}
          <div style={{marginRight: "-40px"}}>
            <button 
              onClick={() => toggleService(service.id)}
              className="w-10 h-10 rounded-full bg-black border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              {service.isOpen ? 
                <MinusIcon className="h-5 w-5 text-white" /> : 
                <PlusIcon className="h-5 w-5 text-white" />
              }
            </button>
          </div>
          
          {/* Horizontal line after the item - only show for non-expanded items */}
          {!service.isOpen && (
            <div className="absolute bottom-[-24px] left-[65px] right-0 border-t border-white/10"></div>
          )}
        </div>
      </ScrollBlurItem>
    </div>
  );
}

function ServiceExpandedContent({ service }: { service: ServiceCategory }) {
  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier curve for smooth animation
        opacity: { duration: 0.3 }
      }}
      className="overflow-hidden"
    >
      <div className="py-8 pb-12">
        <div className="flex">
          {/* Empty space to align with service number */}
          <div style={{width: "160px", marginLeft: "-160px", flexShrink: 0}}></div>
          
          <div className="flex-1" style={{marginLeft: "65px"}}>
            <div className="grid grid-cols-12 gap-10">
              {/* Service image */}
              <div className="col-span-3">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="relative w-full aspect-square rounded-lg overflow-hidden"
                >
                  <Image 
                    src="/service-web.jpg" 
                    alt={service.title}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-medium text-white">M</span>
                  </div>
                </motion.div>
              </div>
              
              {/* Service description - exactly 2 lines as in reference */}
              <div className="col-span-5">
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-white/70 leading-relaxed font-bold"
                >
                  Modern, responsive, and user-friendly websites<br />
                  designed to engage visitors and drive conversions.
                </motion.p>
              </div>
              
              {/* Categories - aligned at the same position as in reference */}
              <div className="col-span-4">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <p className="text-white/70 text-sm font-bold mb-3">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    <CategoryPill>Packaging design</CategoryPill>
                    <CategoryPill>Logo design</CategoryPill>
                    <CategoryPill>Rebranding</CategoryPill>
                    <CategoryPill>Typography</CategoryPill>
                    <CategoryPill>Guidelines</CategoryPill>
                    <CategoryPill>Visual Identity</CategoryPill>
                    <CategoryPill>UI+</CategoryPill>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add horizontal line at the bottom of expanded content */}
      <div className="h-px w-full" style={{marginLeft: "65px"}}>
        <div className="border-t border-white/10 w-[calc(100%-65px)]"></div>
      </div>
    </motion.div>
  );
}

function CategoryPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/80 font-bold hover:bg-white/10 cursor-pointer transition">
      {children}
    </div>
  );
} 