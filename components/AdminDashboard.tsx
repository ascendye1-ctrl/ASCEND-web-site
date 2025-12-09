import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  AlertTriangle, 
  ArrowRight, 
  DollarSign, 
  Package,
  LayoutDashboard,
  Palette,
  Megaphone,
  Settings,
  Store,
  Menu,
  X,
  Plus,
  HelpCircle,
  Upload,
  ChevronDown,
  ChevronRight,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Eye,
  Trash2,
  GripVertical,
  Edit3,
  Zap,
  Search,
  Filter,
  MoreHorizontal,
  LayoutGrid,
  List as ListIcon,
  Save,
  Check,
  Copy,
  Download,
  Barcode,
  RefreshCw,
  Globe,
  Truck,
  Layers,
  Image as ImageIcon,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ShieldCheck,
  PieChart,
  Lock,
  Server,
  Activity,
  FileKey,
  CheckCircle,
  Shield,
  Clock,
  MapPin,
  Phone,
  FolderTree,
  Move,
  User,
  Mail,
  UserPlus,
  BarChart2,
  TrendingDown,
  Target,
  Smile,
  Meh,
  Frown,
  ThumbsUp,
  Search as SearchIcon,
  FileText,
  MessageCircle,
  Star,
  Database,
  FileUp,
  Play,
  Wand2,
  Video,
  ImagePlus,
  Sparkles
} from 'lucide-react';
import { Language, ViewState, Payout, Product, Customer, Order, MarketingCampaign, Pipeline, TransformationRule } from '../types';
import { translations } from '../utils/translations';
import ThemeEditor from './ThemeEditor';
import { INITIAL_PRODUCTS } from '../App';
import DiagnosticsPanel from './DiagnosticsPanel';
import { saveImageToDB, getImageFromDB } from '../services/localDB';
import { optimizeImage } from '../utils/imageOptimizer';
import { generateMarketingImage, editProductImage, generateProductVideo } from '../services/geminiService';

interface AdminDashboardProps {
  language: Language;
  onNavigate: (view: ViewState) => void;
}

// --- Unified Resource Manager Component ---
interface ResourceManagerProps<T> {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  data: T[];
  renderHeader: () => React.ReactNode;
  renderRow: (item: T, index: number) => React.ReactNode;
  onAdd?: () => void;
  actionLabel?: string;
  language: Language;
}

const ResourceManager = <T extends { id: string | number }>({
  title,
  subtitle,
  icon: Icon,
  data,
  renderHeader,
  renderRow,
  onAdd,
  actionLabel,
  language
}: ResourceManagerProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const isRtl = language === 'ar';

  const filteredData = data.filter(item => 
    JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in flex flex-col h-full">
       {/* Header */}
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
              <h2 className="text-2xl font-black text-brand-navy dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-brand-navy/5 dark:bg-white/5 rounded-lg">
                    <Icon className="w-6 h-6 text-brand-navy dark:text-brand-lime" />
                  </div>
                  {title}
              </h2>
              <p className="text-gray-500 mt-1 ml-1">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                  <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRtl ? 'right-3' : 'left-3'}`} />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full sm:w-64 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-brand-navy dark:focus:ring-brand-lime transition-all ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
                  />
              </div>
              {onAdd && (
                <button 
                  onClick={onAdd}
                  className="bg-brand-navy text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-brand-navy/20 hover:bg-brand-navy/90 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" /> {actionLabel || 'Add New'}
                </button>
              )}
          </div>
       </div>

       {/* Table Container */}
       <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden flex-1 flex flex-col">
           <div className="overflow-x-auto flex-1">
               <table className="w-full text-left border-collapse">
                   <thead className="bg-gray-50 dark:bg-slate-950 sticky top-0 z-10 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                       {renderHeader()}
                   </thead>
                   <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                       {filteredData.length > 0 ? (
                           filteredData.map((item, index) => renderRow(item, index))
                       ) : (
                           <tr>
                               <td colSpan={100} className="p-12 text-center text-gray-500">
                                   <div className="flex flex-col items-center justify-center">
                                       <Search className="w-12 h-12 text-gray-300 mb-4" />
                                       <p>No results found for "{searchTerm}"</p>
                                   </div>
                               </td>
                           </tr>
                       )}
                   </tbody>
               </table>
           </div>
           
           {/* Pagination Footer (Static Mock) */}
           <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 flex items-center justify-between text-xs font-bold text-gray-500">
               <span>Showing {Math.min(filteredData.length, 10)} of {filteredData.length} entries</span>
               <div className="flex gap-2">
                   <button className="px-3 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50">Prev</button>
                   <button className="px-3 py-1 bg-brand-navy text-white rounded">1</button>
                   <button className="px-3 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded hover:bg-gray-100 dark:hover:bg-slate-700">2</button>
                   <button className="px-3 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded hover:bg-gray-100 dark:hover:bg-slate-700">3</button>
                   <button className="px-3 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded hover:bg-gray-100 dark:hover:bg-slate-700">Next</button>
               </div>
           </div>
       </div>
    </div>
  );
};


// --- Creative Studio View ---
const CreativeStudioView: React.FC<{ language: Language }> = ({ language }) => {
    const [mode, setMode] = useState<'generate' | 'edit' | 'video'>('generate');
    const [prompt, setPrompt] = useState('');
    const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasKey, setHasKey] = useState(true); // Assuming true initially, will check for Veo

    // Initial check for API Key presence for Veo
    useEffect(() => {
        if (mode === 'video') {
             // @ts-ignore
             const checkKey = async () => { if (window.aistudio && window.aistudio.hasSelectedApiKey) {
                 // @ts-ignore
                 const has = await window.aistudio.hasSelectedApiKey();
                 setHasKey(has);
             }};
             checkKey();
        }
    }, [mode]);

    const handleSelectKey = async () => {
        // @ts-ignore
        if (window.aistudio && window.aistudio.openSelectKey) {
             // @ts-ignore
            await window.aistudio.openSelectKey();
            // Race condition mitigation: Assume success
            setHasKey(true);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleAction = async () => {
        setIsLoading(true);
        setResultUrl(null);
        try {
            if (mode === 'generate') {
                const url = await generateMarketingImage(prompt, imageSize);
                setResultUrl(url);
            } else if (mode === 'edit') {
                if (!selectedImage) throw new Error("Please upload an image first.");
                const url = await editProductImage(selectedImage, prompt);
                setResultUrl(url);
            } else if (mode === 'video') {
                if (!selectedImage) throw new Error("Please upload an image first.");
                if (!hasKey) {
                    await handleSelectKey(); // Prompt again if somehow false
                }
                const url = await generateProductVideo(selectedImage, prompt || "Animate this product naturally");
                setResultUrl(url);
            }
        } catch (error) {
            console.error(error);
            alert("Generation failed. See console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-brand-navy dark:text-white flex items-center gap-2">
                <Wand2 className="w-6 h-6 text-brand-lime" /> Creative Studio
            </h2>
            
            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 dark:border-slate-800">
                <button 
                  onClick={() => { setMode('generate'); setPrompt(''); setSelectedImage(null); setResultUrl(null); }}
                  className={`pb-3 text-sm font-bold ${mode === 'generate' ? 'text-brand-navy border-b-2 border-brand-navy dark:text-brand-lime dark:border-brand-lime' : 'text-gray-500'}`}
                >
                    Generate Image (Pro)
                </button>
                <button 
                  onClick={() => { setMode('edit'); setPrompt(''); setSelectedImage(null); setResultUrl(null); }}
                  className={`pb-3 text-sm font-bold ${mode === 'edit' ? 'text-brand-navy border-b-2 border-brand-navy dark:text-brand-lime dark:border-brand-lime' : 'text-gray-500'}`}
                >
                    Edit Image (Flash)
                </button>
                <button 
                  onClick={() => { setMode('video'); setPrompt(''); setSelectedImage(null); setResultUrl(null); }}
                  className={`pb-3 text-sm font-bold ${mode === 'video' ? 'text-brand-navy border-b-2 border-brand-navy dark:text-brand-lime dark:border-brand-lime' : 'text-gray-500'}`}
                >
                    Animate (Veo)
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
                
                {/* Inputs */}
                <div className="space-y-6">
                    {/* Image Upload for Edit/Video */}
                    {(mode === 'edit' || mode === 'video') && (
                        <div>
                             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Source Image</label>
                             <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-slate-800 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors relative overflow-hidden">
                                    {selectedImage ? (
                                        <img src={selectedImage} alt="Source" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Prompt Input */}
                    <div>
                         <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                             {mode === 'edit' ? 'Editing Instruction' : 'Prompt'}
                         </label>
                         <textarea 
                           className="w-full p-4 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-navy outline-none"
                           rows={3}
                           placeholder={mode === 'edit' ? "e.g., Add a retro filter, remove background person" : "Describe the image or video..."}
                           value={prompt}
                           onChange={(e) => setPrompt(e.target.value)}
                         />
                    </div>

                    {/* Size Config for Generate */}
                    {mode === 'generate' && (
                         <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Resolution</label>
                            <div className="flex gap-4">
                                {['1K', '2K', '4K'].map(s => (
                                    <button 
                                        key={s}
                                        onClick={() => setImageSize(s as any)}
                                        className={`px-4 py-2 rounded-lg font-bold text-sm border ${imageSize === s ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                         </div>
                    )}
                    
                    {/* Veo API Key Check */}
                    {mode === 'video' && !hasKey && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                             Video generation requires a paid API Key. 
                             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline ml-1 font-bold">Billing Info</a>
                             <button 
                                onClick={handleSelectKey}
                                className="block mt-2 px-4 py-2 bg-yellow-600 text-white rounded font-bold hover:bg-yellow-700"
                             >
                                 Select API Key
                             </button>
                        </div>
                    )}

                    <button 
                        onClick={handleAction}
                        disabled={isLoading || (mode !== 'generate' && !selectedImage) || (mode === 'video' && !hasKey)}
                        className="w-full py-4 bg-brand-navy text-white rounded-xl font-bold shadow-lg shadow-brand-navy/20 hover:bg-brand-navy/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                              <RefreshCw className="w-5 h-5 animate-spin" /> Processing...
                            </>
                        ) : (
                            <>
                              <Sparkles className="w-5 h-5" /> {mode === 'generate' ? 'Generate' : mode === 'edit' ? 'Edit Image' : 'Generate Video'}
                            </>
                        )}
                    </button>
                </div>

                {/* Result Area */}
                {resultUrl && (
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-800">
                        <h3 className="font-bold text-lg mb-4">Result</h3>
                        <div className="rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 flex items-center justify-center min-h-[300px]">
                            {mode === 'video' ? (
                                <video src={resultUrl} controls autoPlay loop className="max-w-full max-h-[500px]" />
                            ) : (
                                <img src={resultUrl} alt="Generated result" className="max-w-full max-h-[500px]" />
                            )}
                        </div>
                        <a 
                          href={resultUrl} 
                          download={`ascend-creative-${Date.now()}.${mode === 'video' ? 'mp4' : 'png'}`}
                          className="mt-4 inline-flex items-center gap-2 text-brand-navy dark:text-brand-lime font-bold hover:underline"
                        >
                            <Download className="w-4 h-4" /> Download Result
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Sub-Components Definition ---

const ProductsView: React.FC<{ language: Language; }> = ({ language }) => {
    // Helper to get localized name
    const getName = (p: Product) => (language === 'ar' && p.nameAr) ? p.nameAr : p.name;
    const isRtl = language === 'ar';

    return (
        <ResourceManager 
            title="Products Catalog"
            subtitle="Manage your inventory, pricing, and product details."
            icon={Package}
            language={language}
            data={INITIAL_PRODUCTS}
            actionLabel="Add Product"
            onAdd={() => alert("Add Product Modal would open here.")}
            renderHeader={() => (
                <tr>
                    <th className="p-4 pl-6">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                </tr>
            )}
            renderRow={(product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="p-4 pl-6">
                        <div className="flex items-center gap-4">
                            <img src={product.image} className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200 dark:border-slate-700" alt={getName(product)} />
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{getName(product)}</h4>
                                <p className="text-xs text-gray-500">{product.brand || 'No Brand'}</p>
                            </div>
                        </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                        {language === 'ar' && product.categoryAr ? product.categoryAr : product.category}
                    </td>
                    <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${product.inStock ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </td>
                    <td className="p-4 text-sm font-mono text-gray-600 dark:text-gray-300">
                        {product.inStock ? Math.floor(Math.random() * 50) + 10 : 0} units
                    </td>
                    <td className="p-4 font-bold text-brand-navy dark:text-white">
                        ${product.price.toFixed(2)}
                    </td>
                    <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-gray-400 hover:text-brand-navy dark:hover:text-white transition-colors" title="Edit">
                                <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                </tr>
            )}
        />
    );
};

const OrdersView: React.FC<{ language: Language }> = ({ language }) => {
    // Mock Data
    const mockOrders: Order[] = Array.from({ length: 15 }).map((_, i) => ({
        id: `ORD-2025-${1000 + i}`,
        customerName: ['Alex Johnson', 'Sarah Connor', 'Mike Ross', 'Harvey Specter', 'Donna Paulsen'][i % 5],
        date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
        total: Math.floor(Math.random() * 200) + 50,
        status: ['delivered', 'processing', 'shipped', 'pending', 'cancelled'][i % 5] as any,
        itemsCount: Math.ceil(Math.random() * 4),
        paymentMethod: ['Visa **** 4242', 'PayPal', 'Mastercard **** 8888'][i % 3],
        paymentStatus: ['paid', 'paid', 'paid', 'pending', 'failed'][i % 5] as any
    }));

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        cancelled: 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-400',
    };

    return (
        <ResourceManager 
            title="Order Management"
            subtitle="Track and manage customer orders and fulfillment."
            icon={ShoppingBag}
            language={language}
            data={mockOrders}
            actionLabel="Create Order"
            onAdd={() => {}}
            renderHeader={() => (
                <tr>
                    <th className="p-4 pl-6">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Fulfillment</th>
                    <th className="p-4">Total</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                </tr>
            )}
            renderRow={(order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 pl-6 font-mono text-xs font-bold text-gray-900 dark:text-white">
                        {order.id}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                        {order.customerName}
                        <div className="text-xs text-gray-400">{order.itemsCount} items</div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                        {order.date}
                    </td>
                    <td className="p-4">
                        <div className="flex items-center gap-2">
                             <span className={`w-2 h-2 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                             <span className="text-xs text-gray-600 dark:text-gray-300">{order.paymentMethod}</span>
                        </div>
                    </td>
                    <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusColors[order.status]}`}>
                            {order.status}
                        </span>
                    </td>
                    <td className="p-4 font-bold text-gray-900 dark:text-white">
                        ${order.total.toFixed(2)}
                    </td>
                    <td className="p-4 text-right pr-6">
                         <button className="text-brand-navy dark:text-brand-lime hover:underline text-xs font-bold">View Details</button>
                    </td>
                </tr>
            )}
        />
    );
};

const CustomersView: React.FC<{ language: Language }> = ({ language }) => {
    // Mock Customers
    const mockCustomers: Customer[] = Array.from({ length: 12 }).map((_, i) => ({
        id: `CUS-${100+i}`,
        name: ['Emma Thompson', 'James Wilson', 'Olivia Davis', 'William Brown', 'Sophia Miller'][i % 5],
        email: `customer${i}@example.com`,
        phone: '+1 234 567 8900',
        totalSpent: Math.floor(Math.random() * 1000) + 100,
        ordersCount: Math.floor(Math.random() * 20) + 1,
        lastOrderDate: '2 days ago',
        status: i % 4 === 0 ? 'inactive' : 'active',
        segment: ['VIP', 'Loyal', 'New', 'At Risk'][i % 4] as any,
        avatar: `https://ui-avatars.com/api/?name=${['Emma', 'James', 'Olivia', 'William'][i % 4]}&background=random`
    }));

    return (
        <ResourceManager 
            title="Customer Base"
            subtitle="View customer profiles, segments, and lifetime value."
            icon={Users}
            language={language}
            data={mockCustomers}
            actionLabel="Add Customer"
            onAdd={() => {}}
            renderHeader={() => (
                <tr>
                    <th className="p-4 pl-6">Customer</th>
                    <th className="p-4">Segment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Orders</th>
                    <th className="p-4">Total Spent</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                </tr>
            )}
            renderRow={(customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                             <img src={customer.avatar} className="w-8 h-8 rounded-full" alt="" />
                             <div>
                                 <div className="font-bold text-sm text-gray-900 dark:text-white">{customer.name}</div>
                                 <div className="text-xs text-gray-500">{customer.email}</div>
                             </div>
                        </div>
                    </td>
                    <td className="p-4">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                             customer.segment === 'VIP' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                             customer.segment === 'New' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                             customer.segment === 'At Risk' ? 'bg-red-50 text-red-600 border-red-200' :
                             'bg-gray-50 text-gray-600 border-gray-200'
                         }`}>
                             {customer.segment}
                         </span>
                    </td>
                    <td className="p-4">
                         {customer.status === 'active' ? (
                             <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                                 <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Active
                             </div>
                         ) : (
                             <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                                 <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Inactive
                             </div>
                         )}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                        {customer.ordersCount}
                    </td>
                    <td className="p-4 font-bold text-gray-900 dark:text-white">
                        ${customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="p-4 text-right pr-6">
                         <button className="text-gray-400 hover:text-brand-navy dark:hover:text-white">
                             <MoreHorizontal className="w-4 h-4" />
                         </button>
                    </td>
                </tr>
            )}
        />
    );
};

const MarketingView: React.FC<{ language: Language }> = ({ language }) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-gray-100 dark:border-slate-800 text-center animate-fade-in">
    <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-bold text-brand-navy dark:text-white">Marketing Campaigns</h3>
    <p className="text-gray-500">Create campaigns, track ad spend, and view ROI.</p>
  </div>
);

const FinanceView: React.FC<{ language: Language }> = ({ language }) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-gray-100 dark:border-slate-800 text-center animate-fade-in">
    <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-bold text-brand-navy dark:text-white">Financial Overview</h3>
    <p className="text-gray-500">Monitor revenue, expenses, and payouts.</p>
  </div>
);

const SettingsView: React.FC<{ language: Language }> = ({ language }) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-gray-100 dark:border-slate-800 text-center animate-fade-in">
    <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-bold text-brand-navy dark:text-white">Store Settings</h3>
    <p className="text-gray-500">Configure store preferences, payments, and shipping.</p>
  </div>
);

const AnalyticsView: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language].dashboard.analytics;
    const [activeTab, setActiveTab] = useState<'business' | 'brand'>('business');
    return (
        <div className="animate-fade-in space-y-8">
            <h2 className="text-2xl font-bold text-brand-navy dark:text-white flex items-center gap-2">
                <BarChart2 className="w-6 h-6 text-brand-lime" /> {t.title}
            </h2>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl text-center border border-gray-100 dark:border-slate-800">
                <BarChart2 className="w-16 h-16 text-gray-200 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Analytics Dashboard Loaded</h3>
                <p className="text-gray-500">View performance metrics, brand health, and growth indicators here.</p>
            </div>
        </div>
    );
};

// --- Data Studio (ETL Tool) ---
const DataStudioView: React.FC<{ language: Language }> = ({ language }) => {
  const t = translations[language].dashboard.etl;
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [mappings, setMappings] = useState<TransformationRule[]>([]);
  const [pipelineStatus, setPipelineStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  // Target schema (e.g., Product Database)
  const targetFields = [
    { key: 'name', label: 'Product Name' },
    { key: 'price', label: 'Price' },
    { key: 'category', label: 'Category' },
    { key: 'stock', label: 'Inventory Count' },
    { key: 'sku', label: 'SKU' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCsvFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        if (lines.length > 0) {
          const headers = lines[0].split(',').map(h => h.trim());
          setCsvHeaders(headers);
          
          // Initial Mapping Guess
          const newMappings = headers.map(header => ({
             sourceField: header,
             targetField: '',
             transform: 'none' as const
          }));
          setMappings(newMappings);

          // Preview first 5 rows
          const preview = lines.slice(1, 6).map(line => line.split(','));
          setPreviewData(preview);
          setStep(2);
        }
      };
      reader.readAsText(file);
    }
  };

  const updateMapping = (index: number, field: keyof TransformationRule, value: string) => {
     const newMappings = [...mappings];
     // @ts-ignore
     newMappings[index][field] = value;
     setMappings(newMappings);
  };

  const runPipeline = async () => {
     setPipelineStatus('running');
     setStep(3);
     
     // Simulate processing
     for(let i = 0; i <= 100; i+=10) {
         setProgress(i);
         await new Promise(r => setTimeout(r, 200));
     }
     
     setPipelineStatus('success');
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-5xl mx-auto">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
              <h2 className="text-2xl font-bold text-brand-navy dark:text-white flex items-center gap-2">
                  <Database className="w-6 h-6 text-brand-lime" /> {t.title}
              </h2>
              <p className="text-sm text-gray-500">{t.subtitle}</p>
          </div>
          <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">History</button>
              <button className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">Templates</button>
          </div>
       </div>

       {/* Stepper */}
       <div className="flex items-center justify-between px-4 sm:px-12">
           {[
               { num: 1, label: t.upload, icon: FileUp },
               { num: 2, label: t.map, icon: Layers },
               { num: 3, label: t.load, icon: Play }
           ].map((s) => (
               <div key={s.num} className="flex flex-col items-center gap-2 relative z-10 text-center">
                   <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                       step >= s.num ? 'bg-brand-navy text-white' : 'bg-gray-100 text-gray-400 dark:bg-slate-800'
                   }`}>
                       <s.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                   </div>
                   <span className={`text-[10px] sm:text-xs font-bold ${step >= s.num ? 'text-brand-navy dark:text-white' : 'text-gray-400'}`}>{s.label}</span>
               </div>
           ))}
           {/* Connecting Line */}
           <div className="absolute left-4 right-4 sm:left-12 sm:right-12 top-[6.5rem] sm:top-48 h-0.5 bg-gray-100 dark:bg-slate-800 -z-0 mx-10 hidden md:block" />
       </div>

       <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-100 dark:border-slate-800 p-4 sm:p-8 min-h-[400px]">
           {step === 1 && (
               <div className="h-full flex flex-col items-center justify-center space-y-6 py-12">
                   <div className="w-24 h-24 bg-brand-navy/5 dark:bg-brand-lime/10 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-brand-navy/20 dark:border-brand-lime/20 animate-pulse">
                       <Upload className="w-10 h-10 text-brand-navy dark:text-brand-lime" />
                   </div>
                   <div className="text-center">
                       <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload Data Source</h3>
                       <p className="text-sm text-gray-500 mb-6">Support CSV, JSON, or Excel files</p>
                       <label className="cursor-pointer bg-brand-navy text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-navy/90 transition-all shadow-lg shadow-brand-navy/20">
                           Select File
                           <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                       </label>
                   </div>
                   <div className="text-xs text-gray-400">Max file size: 50MB</div>
               </div>
           )}

           {step === 2 && (
               <div className="space-y-6">
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                       <h3 className="font-bold text-lg text-gray-900 dark:text-white">Configure Schema Mapping</h3>
                       <span className="text-xs bg-brand-navy/10 text-brand-navy px-2 py-1 rounded font-mono truncate max-w-full">{csvFile?.name}</span>
                   </div>

                   <div className="bg-gray-50 dark:bg-slate-950 rounded-xl p-1 overflow-hidden">
                       <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-900 font-bold text-xs uppercase tracking-wider text-gray-500">
                           <div>{t.sourceColumn}</div>
                           <div>{t.transformation}</div>
                           <div>{t.targetField}</div>
                       </div>
                       <div className="max-h-[300px] overflow-y-auto p-4 space-y-3">
                           {mappings.map((rule, idx) => (
                               <div key={idx} className="grid grid-cols-3 gap-2 sm:gap-4 items-center">
                                   <div className="flex items-center gap-2 overflow-hidden">
                                       <div className="w-2 h-2 rounded-full bg-gray-300 shrink-0"></div>
                                       <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate" title={rule.sourceField}>{rule.sourceField}</span>
                                   </div>
                                   <div>
                                       <select 
                                         value={rule.transform}
                                         onChange={(e) => updateMapping(idx, 'transform', e.target.value)}
                                         className="w-full text-xs p-2 rounded bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
                                       >
                                           <option value="none">Direct</option>
                                           <option value="uppercase">UPPER</option>
                                           <option value="lowercase">lower</option>
                                           <option value="trim">Trim</option>
                                           <option value="currency_usd">USD $</option>
                                       </select>
                                   </div>
                                   <div className="flex items-center gap-2">
                                       <ArrowRight className="w-4 h-4 text-gray-400 hidden sm:block" />
                                       <select 
                                          value={rule.targetField}
                                          onChange={(e) => updateMapping(idx, 'targetField', e.target.value)}
                                          className="flex-1 text-sm p-2 rounded bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-navy w-full"
                                       >
                                           <option value="">-- Ignore --</option>
                                           {targetFields.map(f => (
                                               <option key={f.key} value={f.key}>{f.label}</option>
                                           ))}
                                       </select>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>

                   <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                       <button onClick={() => setStep(1)} className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium">Back</button>
                       <button 
                         onClick={runPipeline}
                         className="px-6 py-2 bg-brand-navy text-white rounded-lg font-bold hover:bg-brand-navy/90 shadow-lg shadow-brand-navy/20 flex items-center gap-2"
                       >
                           <Play className="w-4 h-4" /> Run Pipeline
                       </button>
                   </div>
               </div>
           )}

           {step === 3 && (
               <div className="flex flex-col items-center justify-center py-12 space-y-8">
                   {pipelineStatus === 'running' && (
                       <>
                         <div className="relative w-32 h-32 flex items-center justify-center">
                             <svg className="animate-spin w-full h-full text-brand-navy" viewBox="0 0 24 24">
                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                             </svg>
                             <span className="absolute text-xl font-bold">{progress}%</span>
                         </div>
                         <h3 className="text-lg font-bold text-gray-900 dark:text-white">Processing Records...</h3>
                         <p className="text-gray-500">Transforming {csvHeaders.length * 10} rows</p>
                       </>
                   )}

                   {pipelineStatus === 'success' && (
                       <>
                         <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                             <Check className="w-12 h-12 text-green-600 dark:text-green-400" />
                         </div>
                         <div className="text-center">
                             <h3 className="text-2xl font-black text-brand-navy dark:text-white mb-2">Import Successful!</h3>
                             <p className="text-gray-500 mb-6">Data has been transformed and loaded into the Staging Database.</p>
                             <button 
                                onClick={() => { setStep(1); setPipelineStatus('idle'); }}
                                className="px-6 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-700"
                             >
                                 Start New Pipeline
                             </button>
                         </div>
                       </>
                   )}
               </div>
           )}
       </div>
    </div>
  );
};


const AdminDashboard: React.FC<AdminDashboardProps> = ({ language, onNavigate }) => {
  const t = translations[language].dashboard;
  const isRtl = language === 'ar';
  
  const [activeView, setActiveView] = useState<'overview' | 'products' | 'orders' | 'customers' | 'design' | 'marketing' | 'analytics' | 'finance' | 'etl' | 'settings' | 'creative'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Theme Editor Mode
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false);

  if (isThemeEditorOpen) {
      return <ThemeEditor language={language} onExit={() => setIsThemeEditorOpen(false)} />;
  }

  // Define sidebar menu
  const menuItems = [
    { id: 'overview', label: t.sidebar.overview, icon: LayoutDashboard },
    { id: 'products', label: t.sidebar.products, icon: Package },
    { id: 'orders', label: t.sidebar.orders, icon: ShoppingBag },
    { id: 'customers', label: t.sidebar.customers, icon: Users },
    { id: 'finance', label: t.sidebar.finance, icon: DollarSign },
    { id: 'analytics', label: t.sidebar.analytics, icon: BarChart2 },
    { id: 'marketing', label: t.sidebar.marketing, icon: Megaphone },
    { id: 'creative', label: 'AI Studio', icon: Wand2 }, // New Item
    { id: 'design', label: t.sidebar.design, icon: Palette },
    { id: 'etl', label: t.sidebar.etl, icon: Database }, 
    { id: 'settings', label: t.sidebar.settings, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark font-sans flex text-left rtl:text-right" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-brand-navy dark:bg-slate-900 text-white transform transition-transform duration-300 ease-in-out shadow-2xl
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? (isRtl ? 'translate-x-0 right-0 left-auto' : 'translate-x-0') : (isRtl ? 'translate-x-full right-0 left-auto' : '-translate-x-full')}
      `}>
         <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-brand-lime flex items-center justify-center">
                    <Store className="w-5 h-5 text-brand-navy" />
                </div>
                <span className="font-bold text-xl tracking-tight">ASCEND</span>
            </div>
            <button className="lg:hidden text-white/70 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
                <X className="w-6 h-6" />
            </button>
         </div>

         <nav className="px-3 py-4 space-y-1">
            {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { 
                      if(item.id === 'design') {
                          setIsThemeEditorOpen(true);
                      } else {
                          setActiveView(item.id as any);
                      }
                      setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      activeView === item.id 
                      ? 'bg-brand-lime text-brand-navy font-bold shadow-lg shadow-brand-lime/20' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                    <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-brand-navy' : 'text-gray-400 group-hover:text-white'}`} />
                    <span>{item.label}</span>
                    {item.id === 'orders' && (
                        <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
                    )}
                </button>
            ))}
         </nav>

         <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/20">
             <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 border-2 border-white/20"></div>
                 <div>
                     <p className="text-sm font-bold">Admin User</p>
                     <p className="text-xs text-white/50">store_owner@ascend.com</p>
                 </div>
             </div>
             <button 
                onClick={() => onNavigate('HOME')}
                className="w-full flex items-center justify-center gap-2 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
             >
                 <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} /> {t.sidebar.backToStore}
             </button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen relative scroll-smooth">
          {/* Top Bar (Mobile Toggle) */}
          <div className="lg:hidden p-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between sticky top-0 z-30 shadow-sm">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-brand-navy dark:text-white">
                  <Menu className="w-6 h-6" />
              </button>
              <span className="font-bold text-brand-navy dark:text-white">Dashboard</span>
              <div className="w-6"></div>
          </div>

          <div className="p-4 sm:p-8 max-w-7xl mx-auto pb-24 h-full">
             {activeView === 'overview' && (
                 <div className="animate-fade-in space-y-8">
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                         <div>
                            <h1 className="text-3xl font-black text-brand-navy dark:text-white">{t.title}</h1>
                            <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
                         </div>
                         <button className="bg-brand-navy text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-brand-navy/30 hover:bg-brand-navy/90 transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                             <Plus className="w-4 h-4" /> {t.addProduct}
                         </button>
                     </div>

                     {/* KPI Cards */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {[
                             { title: t.revenue, value: "$48,250", trend: "+12.5%", icon: DollarSign, color: "bg-green-100 text-green-600" },
                             { title: t.orders, value: "1,204", trend: "+8.2%", icon: ShoppingBag, color: "bg-blue-100 text-blue-600" },
                             { title: t.lowStock, value: "4 Items", trend: "Action Needed", icon: AlertTriangle, color: "bg-orange-100 text-orange-600" }
                         ].map((stat, i) => (
                             <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                                 <div className="flex justify-between items-start mb-4">
                                     <div className={`p-3 rounded-xl ${stat.color} dark:bg-opacity-10`}>
                                         <stat.icon className="w-6 h-6" />
                                     </div>
                                     <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">{stat.trend}</span>
                                 </div>
                                 <h3 className="text-3xl font-black text-brand-navy dark:text-white mb-1">{stat.value}</h3>
                                 <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">{stat.title}</p>
                             </div>
                         ))}
                     </div>
                     
                     {/* Launch Checklist */}
                     <div className="bg-gradient-to-r from-brand-navy to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-brand-lime opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                         <h3 className="text-xl font-bold mb-6 relative z-10">{t.checklistTitle}</h3>
                         <div className="space-y-4 relative z-10">
                             {[t.step1, t.step2, t.step3].map((step, i) => (
                                 <div key={i} className="flex items-center gap-4">
                                     <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${i === 0 ? 'bg-brand-lime border-brand-lime text-brand-navy' : 'border-white/30 text-transparent'}`}>
                                         <Check className="w-3 h-3" />
                                     </div>
                                     <span className={i === 0 ? 'font-bold text-white' : 'text-white/60'}>{step}</span>
                                 </div>
                             ))}
                         </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                         <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                             <h3 className="font-bold text-lg mb-4 text-brand-navy dark:text-white">{t.recentActivity}</h3>
                             <div className="space-y-4">
                                 {[1,2,3].map(i => (
                                     <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer">
                                         <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                                             <ShoppingBag className="w-5 h-5 text-gray-500" />
                                         </div>
                                         <div className="flex-1">
                                             <p className="text-sm font-bold text-brand-navy dark:text-white">New Order #10{20+i}</p>
                                             <p className="text-xs text-gray-500">2 minutes ago • $120.00</p>
                                         </div>
                                         <ChevronRight className="w-4 h-4 text-gray-400" />
                                     </div>
                                 ))}
                             </div>
                         </div>
                         
                         {/* Diagnostics Widget */}
                         <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                             <DiagnosticsPanel />
                         </div>
                     </div>
                 </div>
             )}

             {activeView === 'products' && (
                 <ProductsView language={language} />
             )}
             
             {activeView === 'orders' && (
                 <OrdersView language={language} />
             )}

             {activeView === 'customers' && (
                 <CustomersView language={language} />
             )}

             {activeView === 'marketing' && <MarketingView language={language} />}
             {activeView === 'finance' && <FinanceView language={language} />}
             {activeView === 'settings' && <SettingsView language={language} />}
             {activeView === 'analytics' && <AnalyticsView language={language} />}
             {activeView === 'etl' && <DataStudioView language={language} />}
             {activeView === 'creative' && <CreativeStudioView language={language} />}
          </div>
      </main>
    </div>
  );
};

export default AdminDashboard;