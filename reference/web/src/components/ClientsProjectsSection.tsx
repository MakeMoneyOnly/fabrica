import React from 'react';
import LogoCloud from './logo-cloud';
import Image from 'next/image';
import ScrollBlurItem from '@/components/ui/ScrollBlurItem';

// Project card component based on the reference image
const ProjectCard = ({ 
  title, 
  year, 
  imageSrc, 
  imageAlt,
  logoSrc,
  isEven = false,
  colorStatus = "white" // Can be "white", "colored", or "rgb"
}: { 
  title: string; 
  year: string; 
  imageSrc: string; 
  imageAlt: string;
  logoSrc?: string;
  isEven?: boolean;
  colorStatus?: "white" | "colored" | "rgb";
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-base">{title}.</h3>
        <div className="text-xs text-gray-500 font-light">/{year}</div>
      </div>
      <div className="relative w-full h-[320px] overflow-hidden rounded-xl bg-gray-100 shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] transition-shadow duration-300">
        <Image 
          src={imageSrc} 
          alt={imageAlt}
          fill
          className="object-cover"
          unoptimized
        />
        
        {/* Semi-transparent overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Centered logo overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white font-medium text-2xl flex items-center space-x-2">
            {/* Simple logo representation */}
            {title === "Boltshift" && (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white rounded-full mr-2"></div>
                <span>{title}</span>
              </div>
            )}
            {title === "Ephemeral" && (
              <div className="flex items-center">
                <div className="w-7 h-7 border-2 border-white rounded-full mr-2 flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                </div>
                <span>{title}</span>
              </div>
            )}
            {title === "Powersurge" && (
              <div className="flex items-center">
                <div className="w-7 h-7 bg-white text-black rounded mr-2 flex items-center justify-center font-bold text-sm">P</div>
                <span>{title}</span>
              </div>
            )}
            {title === "Mastermail" && (
              <div className="flex items-center">
                <div className="w-7 h-7 mr-2 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 8L10 14L20 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>{title}</span>
              </div>
            )}
            {title === "Warpspeed" && (
              <div className="flex items-center">
                <div className="w-8 h-4 border border-white rounded-full mr-2"></div>
                <span>{title}</span>
              </div>
            )}
            {title === "CloudWatch" && (
              <div className="flex items-center">
                <div className="w-6 h-6 bg-white rounded-full mr-2"></div>
                <span>{title}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Three-dot menu in top-right */}
        <div className="absolute top-3 right-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-full p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5" cy="12" r="1.5" fill="#FFFFFF" />
            <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
            <circle cx="19" cy="12" r="1.5" fill="#FFFFFF" />
          </svg>
        </div>
        
        {/* Status indicators */}
        <div className="absolute top-3 right-12 flex items-center space-x-1">
          {colorStatus === "white" && (
            <div className="w-3 h-3 bg-white rounded-full"></div>
          )}
          {colorStatus === "colored" && (
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          )}
          {colorStatus === "rgb" && (
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Results section with statistics
const ResultsSection = () => {
  return (
    <div className="w-full py-20 mt-20">
      <div className="w-[calc(100%-80px)] max-w-[1500px] mx-auto">
        {/* Consistent spacing with What we do section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 mb-16 md:mb-32 lg:mb-48 items-start">
          {/* Left side with 'Why choose us' */}
          <div className="lg:col-span-2 flex items-center mb-4 lg:mb-0">
              <div className="w-5 h-5 bg-black rounded-full mr-2 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 0V10M0 5H10" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
              <ScrollBlurItem>
                <span className="text-sm font-light">Why choose us</span>
              </ScrollBlurItem>
            </div>
          {/* Main heading with consistent spacing */}
          <div className="lg:col-span-10">
            <div className="lg:pl-12" style={{lineHeight: 1.05}}>
              <ScrollBlurItem>
                <h2 className="text-black font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[56px] mb-2" style={{lineHeight: 1.05}}>
                  Proven results for every project,
                </h2>
              </ScrollBlurItem>
              <ScrollBlurItem>
                <div className="text-gray-400 font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[56px]" style={{fontWeight: 400, lineHeight: 1.05}}>
                  with a focus on design and<br />
                  functionality.
                </div>
              </ScrollBlurItem>
            </div>
          </div>
        </div>

        {/* Two column layout for image and content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left column - Image */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden w-[calc(100%-80px)] max-w-[1500px] mx-auto">
            <Image
              src="https://images.unsplash.com/photo-1532939163844-547f958e91c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1548&q=80"
              alt="Road in desert with mountains"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute top-3 right-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="black" fillOpacity="0.1" />
                <path d="M8 12H16M12 8V16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Right column - Content */}
          <div>
            {/* No fluff, just results section */}
            <div className="mb-8 md:mb-16 text-right">
              <ScrollBlurItem>
                <p className="text-base md:text-xl lg:text-2xl" style={{lineHeight: 1.4, margin: 0}}>
                  <span className="font-bold text-black">No fluff, just results.</span>
                  <span style={{color: 'rgba(0,0,0,0.4)'}}>
                    &nbsp;Thoughtful design and<br />
                    tools that make your work easier. We focus on smart<br />
                    design and useful features, project after project.
                  </span>
                </p>
              </ScrollBlurItem>
            </div>

            {/* Stats and details - Updated to match reference image */}
            <div className="w-[calc(100%-80px)] max-w-[1500px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[5px]">
              {/* Left column */}
                <div className="flex flex-col gap-[5px]">
                  {/* Card 1 - 50+ */}
                  <div className="rounded-xl p-5 shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] transition-shadow duration-300 h-24 md:h-28">
                    <div className="flex justify-between items-center mb-1">
                  <ScrollBlurItem>
                        <div className="text-[40px] md:text-[48px] lg:text-[56px] font-bold text-black">50+</div>
                  </ScrollBlurItem>
                  <ScrollBlurItem>
                        <div className="text-xs text-gray-400">01</div>
                  </ScrollBlurItem>
                </div>
                </div>
                
                  {/* Card 3 - Successful projects */}
                  <div className="rounded-xl p-5 flex flex-col shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] transition-shadow duration-300 h-64 md:h-72">
                    <div className="text-right mb-auto">
                    <ScrollBlurItem>
                        <div className="text-sm font-medium">Successful projects</div>
                        <div className="text-sm font-medium">completed</div>
                    </ScrollBlurItem>
                  </div>
                  
                  <div className="mt-auto">
                    <ScrollBlurItem>
                        <div className="text-sm text-gray-600 text-right">
                        We've delivered 50+ projects that<br />
                        help companies generate real<br />
                        results.
                      </div>
                    </ScrollBlurItem>
                  </div>
                </div>
              </div>
              
              {/* Right column */}
                <div className="flex flex-col gap-[5px]">
                  {/* Card 2 - 95% */}
                  <div className="rounded-xl p-5 shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] transition-shadow duration-300 h-24 md:h-28">
                    <div className="flex justify-between items-center mb-1">
                  <ScrollBlurItem>
                        <div className="text-[40px] md:text-[48px] lg:text-[56px] font-bold text-black">95%</div>
                  </ScrollBlurItem>
                  <ScrollBlurItem>
                        <div className="text-xs text-gray-400">02</div>
                  </ScrollBlurItem>
                </div>
                  </div>
                  
                  {/* Card 4 - Customer satisfaction */}
                  <div className="rounded-xl p-5 flex flex-col shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] transition-shadow duration-300 h-64 md:h-72">
                    <div className="text-right mb-auto">
                      <ScrollBlurItem>
                        <div className="text-sm font-medium">Customer</div>
                        <div className="text-sm font-medium">satisfaction rate</div>
                      </ScrollBlurItem>
                    </div>
                    
                    <div className="mt-auto">
                    <ScrollBlurItem>
                        <div className="flex items-center justify-end">
                          <div className="w-6 h-1.5 bg-gray-300 rounded mr-3"></div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                            <span className="text-gray-500 text-sm">logoipsum</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                            <span className="text-gray-500 text-sm">Logoipsum</span>
                          </div>
                        </div>
                      </div>
                    </ScrollBlurItem>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ClientsProjectsSection() {
  // Project data with web images
  const projects = [
    { 
      title: "Boltshift", 
      year: "2025", 
      imageSrc: "https://images.unsplash.com/photo-1611930021592-a8cfd5319ceb?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvb2RpZXxlbnwwfHwwfHx8MA%3D%3D", 
      imageAlt: "Boltshift Project - Beige hoodie",
      colorStatus: "white"
    },
    { 
      title: "Ephemeral", 
      year: "2025", 
      imageSrc: "https://images.unsplash.com/photo-1559570278-eb8d71d06403?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvc2V1cCUyMGV5ZXxlbnwwfHwwfHx8MA%3D%3D", 
      imageAlt: "Ephemeral Project - Close-up of blue eye",
      colorStatus: "white"
    },
    { 
      title: "Powersurge", 
      year: "2024", 
      imageSrc: "https://images.unsplash.com/photo-1600618528240-fb9fc964eca4?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlZCUyMGNhcnxlbnwwfHwwfHx8MA%3D%3D", 
      imageAlt: "Powersurge Project - Red sports car",
      colorStatus: "white"
    },
    { 
      title: "Mastermail", 
      year: "2024", 
      imageSrc: "https://images.unsplash.com/photo-1542219550-37153b52637a?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHJlZCUyMGphY2tldHxlbnwwfHwwfHx8MA%3D%3D", 
      imageAlt: "Mastermail Project - Person in red jacket",
      colorStatus: "white"
    },
    { 
      title: "Warpspeed", 
      year: "2023", 
      imageSrc: "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmlyZCUyMG9uJTIwYnJhbmNofGVufDB8fDB8fHww", 
      imageAlt: "Warpspeed Project - Bird on branch",
      colorStatus: "white"
    },
    { 
      title: "CloudWatch", 
      year: "2020", 
      imageSrc: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFuJTIwaW4lMjBob29kfGVufDB8fDB8fHww", 
      imageAlt: "CloudWatch Project - Person in hood",
      colorStatus: "rgb"
    },
  ];

  return (
    <div className="w-full py-10 relative">
      {/* Clients Section with Header - using consistent grid pattern */}
      <div className="w-[calc(100%-80px)] max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 mb-8 items-start">
          {/* Our clients label - matching What we do positioning */}
          <div className="lg:col-span-2 flex items-center mb-4 lg:mb-0">
            <div className="w-5 h-5 bg-black rounded-full mr-2 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 0V10M0 5H10" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>
            <ScrollBlurItem>
              <span className="text-sm font-light">Our clients</span>
            </ScrollBlurItem>
          </div>
          {/* Empty space to maintain grid alignment */}
          <div className="lg:col-span-10"></div>
        </div>
        
        {/* Animated Logo Cloud - Optimized spacing */}
        <div className="mb-24">
          <LogoCloud />
        </div>
      </div>
      
      {/* Projects Section - Consistent layout with Services section */}
      <div className="w-[calc(100%-80px)] max-w-[1500px] mx-auto">
        <div className="mb-2">
          <ScrollBlurItem>
            <div className="text-xs text-gray-500 font-light">(27)</div>
          </ScrollBlurItem>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 pb-16 items-start">
          {/* Empty space to match layout pattern */}
          <div className="lg:col-span-2"></div>
          
          {/* Projects Text + Copyright */}
          <div className="lg:col-span-10 lg:pl-12">
            <ScrollBlurItem>
              <h1 className="text-[90px] md:text-[130px] lg:text-[180px] font-medium tracking-tighter leading-[0.77] text-black">
                Projects<span className="text-black">.</span>
              </h1>
            </ScrollBlurItem>
              <ScrollBlurItem>
              <p className="text-sm text-gray-500 mt-2">©2025</p>
              </ScrollBlurItem>
          
          {/* Description - Right Aligned */}
            <div className="lg:absolute right-0 bottom-8 max-w-sm text-right mt-8 lg:mt-0">
            <ScrollBlurItem>
              <p className="text-sm leading-relaxed text-gray-500 font-light">
                We've helped businesses across industries achieve their goals. Here are some of our recent projects.
              </p>
            </ScrollBlurItem>
            </div>
          </div>
        </div>

        {/* Project Cards Grid - 6 cards in 2 columns with adjusted spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {projects.map((project, index) => (
            <ScrollBlurItem key={project.title}>
              <ProjectCard 
                title={project.title}
                year={project.year}
                imageSrc={project.imageSrc}
                imageAlt={project.imageAlt}
                colorStatus={project.colorStatus as "white" | "colored" | "rgb"}
                isEven={index % 2 === 1}
              />
            </ScrollBlurItem>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <ResultsSection />
    </div>
  );
} 