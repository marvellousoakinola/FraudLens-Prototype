import React, { useState, useRef, useCallback } from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Link as LinkIcon, 
  Camera, 
  Shield, 
  Check,
  Save,
  Globe,
  Briefcase,
  X,
  Upload,
  RotateCw,
  Scissors
} from 'lucide-react';
import { Card, Button, Input, Badge, cn } from '../../../components/ui';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import Cropper, { Area, Point } from 'react-easy-crop';

import { authService } from '../../../services/authService';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(user?.avatar || null);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  
  // Cropper State
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageToCrop(reader.result as string);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<string | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg');
    });
  };

  const handleSaveCrop = async () => {
    if (imageToCrop && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      if (croppedImage) {
        try {
          const updatedUser = await authService.updateProfile({ avatar: croppedImage });
          setProfileImage(croppedImage);
          updateUser(updatedUser);
        } catch (error) {
          console.error('Failed to update avatar:', error);
        }
      }
      setImageToCrop(null);
      setZoom(1);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await authService.updateProfile({ name });
      updateUser(updatedUser);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <User className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Identity Profile</h1>
          </div>
          <p className="text-sm font-medium text-[var(--foreground-muted)]">Manage your system identifiers and personal synchronization data.</p>
        </div>
        <Button 
          size="sm" 
          onClick={handleSaveProfile}
          loading={isSaving}
          className="h-10 px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 gap-2"
        >
          <Save className="w-4 h-4" /> Save Specifications
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 md:p-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 md:p-8 border-none bg-[var(--surface)] text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary opacity-20" />
            
            <div 
              className="relative w-32 h-32 mx-auto mb-6 group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-full h-full rounded-2xl bg-[var(--background-secondary)] overflow-hidden border-2 border-[var(--border-color)] group-hover:border-primary transition-all shadow-xl">
                 <img 
                   src={profileImage || `https://picsum.photos/seed/${user?.id}/128/128`} 
                   alt="Profile" 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                   referrerPolicy="no-referrer"
                 />
              </div>
              <div className="absolute -bottom-2 -right-2 p-2.5 bg-primary text-[var(--foreground)] rounded-xl shadow-lg shadow-primary/40 group-hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>

            <h3 className="text-xl font-black text-[var(--foreground)] mb-1 tracking-tight">{user?.name || 'Guest User'}</h3>
            <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest border border-[var(--border-color)] rounded-full px-4 py-1 inline-block mb-8">
              System Admin
            </p>

            <div className="space-y-4 pt-8 border-t border-[var(--border-color)] text-left">
               <div className="flex items-center justify-between text-[11px] font-bold">
                 <span className="text-[var(--foreground-muted)] uppercase tracking-widest">Global Rank</span>
                 <span className="text-primary italic">Precisionist</span>
               </div>
               <div className="flex items-center justify-between text-[11px] font-bold">
                 <span className="text-[var(--foreground-muted)] uppercase tracking-widest">Active nodes</span>
                 <span className="text-[var(--foreground)]">14 Nodes</span>
               </div>
            </div>
          </Card>

          <Card className="p-6 border-none bg-[var(--surface)] flex flex-col items-center text-center">
            <Shield className="w-10 h-10 text-emerald-500 mb-4 opacity-50" />
            <h4 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest mb-2">Verified Operator</h4>
            <p className="text-xs font-medium text-[var(--foreground-muted)] px-4">Your biometric hash and identity token are synchronized with our global ledger.</p>
          </Card>
        </div>

        {/* Informational Form */}
        <div className="lg:col-span-2">
           <Card className="p-6 md:p-10 border-none bg-[var(--surface)] space-y-10">
              <div className="space-y-8">
                 <div className="grid md:grid-cols-2 gap-5 md:p-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest ml-1">Full Identity Name</label>
                       <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)] group-focus-within:text-primary transition-colors" />
                          <input 
                            className="w-full h-12 pl-12 pr-4 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--foreground)] outline-none focus:border-primary/50 transition-all"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest ml-1">Communication Relay (Email)</label>
                       <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)] group-focus-within:text-primary transition-colors" />
                          <input 
                            className="w-full h-12 pl-12 pr-4 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--foreground)] outline-none focus:border-primary/50 transition-all"
                            defaultValue={user?.email}
                            readOnly
                          />
                       </div>
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-5 md:p-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest ml-1">Location Origin</label>
                       <div className="relative group">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)] group-focus-within:text-primary transition-colors" />
                          <input 
                            className="w-full h-12 pl-12 pr-4 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--foreground)] outline-none focus:border-primary/50 transition-all"
                            placeholder="e.g. London, UK"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest ml-1">Workspace/Organization</label>
                       <div className="relative group">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)] group-focus-within:text-primary transition-colors" />
                          <input 
                            className="w-full h-12 pl-12 pr-4 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--foreground)] outline-none focus:border-primary/50 transition-all"
                            placeholder="e.g. FraudLens Intelligence"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest ml-1">Digital Persona Bio</label>
                    <textarea 
                      className="w-full min-h-[120px] p-5 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-2xl text-xs font-bold text-[var(--foreground)] outline-none focus:border-primary/50 transition-all resize-none"
                      placeholder="Describe your role and expertise in the security ecosystem..."
                    />
                 </div>
              </div>

              <div className="pt-10 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                     <Check className="w-5 h-5 text-emerald-500" />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-tight">External Sync Enabled</p>
                     <p className="text-[10px] font-bold text-[var(--foreground-muted)]">Your profile data is synchronized with your Gravatar and LinkedIn.</p>
                   </div>
                 </div>
                 <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest h-10 px-6 border-[var(--border-color)] bg-transparent" onClick={() => alert('Feature coming soon!')}>
                    Disconnect Third-Party
                 </Button>
              </div>
           </Card>
        </div>
      </div>

      {/* Cropping Modal Overlay */}
      <AnimatePresence>
        {imageToCrop && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-5 md:p-8 bg-black/90 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Scissors className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-black text-[var(--foreground)] uppercase tracking-widest">Adjust Persona Image</h3>
                </div>
                <button 
                  onClick={() => setImageToCrop(null)}
                  className="p-2 hover:bg-[var(--background-secondary)] rounded-full text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative flex-grow min-h-[300px] md:min-h-[400px] bg-black">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="rect"
                  showGrid={true}
                />
              </div>

              <div className="p-5 md:p-8 bg-[var(--surface)] space-y-6">
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest border-[var(--border-color)]"
                    onClick={() => setImageToCrop(null)}
                  >
                    Abort
                  </Button>
                  <Button 
                    className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 gap-2"
                    onClick={handleSaveCrop}
                  >
                    <Save className="w-4 h-4" /> Save & Apply
                  </Button>
                </div>
                <p className="text-[10px] font-bold text-[var(--foreground-muted)] text-center uppercase tracking-widest leading-relaxed">
                  Image will be optimized for system synchronization.<br />Recommended resolution: 512x512px.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
