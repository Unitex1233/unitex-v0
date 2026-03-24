import React, { useState, useRef, useEffect } from 'react';
import { Image, Link, Smile, Hash, X, ChevronDown, Send, FileText, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const POST_LABELS = [
    { id: 'progress', label: 'Progress', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { id: 'failure', label: 'Failure', color: 'bg-rose-100 text-rose-800 border-rose-200' },
    { id: 'question', label: 'Question', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { id: 'resource', label: 'Resource', color: 'bg-sky-100 text-sky-800 border-sky-200' },
    { id: 'discussion', label: 'Discussion', color: 'bg-violet-100 text-violet-800 border-violet-200' },
    { id: 'reflection', label: 'Reflection', color: 'bg-slate-100 text-slate-800 border-slate-200' },
];

export interface CreatePostMedia {
    type: 'image' | 'video';
    url: string;
}

function CreatePost({ initialExpanded = false, onPost }: { initialExpanded?: boolean, onPost?: (content: string, label: string | null, media?: CreatePostMedia) => void }) {
    const [isExpanded, setIsExpanded] = useState(initialExpanded);
    const [content, setContent] = useState('');
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [customLabel, setCustomLabel] = useState('');
    const [customLabels, setCustomLabels] = useState<{ id: string; label: string; color: string }[]>([]);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Clean up object URL on unmount or when preview changes
    useEffect(() => {
        return () => {
            if (mediaPreview) {
                URL.revokeObjectURL(mediaPreview);
            }
        };
    }, [mediaPreview]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Revoke previous preview URL
        if (mediaPreview) {
            URL.revokeObjectURL(mediaPreview);
        }

        const previewUrl = URL.createObjectURL(file);
        setMediaFile(file);
        setMediaPreview(previewUrl);

        // Reset file input so the same file can be re-selected
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeMedia = () => {
        if (mediaPreview) {
            URL.revokeObjectURL(mediaPreview);
        }
        setMediaFile(null);
        setMediaPreview(null);
    };

    const handleAddCustomLabel = () => {
        const trimmed = customLabel.trim();
        if (!trimmed) return;
        const id = trimmed.toLowerCase().replace(/\s+/g, '-');
        if ([...POST_LABELS, ...customLabels].some(l => l.id === id)) {
            setSelectedLabel(id);
            setCustomLabel('');
            setShowCustomInput(false);
            return;
        }
        const newLabel = { id, label: trimmed, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
        setCustomLabels(prev => [...prev, newLabel]);
        setSelectedLabel(id);
        setCustomLabel('');
        setShowCustomInput(false);
    };

    const allLabels = [...POST_LABELS, ...customLabels];

    const handlePost = () => {
        if ((content.trim() || mediaFile) && onPost) {
            const media: CreatePostMedia | undefined = mediaPreview && mediaFile
                ? { type: mediaFile.type.startsWith('video') ? 'video' : 'image', url: mediaPreview }
                : undefined;
            onPost(content, selectedLabel, media);
            setContent('');
            setSelectedLabel(null);
            setMediaFile(null);
            setMediaPreview(null);
            setIsExpanded(false);
        }
    };

    return (
        <div className={cn(
            "bg-white border transition-all duration-300 relative group",
            isExpanded ? "border-[var(--color-text)] shadow-sm" : "border-[var(--color-surface)] hover:border-[var(--color-text)]"
        )}>
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileSelect}
            />

            {/* Header / collapsed state */}
            <div
                onClick={() => setIsExpanded(true)}
                className="p-4 flex items-center justify-between cursor-pointer border-b border-transparent group-hover:bg-gray-50/50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-10 h-10 flex items-center justify-center border transition-colors",
                        isExpanded ? "bg-[var(--color-text)] text-white border-[var(--color-text)]" : "bg-[var(--color-surface)] text-[var(--color-text)] border-transparent"
                    )}>
                        <FileText size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text)]">
                            {isExpanded ? "New Post" : "Share Progress"}
                        </h3>
                        {!isExpanded && (
                            <p className="text-xs text-[var(--color-text)] opacity-40 font-mono mt-1">
                                What are you building today?
                            </p>
                        )}
                    </div>
                </div>

                {!isExpanded && (
                    <div className="w-8 h-8 flex items-center justify-center border border-[var(--color-surface)]">
                        <span className="text-lg font-bold text-[var(--color-accent)]">+</span>
                    </div>
                )}
            </div>

            {/* Expanded Form */}
            {isExpanded && (
                <div className="px-6 pb-6 pt-2">
                    {/* Content Area */}
                    <div className="mb-6 relative">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Describe your current status. Be specific..."
                            className="w-full min-h-[160px] resize-none outline-none text-lg text-[var(--color-text)] placeholder:text-gray-300 font-medium font-sans bg-transparent py-4"
                            autoFocus
                        />
                        <div className="absolute bottom-0 right-0 text-[10px] font-mono opacity-30">
                            MARKDOWN SUPPORTED
                        </div>
                    </div>

                    {/* Media Preview */}
                    {mediaPreview && mediaFile && (
                        <div className="mb-6 relative border border-[var(--color-surface)] bg-gray-50 overflow-hidden">
                            <button
                                onClick={removeMedia}
                                className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center bg-black/60 text-white hover:bg-red-500 transition-colors"
                                title="Remove media"
                            >
                                <X size={14} />
                            </button>
                            {mediaFile.type.startsWith('video') ? (
                                <video src={mediaPreview} controls className="w-full max-h-[280px] object-contain bg-black" />
                            ) : (
                                <img src={mediaPreview} alt="Upload preview" loading="lazy" className="w-full max-h-[280px] object-contain" />
                            )}
                            <div className="px-3 py-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest border-t border-[var(--color-surface)] flex items-center justify-between">
                                <span>{mediaFile.name}</span>
                                <span>{(mediaFile.size / 1024).toFixed(0)} KB</span>
                            </div>
                        </div>
                    )}

                    {/* Meta Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pt-6 border-t border-[var(--color-surface)]">

                        {/* Label Selector */}
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 block">Category <span className="opacity-50">(optional)</span></span>
                            <div className="flex flex-wrap gap-2">
                                {allLabels.map((label) => (
                                    <button
                                        key={label.id}
                                        onClick={() => setSelectedLabel(selectedLabel === label.id ? null : label.id)}
                                        className={cn(
                                            "px-2 py-1 text-[10px] font-bold uppercase tracking-wider border transition-all",
                                            selectedLabel === label.id
                                                ? "bg-[var(--color-text)] text-white border-[var(--color-text)]"
                                                : "border-[var(--color-surface)] text-gray-500 hover:border-gray-400 hover:text-[var(--color-text)]"
                                        )}
                                    >
                                        {label.label}
                                    </button>
                                ))}
                                {/* Add Custom Category */}
                                {showCustomInput ? (
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="text"
                                            value={customLabel}
                                            onChange={(e) => setCustomLabel(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomLabel()}
                                            placeholder="Type name..."
                                            className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider border border-[var(--color-text)] outline-none bg-white w-28"
                                            autoFocus
                                        />
                                        <button onClick={handleAddCustomLabel} className="h-7 px-2 text-[10px] font-bold border border-[var(--color-text)] bg-[var(--color-text)] text-white">Add</button>
                                        <button onClick={() => { setShowCustomInput(false); setCustomLabel(''); }} className="h-7 px-1 text-gray-400 hover:text-[var(--color-text)]">
                                            <X size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowCustomInput(true)}
                                        className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider border border-dashed border-gray-300 text-gray-400 hover:border-[var(--color-text)] hover:text-[var(--color-text)] transition-all"
                                    >
                                        + Custom
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Attachments */}
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 block">Attachments</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className={cn(
                                        "h-8 px-3 flex items-center gap-2 border transition-colors text-xs font-bold uppercase tracking-wider",
                                        mediaFile
                                            ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/5"
                                            : "border-[var(--color-surface)] hover:border-[var(--color-text)] text-gray-600"
                                    )}
                                >
                                    <Image size={14} /> {mediaFile ? 'Change' : 'Photo'}
                                </button>
                                <button className="h-8 px-3 flex items-center gap-2 border border-[var(--color-surface)] hover:border-[var(--color-text)] transition-colors text-xs font-bold uppercase tracking-wider text-gray-600">
                                    <Link size={14} /> Link
                                </button>
                                <button className="h-8 px-3 flex items-center gap-2 border border-[var(--color-surface)] hover:border-[var(--color-text)] transition-colors text-xs font-bold uppercase tracking-wider text-gray-600">
                                    <Globe size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => { setIsExpanded(false); removeMedia(); }}
                            className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[var(--color-text)] transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={!content.trim() && !mediaFile}
                            onClick={handlePost}
                            className="flex items-center gap-2 px-8 py-3 bg-[var(--color-text)] text-white hover:bg-[var(--color-accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                        >
                            <span className="text-xs font-bold uppercase tracking-widest">Post</span>
                            <Send size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreatePost;
