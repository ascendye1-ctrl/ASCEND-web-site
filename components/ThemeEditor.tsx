
import React, { useState } from 'react';
import { 
  LayoutTemplate, 
  Palette, 
  Type, 
  Move, 
  Monitor, 
  Smartphone, 
  Undo, 
  Redo, 
  Save, 
  X,
  GripVertical,
  ChevronRight,
  ChevronDown,
  Quote,
  Layout,
  ShoppingBag,
  PlusCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Menu
} from 'lucide-react';
import Hero from './Hero';
import ProductList from './ProductList';
import Testimonials from './Testimonials';
import { Language } from '../types';
import { INITIAL_PRODUCTS } from '../App';

interface ThemeEditorProps {
  language: Language;
  onExit: () => void;
}

type SectionType = 'hero' | 'products' | 'testimonials' | 'newsletter';
type TabType = 'sections' | 'colors' | 'typography';

interface SectionItem {
  id: string;
  type: SectionType;
  visible: boolean;
  label: string;
}

const ThemeEditor: React.FC<ThemeEditorProps> = ({ language, onExit }) => {
  const [activeTab, setActiveTab] = useState<TabType>('sections');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Active Sections State with Visibility
  const [activeSections, setActiveSections] = useState<SectionItem[]>([
    { id: 'sec-1', type: 'hero', visible: true, label: 'Hero Banner' },
    { id: 'sec-2', type: 'products', visible: true, label: 'Featured Collection' },
    { id: 'sec-3', type: 'testimonials', visible: true, label: 'Testimonials' }
  ]);
  
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  
  // Mock Settings State
  const [primaryColor, setPrimaryColor] = useState('#1e3a8a');
  const [secondaryColor, setSecondaryColor] = useState('#bef264');
  const [font, setFont] = useState('Inter');

  // Sidebar drag source
  const availableComponents = [
    { type: 'hero', label: 'Image Banner', icon: ImageIcon },
    { type: 'products', label: 'Product Grid', icon: ShoppingBag },
    { type: 'testimonials', label: 'Testimonials', icon: Quote },
  ];

  const toggleSectionVisibility = (id: string) => {
    setActiveSections(prev => prev.map(sec => 
      sec.id === id ? { ...sec, visible: !sec.visible } : sec
    ));
  };

  const handleDragStart = (e: React.DragEvent, type: SectionType) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type, origin: 'sidebar' }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleListDragStart = (e: React.DragEvent, id: string) => {
    setDraggedSectionId(id);
    e.dataTransfer.setData('application/json', JSON.stringify({ id, origin: 'list' }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDropIndex(index);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    
    if (data.origin === 'sidebar') {
      // Add new section
      const newSection: SectionItem = {
        id: `sec-${Date.now()}`,
        type: data.type,
        visible: true,
        label: availableComponents.find(c => c.type === data.type)?.label || 'Section'
      };
      const newSections = [...activeSections];
      newSections.splice(index, 0, newSection);
      setActiveSections(newSections);
    } else if (data.origin === 'list') {
      // Reorder existing
      const draggedIdx = activeSections.findIndex(s => s.id === data.id);
      if (draggedIdx > -1) {
        const newSections = [...activeSections];
        const [removed] = newSections.splice(draggedIdx, 1);
        // Adjust index if dragging downwards
        const targetIndex = index > draggedIdx ? index - 1 : index;
        newSections.splice(targetIndex, 0, removed);
        setActiveSections(newSections);
      }
    }
    
    setDraggedSectionId(null);
    setDropIndex(null);
  };

  const handleDragLeave = () => {
    setDropIndex(null);
  };

  const renderSectionComponent = (type: SectionType) => {
    switch (type) {
      case 'hero':
        return <Hero language={language} />;
      case 'products':
        return <ProductList products={INITIAL_PRODUCTS} onProductClick={() => {}} onAddToCart={() => {}} language={language} />;
      case 'testimonials':
        return <Testimonials />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 dark:bg-gray-900 flex flex-col h-screen overflow-hidden font-sans">
      {/* Top Bar */}
      <div className="h-14 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 shadow-sm z-30">
        <div className="flex items-center gap-4">
            <button onClick={onExit} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                <X className="w-5 h-5 text-gray-500" />
            </button>
            <div className="h-6 w-px bg-gray-300 dark:bg-slate-600 hidden sm:block"></div>
            <span className="font-bold text-gray-900 dark:text-white truncate hidden sm:inline">Theme Editor</span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-500 hidden sm:inline">Draft</span>
        </div>
        
        {/* Mobile Sidebar Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-md ${isSidebarOpen ? 'bg-brand-navy text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
            >
              <Menu className="w-5 h-5" />
            </button>
        </div>

        <div className="hidden sm:flex items-center gap-2">
             <button className="p-2 text-gray-400 hover:text-gray-600">
                 <Undo className="w-5 h-5" />
             </button>
             <button className="p-2 text-gray-400 hover:text-gray-600">
                 <Redo className="w-5 h-5" />
             </button>
             <button className="ml-2 flex items-center gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
                 <Save className="w-4 h-4" />
                 Save
             </button>
        </div>
        {/* Mobile Save (Small) */}
        <button className="sm:hidden p-2 text-brand-navy dark:text-brand-lime">
            <Save className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Mobile Overlay / Desktop Fixed */}
        <div className={`
            absolute inset-y-0 left-0 z-20 w-80 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col shadow-xl transition-transform duration-300 ease-in-out
            lg:relative lg:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
           {/* Sidebar Tabs */}
           <div className="flex border-b border-gray-200 dark:border-slate-700">
              <button 
                onClick={() => setActiveTab('sections')}
                className={`flex-1 py-4 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-colors ${activeTab === 'sections' ? 'border-brand-navy text-brand-navy dark:border-brand-lime dark:text-brand-lime' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
              >
                  Sections
              </button>
              <button 
                onClick={() => setActiveTab('colors')}
                className={`flex-1 py-4 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-colors ${activeTab === 'colors' ? 'border-brand-navy text-brand-navy dark:border-brand-lime dark:text-brand-lime' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
              >
                  Colors
              </button>
               <button 
                onClick={() => setActiveTab('typography')}
                className={`flex-1 py-4 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-colors ${activeTab === 'typography' ? 'border-brand-navy text-brand-navy dark:border-brand-lime dark:text-brand-lime' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
              >
                  Type
              </button>
           </div>

           {/* Sidebar Content */}
           <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {activeTab === 'sections' && (
                  <div className="space-y-6">
                      
                      {/* Accordion Group - Page Sections */}
                      <div className="space-y-2">
                         <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Page Layout</h3>
                            <button className="text-xs text-brand-navy hover:underline dark:text-brand-lime">Add Section</button>
                         </div>
                         
                         <div className="space-y-1" onDragOver={(e) => e.preventDefault()}>
                            {activeSections.map((section, idx) => (
                              <div 
                                key={section.id}
                                draggable
                                onDragStart={(e) => handleListDragStart(e, section.id)}
                                onDragOver={(e) => handleDragOver(e, idx)}
                                onDrop={(e) => handleDrop(e, idx)}
                                className={`group flex items-center justify-between p-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-sm hover:border-brand-navy dark:hover:border-brand-lime transition-all cursor-move ${draggedSectionId === section.id ? 'opacity-50' : ''}`}
                              >
                                 <div className="flex items-center gap-3">
                                    <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                                    <span className={`text-sm font-medium ${!section.visible ? 'text-gray-400' : 'text-gray-700 dark:text-white'}`}>
                                      {section.label}
                                    </span>
                                 </div>
                                 <button 
                                  onClick={() => toggleSectionVisibility(section.id)}
                                  className="text-gray-400 hover:text-brand-navy dark:hover:text-brand-lime"
                                 >
                                    {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                 </button>
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                          <p className="text-xs text-gray-400 font-medium uppercase mb-3">Available Components</p>
                          <div className="space-y-2">
                              {availableComponents.map((component) => (
                                  <div 
                                    key={component.type}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, component.type as SectionType)}
                                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 border border-transparent rounded-lg cursor-grab hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all"
                                  >
                                      <div className="p-1.5 bg-gray-200 dark:bg-slate-900 rounded text-gray-500">
                                          <component.icon className="w-4 h-4" />
                                      </div>
                                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{component.label}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'colors' && (
                  <div className="space-y-6">
                      <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Brand Primary</label>
                          <div className="flex items-center gap-3">
                              <input 
                                type="color" 
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="h-10 w-10 rounded border-0 cursor-pointer" 
                              />
                              <input 
                                type="text" 
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-md text-sm bg-transparent dark:text-white"
                              />
                          </div>
                      </div>
                       <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Brand Secondary</label>
                          <div className="flex items-center gap-3">
                              <input 
                                type="color" 
                                value={secondaryColor}
                                onChange={(e) => setSecondaryColor(e.target.value)}
                                className="h-10 w-10 rounded border-0 cursor-pointer" 
                              />
                              <input 
                                type="text" 
                                value={secondaryColor}
                                onChange={(e) => setSecondaryColor(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-md text-sm bg-transparent dark:text-white"
                              />
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'typography' && (
                  <div className="space-y-6">
                      <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Headings Font</label>
                          <select 
                            value={font} 
                            onChange={(e) => setFont(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-md text-sm bg-transparent dark:text-white"
                          >
                              <option value="Inter">Inter</option>
                              <option value="Roboto">Roboto</option>
                              <option value="Playfair Display">Playfair Display</option>
                          </select>
                      </div>
                  </div>
              )}
           </div>
        </div>

        {/* Live Preview Area */}
        <div className="flex-1 bg-gray-100 dark:bg-slate-900/50 overflow-y-auto p-4 sm:p-8 flex justify-center relative z-10" onClick={() => setIsSidebarOpen(false)}>
            
            {/* Floating Device Toggle */}
            <div 
                className="fixed bottom-6 right-8 z-30 flex gap-1 p-1 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-gray-200 dark:border-slate-700"
                onClick={(e) => e.stopPropagation()} 
            >
               <button 
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded-full transition-all ${previewMode === 'desktop' ? 'bg-brand-navy text-white' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Desktop View"
               >
                 <Monitor className="w-5 h-5" />
               </button>
               <button 
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded-full transition-all ${previewMode === 'mobile' ? 'bg-brand-navy text-white' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Mobile View"
               >
                 <Smartphone className="w-5 h-5" />
               </button>
            </div>

            {/* Website Frame */}
            <div 
                className={`bg-white dark:bg-brand-dark shadow-2xl min-h-[800px] transition-all duration-300 transform origin-top ${previewMode === 'mobile' ? 'w-[375px] rounded-[2rem] border-8 border-gray-800 my-4' : 'w-full max-w-[1200px]'}`}
                style={{
                    // Injecting mock CSS variables for live color preview
                    // In a real app, this would update a Context or CSS-in-JS theme
                    '--brand-navy': primaryColor, 
                    '--brand-lime': secondaryColor
                } as React.CSSProperties}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Simulated Header (Static for this editor) */}
                <div className={`border-b border-gray-100 dark:border-slate-800 p-4 opacity-50 pointer-events-none grayscale ${previewMode === 'mobile' ? 'rounded-t-[1.5rem]' : ''}`}>
                    <div className="flex justify-between items-center">
                       <div className="h-6 bg-gray-200 dark:bg-slate-700 w-24 rounded"></div>
                       <div className="flex gap-2">
                          <div className="h-6 w-6 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                          <div className="h-6 w-6 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                       </div>
                    </div>
                </div>

                {/* Drop Zone at Top */}
                <div 
                    onDragOver={(e) => handleDragOver(e, 0)}
                    onDrop={(e) => handleDrop(e, 0)}
                    onDragLeave={handleDragLeave}
                    className={`h-4 transition-all duration-200 ${dropIndex === 0 ? 'h-20 bg-brand-lime/20 border-2 border-dashed border-brand-lime flex items-center justify-center text-brand-lime font-bold' : 'hover:h-8'}`}
                >
                    {dropIndex === 0 && <span className="flex items-center gap-2"><PlusCircle className="w-5 h-5"/> Drop Here</span>}
                </div>

                {/* Rendered Sections */}
                {activeSections.map((section, index) => {
                    if (!section.visible) return null;

                    return (
                      <React.Fragment key={section.id}>
                          <div className="relative group">
                              {/* Component Wrapper */}
                              <div className="relative border-2 border-transparent hover:border-brand-navy/50 transition-colors">
                                  {renderSectionComponent(section.type)}
                              </div>
                          </div>

                          {/* Drop Zone Between Sections */}
                          <div 
                              onDragOver={(e) => handleDragOver(e, index + 1)}
                              onDrop={(e) => handleDrop(e, index + 1)}
                              onDragLeave={handleDragLeave}
                              className={`transition-all duration-200 ${dropIndex === index + 1 ? 'h-24 my-2 bg-brand-lime/20 border-2 border-dashed border-brand-lime rounded-lg flex items-center justify-center text-brand-lime font-bold' : 'h-2 hover:h-8 hover:bg-brand-navy/5'}`}
                          >
                              {dropIndex === index + 1 && <span className="flex items-center gap-2"><PlusCircle className="w-5 h-5"/> Drop Here</span>}
                          </div>
                      </React.Fragment>
                    );
                })}

                 {/* Simulated Footer */}
                 <div className={`bg-gray-900 p-8 mt-8 opacity-50 pointer-events-none grayscale ${previewMode === 'mobile' ? 'rounded-b-[1.5rem]' : ''}`}>
                     <div className="h-4 bg-gray-700 w-1/4 mb-4 rounded"></div>
                     <div className="h-4 bg-gray-700 w-1/3 rounded"></div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeEditor;
