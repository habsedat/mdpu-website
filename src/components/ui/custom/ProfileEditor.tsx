'use client';

import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useDropzone } from 'react-dropzone';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { 
  Camera, 
  Upload, 
  Crop as CropIcon, 
  Save, 
  X, 
  User as UserIcon,
  Edit,
  Check,
  AlertCircle
} from 'lucide-react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

interface ProfileEditorProps {
  memberData: any;
  onUpdate: () => void;
  onClose: () => void;
}

export function ProfileEditor({ memberData, onUpdate, onClose }: ProfileEditorProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: memberData?.fullName || user?.displayName || '',
    email: memberData?.email || user?.email || '',
    phone: memberData?.phone || '',
    chapter: memberData?.chapter || '',
    bio: memberData?.bio || '',
    role: memberData?.role || 'Member',
    profilePictureURL: memberData?.profilePictureURL || '',
  });

  // Image cropping states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [showCropper, setShowCropper] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    // No artificial size limits - professional websites handle any image size
  });

  const getCroppedImg = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!imgRef.current || !completedCrop) {
        console.log('Missing image reference or crop data');
        resolve(null);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.log('Failed to get canvas context');
        resolve(null);
        return;
      }

      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
      console.log('Scale factors:', scaleX, scaleY);

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      canvas.toBlob((blob) => {
        console.log('Blob created:', blob ? `${blob.size} bytes` : 'null');
        resolve(blob);
      }, 'image/jpeg', 0.95); // High quality for professional appearance
    });
  }, [completedCrop]);

  const handleImageSave = async () => {
    if (!completedCrop || !user) {
      alert('Please select an area to crop');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Starting image save...');
      
      const croppedImageBlob = await getCroppedImg();
      if (!croppedImageBlob) {
        alert('Failed to process image. Please try again.');
        setIsLoading(false);
        return;
      }

      console.log('Image cropped successfully, converting to base64...');
      
      // Use base64 storage directly - reliable and fast
      const reader = new FileReader();
      reader.onload = () => {
        console.log('Base64 conversion complete');
        const base64String = reader.result as string;
        setProfileData(prev => ({ ...prev, profilePictureURL: base64String }));
        setShowCropper(false);
        setSelectedImage(null);
        setIsLoading(false);
        alert('Profile picture updated successfully! Click "Save Changes" to save your profile.');
      };
      
      reader.onerror = () => {
        console.error('Failed to convert image to base64');
        setIsLoading(false);
        alert('Failed to process image. Please try again.');
      };
      
      reader.readAsDataURL(croppedImageBlob);
      
    } catch (error: any) {
      console.error('Error processing image:', error);
      setIsLoading(false);
      alert('Failed to process image. Please try again.');
    }
  };

  const handleSaveProfile = async () => {
    console.log('Save profile clicked!');
    console.log('User:', user);
    console.log('Member data:', memberData);
    console.log('Profile data:', profileData);

    if (!user) {
      alert('User not found. Please sign in again.');
      return;
    }

    if (!memberData?.id) {
      alert('Member data not found. Please refresh and try again.');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Starting profile update...');

      // Update member document in Firestore (only allowed fields)
      const updateData = {
        fullName: profileData.fullName || '',
        phone: profileData.phone || '',
        chapter: profileData.chapter || '',
        bio: profileData.bio || '',
        profilePictureURL: profileData.profilePictureURL || '',
        updatedAt: new Date(),
      };

      console.log('Update data:', updateData);
      console.log('Updating document:', `members/${memberData.id}`);

      await updateDoc(doc(db, 'members', memberData.id), updateData);

      console.log('Profile updated successfully in Firestore');
      alert('Profile updated successfully!');
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      console.error('Error details:', error.code, error.message);
      
      let errorMessage = 'Failed to update profile. ';
      if (error.code === 'permission-denied') {
        errorMessage += 'Permission denied. Please make sure you are signed in.';
      } else if (error.code === 'not-found') {
        errorMessage += 'Profile not found. Please refresh and try again.';
      } else {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const chapters = [
    'Freetown, Sierra Leone',
    'London, United Kingdom', 
    'New York, USA',
    'Toronto, Canada',
    'Other'
  ];

  if (showCropper && selectedImage) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CropIcon className="w-5 h-5" />
            Crop Profile Picture
          </CardTitle>
          <CardDescription className="text-sm">
            Select the area you want to use as your profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                src={selectedImage}
                alt="Crop preview"
                className="max-w-full h-auto max-h-64"
                style={{ maxHeight: '250px' }}
              />
            </ReactCrop>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button onClick={handleImageSave} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              {isLoading ? 'Saving...' : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Picture
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => {
              setShowCropper(false);
              setSelectedImage(null);
            }}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Edit className="w-5 h-5" />
          Edit Profile
        </CardTitle>
        <CardDescription>
          Update your personal information and profile picture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Profile Picture Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
              {profileData.profilePictureURL ? (
                <img
                  src={profileData.profilePictureURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                  <UserIcon className="w-10 h-10 sm:w-16 sm:h-16 text-white" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1">
              <Badge className="bg-green-500 text-white p-1">
                <Camera className="w-3 h-3" />
              </Badge>
            </div>
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-base font-semibold mb-2">Profile Picture</h3>
            <p className="text-gray-600 mb-3 text-sm">
              Upload a professional photo (square format recommended)
            </p>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
            <div className="text-center">
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-sm text-gray-600">
                {isDragActive ? 'Drop image here' : 'Click or drag to upload'}
              </p>
              <p className="text-xs text-gray-500">
                Any image format, any size
              </p>
            </div>
            </div>
          </div>
        </div>

        {/* Profile Information Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label htmlFor="chapter">Chapter</Label>
              <Select value={profileData.chapter} onValueChange={(value) => setProfileData(prev => ({ ...prev, chapter: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your chapter" />
                </SelectTrigger>
                <SelectContent>
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter} value={chapter}>
                      {chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                className="min-h-[120px]"
              />
            </div>
            
            {/* Read-only information */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700">Account Information</h4>
              <div className="text-sm text-gray-600">
                <p><strong>Email:</strong> {profileData.email}</p>
                <p><strong>Role:</strong> {profileData.role}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Contact admin to change email or role
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button 
            onClick={handleSaveProfile} 
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
          >
            {isLoading ? 'Saving...' : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
