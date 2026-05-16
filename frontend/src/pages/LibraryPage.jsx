import { motion } from "framer-motion";
import { BookOpen, FileText, FlaskConical, Search, Download } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { useLibrary } from "../hooks/useData";

export default function LibraryPage() {
  const { data: libraryRes, loading } = useLibrary();
  const documents = libraryRes?.data || [];

  const getCategoryIcon = (category) => {
    switch(category) {
      case "SOP": return <BookOpen className="w-5 h-5 text-accent" />;
      case "REQUIREMENT": return <FileText className="w-5 h-5 text-warning" />;
      case "RESEARCH": return <FlaskConical className="w-5 h-5 text-info" />;
      default: return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <AppLayout title="Knowledge Base">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-end justify-between">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-2xl font-bold text-white tracking-widest uppercase">
              // LIBRARY_INDEX
            </h2>
            <p className="text-slate-400 font-mono text-sm mt-2">
              {">"} ACCESSING STANDARD OPERATING PROCEDURES & RESEARCH DATA...
            </p>
          </motion.div>
          <div className="relative w-64 hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input type="text" placeholder="Search documentation..." className="input pl-9" />
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-4">
          {loading ? (
            <p className="text-slate-500 font-mono">LOADING_INDEX...</p>
          ) : (
            documents.map((doc, i) => (
              <motion.div 
                key={doc.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }}
                className="glass p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 flex items-center justify-center border border-white/[0.15] bg-surface-1">
                      {getCategoryIcon(doc.category)}
                    </div>
                    <span className="badge">{doc.category}</span>
                  </div>
                  <h3 className="text-white font-bold font-mono tracking-wide mb-2 line-clamp-1">
                    {doc.title}
                  </h3>
                  <p className="text-slate-400 text-xs font-mono line-clamp-3 mb-4">
                    {doc.content}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.15] pt-3 mt-2">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">
                    AUTHOR: {doc.author?.fullName || "SYSTEM"}
                  </div>
                  <button className="text-accent hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
