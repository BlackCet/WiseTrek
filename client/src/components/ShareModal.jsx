import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Button, Snackbar } from '@mui/material';
import { X, Copy, Check, Twitter } from 'lucide-react';

// Using a custom SVG for WhatsApp since Lucide doesn't have brand icons
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export function ShareModal({ open, onClose, destination, planData }) {
  const [copied, setCopied] = useState(false);

  // In a real app, this would be a unique generated URL from your database
  // For now, we'll create a structured text summary.
  const shareText = `🌍 Hey! Check out my upcoming trip to ${destination} planned with WiseTrek AI! ✈️\n\n📅 ${planData?.dates || 'Coming soon'}\n🎒 ${planData?.travelers || 'Just me'}\n\nCan't wait to explore!`;
  const shareUrl = "https://wisetrek-app.vercel.app"; // Replace with your actual deployed URL later

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(shareText);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        PaperProps={{
          style: {
            borderRadius: '24px',
            padding: '8px',
            maxWidth: '400px',
            width: '100%'
          }
        }}
      >
        <DialogTitle className="flex items-center justify-between pb-2">
          <span className="text-xl font-black text-gray-900">Share Itinerary</span>
          <IconButton onClick={onClose} size="small" className="text-gray-400 hover:text-gray-600 bg-gray-50">
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-2">
            
            {/* The Link Copy Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm text-gray-500 truncate mr-3">{shareUrl}</span>
              <Button
                variant="contained"
                onClick={handleCopy}
                disableElevation
                startIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                sx={{ 
                  borderRadius: '10px', 
                  textTransform: 'none',
                  fontWeight: 'bold',
                  backgroundColor: copied ? '#10b981' : '#6366f1',
                  '&:hover': { backgroundColor: copied ? '#059669' : '#4f46e5' }
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Or share via</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outlined"
                onClick={handleWhatsAppShare}
                startIcon={<WhatsAppIcon />}
                sx={{ 
                  borderRadius: '12px', 
                  textTransform: 'none',
                  fontWeight: 'bold',
                  borderColor: '#e5e7eb',
                  color: '#25D366', // WhatsApp Green
                  '&:hover': { backgroundColor: '#f0fdf4', borderColor: '#25D366' }
                }}
              >
                WhatsApp
              </Button>
              <Button
                variant="outlined"
                onClick={handleTwitterShare}
                startIcon={<Twitter size={18} />}
                sx={{ 
                  borderRadius: '12px', 
                  textTransform: 'none',
                  fontWeight: 'bold',
                  borderColor: '#e5e7eb',
                  color: '#1DA1F2', // Twitter Blue
                  '&:hover': { backgroundColor: '#f0f9ff', borderColor: '#1DA1F2' }
                }}
              >
                Twitter / X
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Optional: A small toast notification when copying outside the modal */}
      <Snackbar
        open={copied}
        message="Link copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}