import { useState } from "react";
import ScrollBlurItem from '@/components/ui/ScrollBlurItem';
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
      title: "No-Code Store Builder",
      description: "Drag-and-drop storefront creation with Ethiopian payment integration - WeBirr, TeleBirr, and CBE Birr support.",
      image: "/service-web.jpg",
      isOpen: true
    },
    {
      id: "002",
      number: "(002)",
      title: "Zero Transaction Fees",
      description: "Keep 100% of your earnings with no platform fees on sales, unlike traditional marketplaces.",
      image: "/service-social.jpg",
      isOpen: false
    },
    {
      id: "003",
      number: "(003)",
      title: "Ethiopian Creator Community",
      description: "Connect with fellow Ethiopian creators, collaborate on projects, and grow together in our local ecosystem.",
      image: "/service-seo.jpg",
      isOpen: false
    },
    {
      id: "004",
      number: "(004)",
      title: "Mobile-Optimized Experience",
      description: "Native mobile apps for creators to manage stores, track sales, and engage customers on the go.",
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

              {/* Updated Services list */}
              <div className="mt-20">
                {services.map((service) => (
                  <div key={service.id}>
                    <ServiceItem
                      service={service}
                      toggleService={toggleService}
                    />

                    <AnimatePresence>
                      {service.isOpen && (
                        <ServiceExpandedContent />
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* CTA Button - Responsive alignment */}
              <ScrollBlurItem>
                <div className="mt-24 pl-0 lg:pl-32">
                  <a
                    href="#"
                    className="inline-block rounded-full border border-white/20 bg-white text-black px-8 py-4 font-bold hover:bg-white/90 transition"
                  >
                    Get started
                  </a>
                </div>
              </ScrollBlurItem>
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
};

function ServiceItem({ service, toggleService }: ServiceItemProps) {
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
              {service.isOpen ? (
                <MinusIcon className="h-5 w-5 text-white" />
              ) : (
                <PlusIcon className="h-5 w-5 text-white" />
              )}
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

function ServiceExpandedContent() {
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
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                    <span className="text-3xl font-medium text-white">CREATOR</span>
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
                  Secure payment processing and instant delivery systems<br />
                  designed for global creator transactions and downloads.
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
                    <CategoryPill>Digital Market</CategoryPill>
                    <CategoryPill>Payment Gateway</CategoryPill>
                    <CategoryPill>Instant Delivery</CategoryPill>
                    <CategoryPill>Creator Tools</CategoryPill>
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
