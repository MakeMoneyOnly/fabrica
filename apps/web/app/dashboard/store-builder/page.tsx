'use client';

import { SketchPicker, ColorResult } from 'react-color';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import DraggableItem from '@/components/dnd/DraggableItem';
import DroppableColumn from '@/components/dnd/DroppableColumn';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  ArrowRight,
  PlusCircle,
  Link as LinkIcon,
  BookOpen,
  Download,
  Video
} from 'lucide-react';
import Link from 'next/link';

// --- TEMPLATE DATA ---
const unsplashImage = (seed: string) => `https://source.unsplash.com/random/100x100?portrait&sig=${seed}`;

const templates = [
  {
    id: 'minima',
    name: 'Minima',
    component: MinimaTemplate,
    colors: [{ primary: '#2563EB', secondary: '#EFF6FF' }, { primary: '#DB2777', secondary: '#FCE7F3' }],
    fonts: ['Inter', 'Roboto', 'Lato']
  },
  {
    id: 'aurora',
    name: 'Aurora',
    component: AuroraTemplate,
    colors: [{ primary: '#EC4899', secondary: '#FDF2F8' }, { primary: '#8B5CF6', secondary: '#F5F3FF' }],
    fonts: ['Playfair Display', 'Lora', 'Merriweather']
  },
  {
    id: 'stone',
    name: 'Stone',
    component: StoneTemplate,
    colors: [{ primary: '#FBBF24', secondary: '#FEFCE8' }, { primary: '#10B981', secondary: '#F0FDF4' }],
    fonts: ['Poppins', 'Montserrat', 'Oswald']
  },
  {
    id: 'cezanne',
    name: 'Cezanne',
    component: CezanneTemplate,
    colors: [{ primary: '#4FD1C5', secondary: '#1A202C' }, { primary: '#F6AD55', secondary: '#1A202C' }],
    fonts: ['Inter', 'Roboto', 'Lato']
  },
  {
    id: 'foucault',
    name: 'Foucault',
    component: FoucaultTemplate,
    colors: [{ primary: '#D53F8C', secondary: '#FFF5F7' }, { primary: '#805AD5', secondary: '#FAF5FF' }],
    fonts: ['Lora', 'Playfair Display', 'Merriweather']
  },
  {
    id: 'brimblecombe',
    name: 'Brimblecombe',
    component: BrimblecombeTemplate,
    colors: [{ primary: '#4299E1', secondary: '#FFFFFF' }, { primary: '#48BB78', secondary: '#FFFFFF' }],
    fonts: ['Montserrat', 'Poppins', 'Lato']
  }
];

interface TemplateProps {
  preview?: boolean;
  color?: { primary: string; secondary: string };
  font?: string;
  components?: { id: string; content: React.ReactNode }[];
}

// --- TEMPLATE COMPONENTS ---
function MinimaTemplate({
  preview = false,
  color = templates[0].colors[0],
  font = 'Inter',
  components = [],
}: TemplateProps) {
  return (
    <div
      className={`w-full h-full p-4 bg-white text-center`}
      style={{ fontFamily: font }}
    >
      <img src={unsplashImage('alexa')} alt="Alexa Ishibashi" className="w-24 h-24 rounded-full mx-auto mb-2 border-4 border-white shadow-md"/>
      <h2 className="font-bold text-xl">Alexa Ishibashi</h2>
      <p className="text-sm text-gray-500 mb-4">Creator Success Manager @ Stan</p>
      <div className="flex justify-center gap-4 text-gray-400 mb-6">
        <p>TikTok</p>
        <p>IG</p>
      </div>
      <div className="space-y-3">
        {components.map((component) => (
          <div key={component.id}>{component.content}</div>
        ))}
        <div
          style={{ backgroundColor: color.primary, color: 'white' }}
          className="p-4 rounded-lg font-semibold"
        >Book a 1:1 Strategy Session with Me!</div>
        <div style={{ backgroundColor: color.secondary }} className="p-4 rounded-lg">
          <p className="font-semibold mb-2" style={{ color: color.primary }}>January 2024</p>
          <div className="grid grid-cols-7 text-xs gap-1">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            {[...Array(31).keys()].map(i => <span key={i} className="p-1">{i+1}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuroraTemplate({
  preview = false,
  color = templates[1].colors[0],
  font = 'Playfair Display',
  components = [],
}: TemplateProps) {
  const bgStyle = {
    backgroundImage: `url(${unsplashImage('aurora-bg')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };
  return (
    <div className={`w-full h-full p-4 text-white text-center`} style={{ fontFamily: font }}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10">
        <img src={unsplashImage('angelica')} alt="Angelica Kauffman" className="w-24 h-24 rounded-full mx-auto mb-2 border-4 shadow-lg" style={{ borderColor: color.primary }}/>
        <h2 className="font-bold text-2xl">Angelica Kauffman</h2>
        <p className="text-sm text-gray-200 mb-6">Mindfulness Coach</p>
        <div className="space-y-3">
          {components.map((component) => (
            <div key={component.id}>{component.content}</div>
          ))}
          <div
            className="backdrop-blur-sm p-4 rounded-lg font-semibold"
            style={{ backgroundColor: `${color.primary}80` }}
          >The Mindful Morning Course - $29.99</div>
          <div
            className="backdrop-blur-sm p-4 rounded-lg font-semibold"
            style={{ backgroundColor: `${color.primary}80` }}
          >Free Mindfulness Checklist</div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg font-semibold">Check out my podcast</div>
        </div>
      </div>
    </div>
  );
}

function StoneTemplate({
  preview = false,
  color = templates[2].colors[0],
  font = 'Poppins',
  components = [],
}: TemplateProps) {
    return (
    <div className={`w-full h-full p-4 text-center overflow-y-auto`} style={{ backgroundColor: color.secondary, fontFamily: font }}>
      <div className="flex items-center gap-4 mb-4">
        <img src={unsplashImage('stone')} alt="Stone Fredrickson" className="w-20 h-20 rounded-full border-4 border-white shadow-md"/>
        <div>
          <h2 className="font-bold text-xl text-left">Stone Fredrickson</h2>
          <p className="text-sm text-gray-600 text-left">Digital Creator</p>
        </div>
      </div>
      <div className="space-y-3">
        {components.map((component) => (
          <div key={component.id}>{component.content}</div>
        ))}
        <div className="bg-white p-4 rounded-lg text-left flex items-center gap-3 shadow-sm">
          <BookOpen className="w-6 h-6" style={{ color: color.primary }}/>
          <div>
            <p className="font-semibold">1:1 Coaching Session</p>
            <p className="text-sm text-gray-500">$79.99</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg text-left flex items-center gap-3 shadow-sm">
          <Video className="w-6 h-6" style={{ color: color.primary }}/>
          <div>
            <p className="font-semibold">Creator Monetization Blueprint</p>
            <p className="text-sm text-gray-500">$49.99</p>
          </div>
        </div>
        <div className="text-black p-4 rounded-lg text-center font-semibold shadow-sm" style={{ backgroundColor: color.primary }}>
          Get Started with Stan
        </div>
      </div>
    </div>
  );
}

function CezanneTemplate({
  preview = false,
  color = templates[3].colors[0],
  font = 'Inter',
  components = [],
}: TemplateProps) {
  return (
    <div className={`w-full h-full p-4 bg-gray-900 text-white text-center`} style={{ fontFamily: font }}>
      <img src={unsplashImage('cezanne')} alt="Paul Cezanne" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-700 shadow-lg"/>
      <h2 className="font-bold text-2xl">Paul Cezanne</h2>
      <p className="text-sm text-gray-400 mb-6">Modern Painter</p>
      <div className="space-y-3 text-left">
        {components.map((component) => (
          <div key={component.id}>{component.content}</div>
        ))}
        <div className="flex items-center gap-4 p-2 rounded-lg" style={{ backgroundColor: '#2d3748' }}>
          <img src={unsplashImage('art1')} alt="Artwork 1" className="w-12 h-12 rounded-md object-cover"/>
          <div>
            <p className="font-semibold">Digital Print #1</p>
            <p className="text-sm" style={{ color: color.primary }}>$19.99</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-2 rounded-lg" style={{ backgroundColor: '#2d3748' }}>
          <img src={unsplashImage('art2')} alt="Artwork 2" className="w-12 h-12 rounded-md object-cover"/>
          <div>
            <p className="font-semibold">Exclusive Brush Set</p>
            <p className="text-sm" style={{ color: color.primary }}>$45.00</p>
          </div>
        </div>
        <div className="p-3 rounded-lg font-semibold text-center" style={{ backgroundColor: color.primary }}>
          Book a private lesson
        </div>
      </div>
    </div>
  );
}

function FoucaultTemplate({
  preview = false,
  color = templates[4].colors[0],
  font = 'Lora',
  components = [],
}: TemplateProps) {
  return (
    <div className={`w-full h-full p-4 text-center`} style={{ backgroundColor: color.secondary, fontFamily: font }}>
      <img src={unsplashImage('foucault')} alt="Michelle Foucault" className="w-20 h-20 rounded-full mx-auto mb-2 shadow-md"/>
      <h2 className="font-bold text-xl" style={{ color: color.primary }}>Michelle Foucault</h2>
      <p className="text-sm text-gray-500 mb-6">Philosopher & Thinker</p>
      <div className="space-y-2">
        {components.map((component) => (
          <div key={component.id}>{component.content}</div>
        ))}
        <div className="p-3 rounded-md font-semibold" style={{ backgroundColor: color.primary, color: 'white' }}>Read my latest essay</div>
        <div className="p-3 rounded-md font-semibold border" style={{ color: color.primary, borderColor: color.primary }}>My Book on Amazon</div>
        <div className="p-3 rounded-md font-semibold border" style={{ color: color.primary, borderColor: color.primary }}>Book a 1:1 Philosophy Session</div>
        <div className="p-3 rounded-md font-semibold border" style={{ color: color.primary, borderColor: color.primary }}>My Notion Templates</div>
      </div>
    </div>
  );
}

function BrimblecombeTemplate({
  preview = false,
  color = templates[5].colors[0],
  font = 'Montserrat',
  components = [],
}: TemplateProps) {
  return (
    <div className={`w-full h-full p-4 bg-white text-left`} style={{ fontFamily: font }}>
      <div className="flex items-center gap-4 mb-4">
        <img src={unsplashImage('brimblecombe')} alt="Tyla Brimblecombe" className="w-16 h-16 rounded-full shadow-md"/>
        <div>
          <h2 className="font-bold text-lg">Tyla Brimblecombe</h2>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4" style={{ color: color.primary }} fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
            ))}
            <span className="text-xs text-gray-500 ml-1">5.0</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">Helping you build a successful online business.</p>
      <div className="grid grid-cols-2 gap-2">
        {components.map((component) => (
          <div key={component.id} className="col-span-2">
            {component.content}
          </div>
        ))}
        <div className="bg-gray-100 rounded-lg p-2">
            <img src={unsplashImage('course1')} alt="Course 1" className="w-full h-16 object-cover rounded-md mb-2"/>
            <p className="font-semibold text-xs">The Passive Income Playbook</p>
            <p className="text-xs" style={{ color: color.primary }}>$199</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-2">
            <img src={unsplashImage('course2')} alt="Course 2" className="w-full h-16 object-cover rounded-md mb-2"/>
            <p className="font-semibold text-xs">Content Creator Starter Kit</p>
             <p className="text-xs" style={{ color: color.primary }}>$79</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-2">
            <img src={unsplashImage('course3')} alt="Course 3" className="w-full h-16 object-cover rounded-md mb-2"/>
            <p className="font-semibold text-xs">Apply for my Mentorship</p>
        </div>
         <div className="bg-gray-100 rounded-lg p-2 flex items-center justify-center">
            <p className="font-semibold text-xs">Get Started</p>
        </div>
      </div>
    </div>
  );
}

// --- iPhone Mockup Component ---
function IphoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
      <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
      <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white dark:bg-gray-800">
        {children}
      </div>
    </div>
  );
}


// --- MAIN PAGE COMPONENT ---
export default function StoreBuilderPage() {
  const [activeTab, setActiveTab] = useState('edit-design');
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(templates[0].colors[0]);
  const [selectedFont, setSelectedFont] = useState(templates[0].fonts[0]);
  const [columns, setColumns] = useState({
    components: {
      id: 'components',
      title: 'Components',
      items: [
        { id: '1', content: 'Hero Section' },
        { id: '2', content: 'Product List' },
        { id: '3', content: 'Featured Video' },
      ],
    },
    storeLayout: {
      id: 'storeLayout',
      title: 'Store Layout',
      items: [],
    },
  });

  const componentLibrary = {
    Header: ({ title, subtitle }: { title: string; subtitle: string }) => (
      <div className="text-center p-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-500">{subtitle}</p>
      </div>
    ),
    Button: ({ text, link }: { text: string; link: string }) => (
      <a
        href={link}
        className="block w-full p-4 text-center bg-blue-500 text-white rounded-lg"
      >
        {text}
      </a>
    ),
    TextBlock: ({ text }: { text: string }) => <p className="p-4">{text}</p>,
  };

  const handleColorChange = (color: ColorResult) => {
    setSelectedColor({ ...selectedColor, primary: color.hex });
  };
  const TemplateComponent = templates[currentTemplateIndex].component;
  
  const prevTemplate = () => {
    const newIndex = (currentTemplateIndex - 1 + templates.length) % templates.length;
    setCurrentTemplateIndex(newIndex);
    setSelectedColor(templates[newIndex].colors[0]);
    setSelectedFont(templates[newIndex].fonts[0]);
  };
  const nextTemplate = () => {
    const newIndex = (currentTemplateIndex + 1) % templates.length;
    setCurrentTemplateIndex(newIndex);
    setSelectedColor(templates[newIndex].colors[0]);
    setSelectedFont(templates[newIndex].fonts[0]);
  };

  const onDragEnd: OnDragEndResponder = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId as keyof typeof columns];
    const destColumn = columns[destination.droppableId as keyof typeof columns];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  };

  const currentTemplate = templates[currentTemplateIndex];

  return (
    <div className="space-y-6 h-full flex flex-col bg-gray-50/50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Store</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
              <Button
                variant="ghost"
                className={`p-1 h-auto ${
                  activeTab === 'store'
                    ? 'text-black border-b-2 border-black font-semibold'
                    : ''
                }`}
                onClick={() => setActiveTab('store')}
              >
                Store
              </Button>
              <Button
                variant="ghost"
                className={`p-1 h-auto ${
                  activeTab === 'landing-pages'
                    ? 'text-black border-b-2 border-black font-semibold'
                    : ''
                }`}
                onClick={() => setActiveTab('landing-pages')}
              >
                Landing Pages
              </Button>
              <Button
                variant="ghost"
                className={`p-1 h-auto ${
                  activeTab === 'edit-design'
                    ? 'text-black border-b-2 border-black font-semibold'
                    : ''
                }`}
                onClick={() => setActiveTab('edit-design')}
              >
                Edit Design
              </Button>
              <Button
                variant="ghost"
                className={`p-1 h-auto ${
                  activeTab === 'components'
                    ? 'text-black border-b-2 border-black font-semibold'
                    : ''
                }`}
                onClick={() => setActiveTab('components')}
              >
                Components
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden md:inline">fabrica.store/yourname</span>
            <Button>Copy</Button>
          </div>
        </div>
      </div>

      {activeTab === 'edit-design' && (
        <div className="flex-1 flex gap-8 items-start justify-center px-6">
          {/* Center Panel: Template Carousel & Customization */}
          <div className="flex-1 max-w-4xl mt-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Choose your template</h2>
              <p className="text-gray-500">Select a template to start designing your store.</p>
            </div>

            <div className="relative h-[500px]">
              <div className="absolute inset-0 flex items-center justify-center">
                {templates.map((template, index) => {
                  const isActive = index === currentTemplateIndex;
                  const offset = index - currentTemplateIndex;

                  // Basic carousel logic: only show active, previous, and next
                  if (Math.abs(offset) > 1) {
                    return null;
                  }

                  const transform = `translateX(${offset * 40}%) scale(${isActive ? 1 : 0.8})`;
                  const zIndex = isActive ? 10 : 5;
                  const opacity = isActive ? 1 : 0.4;
                  const pointerEvents = isActive ? 'auto' : 'none';

                  const TemplateComponent = template.component;

                  return (
                    <div
                      key={template.id}
                      className="w-72 h-[480px] rounded-2xl shadow-lg overflow-hidden absolute transition-all duration-300 ease-in-out"
                      style={{
                        transform,
                        zIndex,
                        opacity,
                        pointerEvents,
                      }}
                    >
                      <div className="w-full h-full relative group cursor-pointer" onClick={() => setCurrentTemplateIndex(index)}>
                        <TemplateComponent preview={true} />
                        {!isActive && <div className="absolute inset-0 bg-white/60 dark:bg-black/60"></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button variant="ghost" size="icon" onClick={prevTemplate} className="absolute top-1/2 -translate-y-1/2 left-0 z-20 bg-white hover:bg-gray-100 rounded-full shadow-md"><ArrowLeft /></Button>
              <Button variant="ghost" size="icon" onClick={nextTemplate} className="absolute top-1/2 -translate-y-1/2 right-0 z-20 bg-white hover:bg-gray-100 rounded-full shadow-md"><ArrowRight /></Button>
            </div>
            
            <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg">
               <div className="text-center mb-4">
                  <p className="font-semibold text-xl">{currentTemplate.name}</p>
                </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="font-semibold text-sm">Colors</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="w-8 h-8 rounded-full border-2"
                            style={{
                              backgroundColor: selectedColor.primary,
                              borderColor: selectedColor.primary,
                            }}
                          />
                        </PopoverTrigger>
                        <PopoverContent>
                          <SketchPicker
                            color={selectedColor.primary}
                            onChangeComplete={handleColorChange}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Font</p>
                    <select
                      onChange={(e) => setSelectedFont(e.target.value)}
                      value={selectedFont}
                      className="mt-2 text-base border-gray-300 rounded-md"
                    >
                       {currentTemplate.fonts.map(font => <option key={font} value={font}>{font}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <Button variant="outline" className="mr-2">Cancel</Button>
                  <Button>Save</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Mobile Preview */}
          <div className="w-96 flex-shrink-0 sticky top-24">
            <IphoneMockup>
              <TemplateComponent
                color={selectedColor}
                font={selectedFont}
                components={columns.storeLayout.items}
              />
            </IphoneMockup>
          </div>
        </div>
      )}
      {activeTab === 'components' && (
        <div className="p-6">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-3 gap-6">
              <DroppableColumn column={columns.components} />
              <DroppableColumn column={columns.storeLayout} />
              <div className="p-4 bg-gray-100 rounded-md">
                <h3 className="font-bold mb-4">Preview</h3>
                <div className="bg-white p-4 rounded-md">
                  {columns.storeLayout.items.length > 0 ? (
                    columns.storeLayout.items.map((item) => (
                      <div key={item.id}>{item.content}</div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400">
                      Drop components here
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DragDropContext>
        </div>
      )}
    </div>
  );
}