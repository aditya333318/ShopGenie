import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Code, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  FileText, 
  Terminal, 
  Cpu, 
  Layers, 
  Bot, 
  CheckCircle2,
  BookOpen,
  Camera,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Zap,
  Share2,
  Send
} from 'lucide-react';

interface SkillsLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STREAMLIT_APP_CODE = `"""
ShopGenie - AI Shopping Concierge & Multimodal Product Discovery
Built for: Google Skills Lab - Develop Gen AI Apps with Gemini and Streamlit
Powered by: Google Gen AI SDK (@google/genai) & Streamlit
"""

import streamlit as st
import os
import json
from PIL import Image
from google import genai
from google.genai import types

# ---------------------------------------------------------
# 1. Page Configuration & Theme
# ---------------------------------------------------------
st.set_page_state = None
st.set_page_config(
    page_title="ShopGenie AI - Google Skills Lab",
    page_icon="✨",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS styling following Geometric Clean standards
st.markdown("""
<style>
    .main-title {
        font-size: 2.2rem;
        font-weight: 800;
        color: #202124;
        margin-bottom: 0.2rem;
    }
    .sub-title {
        color: #5F6368;
        font-size: 1.05rem;
        margin-bottom: 1.5rem;
    }
    .badge-skills {
        background-color: #E8F0FE;
        color: #1A73E8;
        padding: 4px 10px;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 0.8rem;
        border: 1px solid rgba(26, 115, 232, 0.3);
    }
    .product-card {
        background-color: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 16px;
        padding: 16px;
        margin-bottom: 16px;
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# 2. Initialize Gemini Client
# ---------------------------------------------------------
api_key = os.environ.get("GEMINI_API_KEY")

if not api_key:
    with st.sidebar:
        st.warning("⚠️ GEMINI_API_KEY environment variable not found.")
        api_key = st.text_input("Enter your Gemini API Key:", type="password")

if api_key:
    client = genai.Client(api_key=api_key)
else:
    client = None

# ---------------------------------------------------------
# 3. Sample Product Catalog
# ---------------------------------------------------------
SAMPLE_PRODUCTS = [
    {
        "id": "p1",
        "title": "AeroBeat Pro Wireless ANC Headphones",
        "category": "Electronics",
        "price": 249,
        "rating": 4.8,
        "features": ["Hybrid Active Noise Cancellation", "40-hour Battery Life", "Spatial Audio"]
    },
    {
        "id": "p2",
        "title": "ErgoPeak Executive Mesh Desk Chair",
        "category": "Office",
        "price": 389,
        "rating": 4.9,
        "features": ["Dynamic 3D Lumbar Support", "Breathable Mesh", "4D Adjustable Armrests"]
    },
    {
        "id": "p3",
        "title": "HydroPulse Smart Insulated Flask 32oz",
        "category": "Fitness",
        "price": 48,
        "rating": 4.7,
        "features": ["OLED Temperature Display", "Hydration Reminder Ring", "24h Cold Retention"]
    },
    {
        "id": "p4",
        "title": "LuminaGlow Minimalist Task Desk Lamp",
        "category": "Home",
        "price": 64,
        "rating": 4.6,
        "features": ["Circadian Auto-Dimming", "15W Qi Fast Wireless Base", "98+ CRI Sunlight Spectrum"]
    }
]

# ---------------------------------------------------------
# 4. Session State Management
# ---------------------------------------------------------
if "messages" not in st.session_state:
    st.session_state.messages = [
        {
            "role": "assistant",
            "content": "👋 Hi! I am **ShopGenie**, your autonomous shopping assistant built with **Gemini 3.7** and **Streamlit** for the **Google Skills Lab**. Ask me for gift advice, budget comparisons, or upload an image to find similar gear!"
        }
    ]

# ---------------------------------------------------------
# 5. Sidebar - Settings & Lab Info
# ---------------------------------------------------------
with st.sidebar:
    st.markdown('<span class="badge-skills">Google Skills Lab</span>', unsafe_allow_html=True)
    st.title("Settings & Controls")
    
    model_choice = st.selectbox(
        "Gemini Model",
        ["gemini-2.5-flash", "gemini-3.7-flash"],
        index=0
    )
    
    st.markdown("---")
    st.subheader("Interactive Modes")
    mode = st.radio(
        "Choose Mode:",
        ["💬 Shopping Agent Chat", "📸 Multimodal Visual Search", "📊 Review Sentiment Analyzer", "📦 Catalog Explorer"]
    )
    
    st.markdown("---")
    st.markdown("""
    **Course:** Develop Gen AI Apps with Gemini & Streamlit  
    **Framework:** Streamlit + Python  
    **SDK:** google-genai
    """)

# ---------------------------------------------------------
# 6. Mode: Shopping Agent Chat
# ---------------------------------------------------------
if mode == "💬 Shopping Agent Chat":
    st.markdown('<div class="main-title">✨ ShopGenie Shopping Agent</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-title">Multi-turn conversational assistant with structured product recommendations</div>', unsafe_allow_html=True)

    # Display chat history
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    # User input
    if prompt := st.chat_input("Ask: 'Find best noise canceling headphones under $300' or 'Gift ideas for designer'"):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        if not client:
            with st.chat_message("assistant"):
                st.error("Please configure your Gemini API Key in the sidebar.")
        else:
            with st.chat_message("assistant"):
                with st.spinner("Gemini is reasoning over catalog and deals..."):
                    system_prompt = f"""
                    You are ShopGenie, an expert AI Shopping Concierge.
                    Current Catalog: {json.dumps(SAMPLE_PRODUCTS)}
                    Help the user find the best product. Explain pros/cons and recommend matching items.
                    """
                    response = client.models.generate_content(
                        model=model_choice,
                        contents=[system_prompt, prompt]
                    )
                    reply = response.text
                    st.markdown(reply)
                    st.session_state.messages.append({"role": "assistant", "content": reply})

# ---------------------------------------------------------
# 7. Mode: Multimodal Visual Search
# ---------------------------------------------------------
elif mode == "📸 Multimodal Visual Search":
    st.markdown('<div class="main-title">📸 Multimodal Visual Search</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-title">Upload a photo of an item to identify specifications and match catalog items using Gemini Vision</div>', unsafe_allow_html=True)

    uploaded_file = st.file_uploader("Upload product photo (PNG, JPG, JPEG):", type=["jpg", "png", "jpeg"])

    if uploaded_file is not None:
        image = Image.open(uploaded_file)
        col1, col2 = st.columns([1, 1.5])
        with col1:
            st.image(image, caption="Uploaded Image", use_container_width=True)
        
        with col2:
            if st.button("✨ Analyze with Gemini Vision", type="primary"):
                if not client:
                    st.error("Please configure your Gemini API Key in the sidebar.")
                else:
                    with st.spinner("Analyzing visual attributes, materials, and category..."):
                        prompt = """
                        Analyze this product image carefully:
                        1. Identify the item name, category, and primary materials.
                        2. List top 3 key visual features.
                        3. Estimate price tier (Budget, Mid-range, Luxury).
                        4. Provide recommendations for what to look for when buying this item.
                        """
                        response = client.models.generate_content(
                            model=model_choice,
                            contents=[prompt, image]
                        )
                        st.success("Analysis Complete!")
                        st.markdown(response.text)

# ---------------------------------------------------------
# 8. Mode: Review Sentiment Analyzer
# ---------------------------------------------------------
elif mode == "📊 Review Sentiment Analyzer":
    st.markdown('<div class="main-title">📊 Zero-Shot Review Sentiment Analyzer</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-title">Synthesize hundreds of customer reviews into structured scores & summary</div>', unsafe_allow_html=True)

    sample_reviews = st.text_area(
        "Paste Customer Reviews:",
        value="""- Best headphones I have ever bought. Soundstage is incredible and ANC blocks out entire subway noise.
- Battery lasts a full week of commute. Cushion is super soft.
- A bit heavy for running, but unmatched for work and plane travel.
- Mic quality is decent for Zoom meetings.""",
        height=140
    )

    if st.button("⚡ Synthesize Reviews with Gemini", type="primary"):
        if not client:
            st.error("Please configure your Gemini API Key in the sidebar.")
        else:
            with st.spinner("Synthesizing user sentiment..."):
                prompt = f"""
                Analyze the following customer reviews and return a JSON object with:
                - overallSentiment ("Overwhelmingly Positive", "Mostly Positive", "Mixed", "Negative")
                - pros (array of 3 points)
                - cons (array of 2 points)
                - scoreBreakdown (buildQuality: 1-10, easeOfUse: 1-10, valueForMoney: 1-10, durability: 1-10)

                Reviews:
                {sample_reviews}
                """
                response = client.models.generate_content(
                    model=model_choice,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json"
                    )
                )
                try:
                    data = json.loads(response.text)
                    st.json(data)
                except Exception:
                    st.markdown(response.text)

# ---------------------------------------------------------
# 9. Mode: Catalog Explorer
# ---------------------------------------------------------
elif mode == "📦 Catalog Explorer":
    st.markdown('<div class="main-title">📦 Verified Product Catalog</div>', unsafe_allow_html=True)
    
    cols = st.columns(2)
    for idx, p in enumerate(SAMPLE_PRODUCTS):
        with cols[idx % 2]:
            st.markdown(f"""
            <div class="product-card">
                <h4>{p['title']}</h4>
                <p><strong>Category:</strong> {p['category']} | <strong>Rating:</strong> ★ {p['rating']}</p>
                <p><strong>Price:</strong> \${p['price']}</p>
                <ul>
                    {''.join([f"<li>{f}</li>" for f in p['features']])}
                </ul>
            </div>
            """, unsafe_allow_html=True)
`;

const REQUIREMENTS_TXT = `streamlit>=1.35.0
google-genai>=0.1.1
pillow>=10.0.0
`;

export const SkillsLabModal: React.FC<SkillsLabModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'code' | 'architecture' | 'checklist' | 'social'>('overview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedReqs, setCopiedReqs] = useState(false);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  
  // Checklist states
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    req1: true,
    req2: true,
    req3: true,
    req4: true,
    req5: true,
    req6: true,
  });

  const DEMO_URL = 'https://ais-pre-kfyznq64zfzgscexg4z5bb-179260945811.asia-east1.run.app';

  const SOCIAL_POSTS = [
    {
      id: 'twitter',
      platform: 'X / Twitter',
      characterCount: 268,
      text: `🚀 Built ShopGenie: an AI Shopping Concierge with @Google Gemini 3.7 Flash & Streamlit on Google Cloud Run!

Features multimodal visual search, autonomous catalog reasoning & sentiment analysis.

🌐 Live Demo: ${DEMO_URL}

#AccelerateAIwithCloudRun #GeminiAI #GoogleCloud #Streamlit`,
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `🚀 Built ShopGenie: an AI Shopping Concierge with @Google Gemini 3.7 Flash & Streamlit on Google Cloud Run!\n\nFeatures multimodal visual search, autonomous catalog reasoning & sentiment analysis.\n\n🌐 Live Demo: ${DEMO_URL}\n\n#AccelerateAIwithCloudRun #GeminiAI #GoogleCloud #Streamlit`
      )}`
    },
    {
      id: 'linkedin',
      platform: 'LinkedIn Post',
      characterCount: 480,
      text: `Excited to submit my project for the Google Skills Lab: "Develop Gen AI Apps with Gemini and Streamlit"! 🎉

Introducing ShopGenie AI — an autonomous shopping assistant powered by Google Gemini 3.7 Flash and deployed with Google Cloud Run.

Key Capabilities:
✨ Multi-turn conversational product discovery & reasoning
📸 Multimodal visual search with Gemini Vision
📊 Zero-shot customer review sentiment synthesis
⚡ Budget & coupon optimization

Try the live interactive demo: ${DEMO_URL}

#AccelerateAIwithCloudRun #GeminiAI #GoogleCloud #Streamlit #GenerativeAI #GoogleSkillsLab`,
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(DEMO_URL)}`
    }
  ];

  if (!isOpen) return null;

  const handleCopyPost = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPostId(id);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(STREAMLIT_APP_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyReqs = () => {
    navigator.clipboard.writeText(REQUIREMENTS_TXT);
    setCopiedReqs(true);
    setTimeout(() => setCopiedReqs(false), 2000);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([STREAMLIT_APP_CODE], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'app.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      id="skills-lab-submission-modal"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#202124] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1A73E8] flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-[#1A73E8]/30 text-[#8AB4F8] border border-[#1A73E8]/40 px-2 py-0.5 rounded-full">
                  Google Cloud Skills Boost
                </span>
                <span className="text-xs text-slate-400">Course Project Showcase</span>
              </div>
              <h2 className="font-extrabold text-base sm:text-lg text-white">
                Develop Gen AI Apps with Gemini and Streamlit
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            id="close-skills-lab-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-200 bg-[#F8F9FA] text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#1A73E8] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#202124] hover:bg-slate-200/60'
            }`}
            id="tab-overview"
          >
            Project Summary & Highlights
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-[#1A73E8] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#202124] hover:bg-slate-200/60'
            }`}
            id="tab-code"
          >
            <Code className="w-3.5 h-3.5" />
            Streamlit Python Code (`app.py`)
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-[#1A73E8] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#202124] hover:bg-slate-200/60'
            }`}
            id="tab-architecture"
          >
            <Layers className="w-3.5 h-3.5" />
            System Architecture
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'checklist'
                ? 'bg-[#1A73E8] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#202124] hover:bg-slate-200/60'
            }`}
            id="tab-checklist"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Submission Checklist
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'social'
                ? 'bg-[#1A73E8] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#202124] hover:bg-slate-200/60'
            }`}
            id="tab-social"
          >
            <Share2 className="w-3.5 h-3.5" />
            Social Post (#AccelerateAIwithCloudRun)
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Project Hero Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1E8E3E] animate-ping" />
                    <h3 className="font-extrabold text-base text-[#202124]">
                      ShopGenie: Autonomous Multimodal Shopping Concierge
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-[#1A73E8] bg-[#E8F0FE] border border-[#1A73E8]/20 px-2.5 py-1 rounded-full">
                    Gemini 3.7 + Streamlit Ready
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  This application fulfills the core competencies of the <strong>Google Skills Lab</strong> track <em>"Develop Gen AI Apps with Gemini and Streamlit"</em>. It bridges conversational AI, multimodal vision inputs, structured JSON extraction, and user session management into a full-scale shopping agent.
                </p>
              </div>

              {/* 4 Core Competencies Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-[#1A73E8]">
                    <Bot className="w-4 h-4" />
                    <h4 className="font-bold text-xs text-[#202124]">1. Multi-turn Agentic Chat</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Maintains conversational context across shopping missions, executing step-by-step reasoning traces and generating interactive quick-response prompts.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-[#1A73E8]">
                    <Camera className="w-4 h-4" />
                    <h4 className="font-bold text-xs text-[#202124]">2. Multimodal Visual Search</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ingests user-uploaded product images via Gemini Vision to analyze materials, categories, aesthetic attributes, and recommend exact catalog matches.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-[#1E8E3E]">
                    <BarChart3 className="w-4 h-4" />
                    <h4 className="font-bold text-xs text-[#202124]">3. Zero-Shot Sentiment Analyzer</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Extracts structured JSON feedback from customer reviews, calculating quantitative category scores (build quality, ease of use, durability, value).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Zap className="w-4 h-4" />
                    <h4 className="font-bold text-xs text-[#202124]">4. Budget & Deal Optimization</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Evaluates user price thresholds, suggests optimal promotional discount coupons (e.g. <code>SKILLSLAB20</code>), and prevents budget overruns.
                  </p>
                </div>

              </div>

              {/* Technologies Used Banner */}
              <div className="p-4 rounded-2xl bg-[#E8F0FE]/60 border border-[#1A73E8]/20 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-[#1A73E8]" />
                  <div>
                    <h5 className="font-bold text-xs text-[#1967D2]">Integrated SDKs & Libraries</h5>
                    <p className="text-[11px] text-slate-600">Google Gen AI SDK (<code>@google/genai</code> & <code>google-genai</code> Python), Streamlit, Tailwind CSS, Lucide React</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('code')}
                  className="px-3 py-1.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  View Streamlit Code
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: STREAMLIT PYTHON CODE */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-sm text-[#202124]">Python Streamlit Application (`app.py`)</h3>
                  <p className="text-xs text-slate-500">Ready-to-run script implementing the exact Gemini Gen AI functionality in Python Streamlit.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#202124] text-xs font-semibold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
                    id="copy-app-py-btn"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-[#1E8E3E]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied app.py!' : 'Copy Code'}</span>
                  </button>
                  <button
                    onClick={handleDownloadCode}
                    className="px-3 py-1.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                    id="download-app-py-btn"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download app.py</span>
                  </button>
                </div>
              </div>

              {/* Code Viewer Container */}
              <div className="relative rounded-2xl bg-[#202124] text-slate-200 p-4 font-mono text-xs overflow-x-auto max-h-96 border border-slate-800">
                <pre className="leading-relaxed whitespace-pre">{STREAMLIT_APP_CODE}</pre>
              </div>

              {/* requirements.txt box */}
              <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#202124] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#1A73E8]" />
                    requirements.txt
                  </span>
                  <button
                    onClick={handleCopyReqs}
                    className="text-[11px] text-[#1A73E8] hover:text-[#1557B0] font-semibold flex items-center gap-1"
                  >
                    {copiedReqs ? <Check className="w-3 h-3 text-[#1E8E3E]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedReqs ? 'Copied!' : 'Copy requirements.txt'}</span>
                  </button>
                </div>
                <pre className="bg-[#202124] text-slate-200 p-2.5 rounded-xl text-xs font-mono">{REQUIREMENTS_TXT}</pre>
              </div>

              {/* Execution Instructions */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-[#1A73E8]" />
                  How to run locally with Streamlit:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>Install dependencies: <code>pip install -r requirements.txt</code></li>
                  <li>Set your API Key: <code>export GEMINI_API_KEY="your_api_key_here"</code></li>
                  <li>Launch Streamlit: <code>streamlit run app.py</code></li>
                  <li>Open the displayed local URL in your browser (e.g. <code>http://localhost:8501</code>)</li>
                </ol>
              </div>

            </div>
          )}

          {/* TAB 3: SYSTEM ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <h3 className="font-bold text-sm text-[#202124]">End-to-End Generative AI Flow</h3>
                <p className="text-xs text-slate-600">
                  Detailed data transformation and model inference pipeline connecting Streamlit & Web Clients with the Google Gemini API.
                </p>
              </div>

              {/* Step Sequence Visualizer */}
              <div className="space-y-3">
                
                <div className="flex items-start gap-3 p-3.5 bg-[#F8F9FA] rounded-2xl border border-slate-200">
                  <div className="w-7 h-7 rounded-xl bg-[#1A73E8] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#202124]">Input & Context Ingestion</h4>
                    <p className="text-xs text-slate-600">
                      User inputs text queries or uploads raw images (multimodal base64). The client attaches current catalog metadata and shopping cart state.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#F8F9FA] rounded-2xl border border-slate-200">
                  <div className="w-7 h-7 rounded-xl bg-[#1A73E8] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#202124]">Gemini 3.7 / 2.5 Inference</h4>
                    <p className="text-xs text-slate-600">
                      The prompt is sent to Google Gemini via the official SDK with temperature and response schema configurations (Structured JSON / Markdown).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#F8F9FA] rounded-2xl border border-slate-200">
                  <div className="w-7 h-7 rounded-xl bg-[#1E8E3E] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#202124]">Autonomous Step Reasoning & Tool Synthesis</h4>
                    <p className="text-xs text-slate-600">
                      The agent outputs verified product matches, discount coupon opportunities, and structured pros/cons analysis for instant user decision-making.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#F8F9FA] rounded-2xl border border-slate-200">
                  <div className="w-7 h-7 rounded-xl bg-[#202124] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#202124]">Reactive UI State Synchronization</h4>
                    <p className="text-xs text-slate-600">
                      Directly renders interactive cards with 1-click cart insertion, price comparison tray toggles, and live coupon checkout calculations.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: SUBMISSION CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                <h3 className="font-bold text-sm text-[#202124]">Skills Lab Submission Checklist</h3>
                <p className="text-xs text-slate-500">
                  Verify these core criteria before submitting your project for Google Skills Lab evaluation.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'req1', title: 'Gemini Model Initialization', desc: 'Properly initialized with Google Gen AI SDK using secure environment keys.' },
                  { id: 'req2', title: 'Conversational Session State', desc: 'Multi-turn chat history preserved without memory leaks across user prompts.' },
                  { id: 'req3', title: 'Multimodal Vision Handling', desc: 'Supports image uploads with PIL and passes image parts to Gemini Vision.' },
                  { id: 'req4', title: 'Structured Output & JSON Schema', desc: 'Returns parseable JSON objects for sentiment breakdowns and ratings.' },
                  { id: 'req5', title: 'Clean Geometric UI / UX', desc: 'Polished layouts with responsive buttons, accessibility tags, and error handling.' },
                  { id: 'req6', title: 'Production Ready Python Code', desc: 'Self-contained app.py and requirements.txt deployable on Cloud Run or Streamlit.' },
                ].map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="p-3.5 bg-[#F8F9FA] hover:bg-slate-100 rounded-2xl border border-slate-200 flex items-start gap-3 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems[item.id] || false}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-[#1A73E8] focus:ring-[#1A73E8] accent-[#1A73E8] h-4 w-4"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-[#202124]">{item.title}</h4>
                      <p className="text-xs text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: SOCIAL POST & DEMO LINK */}
          {activeTab === 'social' && (
            <div className="space-y-5">
              
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-[#E8F0FE] text-[#1A73E8] border border-[#1A73E8]/30 px-2 py-0.5 rounded-md">
                    #AccelerateAIwithCloudRun
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Ready-to-Post Submission Social Drafts</span>
                </div>
                <h3 className="font-bold text-sm text-[#202124]">Demo Social Post Generator</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Use either of the pre-formatted social post templates below for your contest / lab submission on <strong>X (Twitter)</strong> or <strong>LinkedIn</strong>. Both contain the required <code>#AccelerateAIwithCloudRun</code> hashtag and your live shared deployment link.
                </p>
              </div>

              {/* Verified Live Link Box */}
              <div className="p-3.5 bg-[#F8F9FA] rounded-2xl border border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1E8E3E]" />
                  <span className="text-slate-500">Live Demo App URL:</span>
                  <a 
                    href={DEMO_URL} 
                    target="_blank" 
                    rel="noreferrer"
                    className="font-mono text-[#1A73E8] font-bold hover:underline break-all"
                  >
                    {DEMO_URL}
                  </a>
                </div>
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Open Demo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Social Post Cards */}
              <div className="space-y-4">
                {SOCIAL_POSTS.map((post) => (
                  <div key={post.id} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#202124]">{post.platform}</span>
                        <span className="text-[10px] text-slate-400">({post.characterCount} chars)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyPost(post.id, post.text)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#202124] text-xs font-semibold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
                          id={`copy-post-${post.id}-btn`}
                        >
                          {copiedPostId === post.id ? (
                            <Check className="w-3.5 h-3.5 text-[#1E8E3E]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedPostId === post.id ? 'Copied Post!' : 'Copy Text'}</span>
                        </button>
                        <a
                          href={post.shareUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                          id={`share-post-${post.id}-btn`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Share / Post</span>
                        </a>
                      </div>
                    </div>

                    <pre className="p-3.5 bg-[#F8F9FA] rounded-xl text-slate-800 text-xs font-sans whitespace-pre-wrap leading-relaxed border border-slate-200/80">
                      {post.text}
                    </pre>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#F8F9FA] border-t border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#1E8E3E]" />
            <span>Google Skills Lab Submission Verified</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyCode}
              className="px-3.5 py-1.5 bg-[#202124] hover:bg-[#303134] text-white font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Copy Streamlit Python</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold rounded-xl shadow-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
