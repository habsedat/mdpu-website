'use client';

import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Settings, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/custom/Tabs';
import { ImageUpload } from '@/components/ui/custom/ImageUpload';
import { AssetGallery } from '@/components/ui/custom/AssetGallery';
import { Section } from '@/components/ui/custom/Section';
import { Asset } from '@/types/assets';
import { DEFAULT_UPLOAD_CONFIGS } from '@/lib/asset-utils';

// Sample assets for demonstration
const sampleAssets: Asset[] = [
  {
    id: '1',
    name: 'MDPU Logo',
    url: '/next.svg', // Using existing SVG as placeholder
    type: 'image',
    category: 'logo',
    size: 1543,
    width: 180,
    height: 38,
    alt: 'MDPU Logo',
    description: 'Main logo for the Mathamba Descendants Progressive Union',
    uploadedAt: new Date('2024-01-15'),
    uploadedBy: 'admin',
    tags: ['logo', 'brand', 'main']
  },
  {
    id: '2',
    name: 'Community Banner',
    url: '/vercel.svg', // Using existing SVG as placeholder
    type: 'image',
    category: 'banner',
    size: 2108,
    width: 283,
    height: 64,
    alt: 'Community Banner',
    description: 'Banner image for community events and gatherings',
    uploadedAt: new Date('2024-01-20'),
    uploadedBy: 'admin',
    tags: ['banner', 'community', 'events']
  },
  {
    id: '3',
    name: 'Member Photo',
    url: '/window.svg', // Using existing SVG as placeholder
    type: 'image',
    category: 'profile',
    size: 892,
    width: 24,
    height: 24,
    alt: 'Member Profile',
    description: 'Profile photo of a MDPU member',
    uploadedAt: new Date('2024-02-01'),
    uploadedBy: 'member',
    tags: ['profile', 'member', 'photo']
  },
  {
    id: '4',
    name: 'Event Photo',
    url: '/file.svg', // Using existing SVG as placeholder
    type: 'image',
    category: 'event',
    size: 1234,
    width: 24,
    height: 24,
    alt: 'Event Photo',
    description: 'Photo from a recent MDPU event',
    uploadedAt: new Date('2024-02-10'),
    uploadedBy: 'event_manager',
    tags: ['event', 'photo', 'gathering']
  }
];

export function AssetManagementDemo() {
  const [assets, setAssets] = useState<Asset[]>(sampleAssets);
  const [selectedCategory, setSelectedCategory] = useState<string>('logo');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  // const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleUploadComplete = (newAssets: Asset[]) => {
    setAssets(prev => [...prev, ...newAssets]);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    // In a real app, you might want to show a toast notification here
  };

  const handleAssetDelete = (assetId: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== assetId));
  };

  const handleAssetEdit = (asset: Asset) => {
    // In a real app, you might open a modal or navigate to an edit page
    console.log('Edit asset:', asset);
  };

  const handleAssetDownload = (asset: Asset) => {
    // In a real app, you would trigger a download
    console.log('Download asset:', asset);
  };

  const currentConfig = DEFAULT_UPLOAD_CONFIGS[selectedCategory] || DEFAULT_UPLOAD_CONFIGS.logo;

  return (
    <Section>
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="upload" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Assets
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Asset Gallery
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload Configuration */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Upload Configuration</CardTitle>
                  <CardDescription>
                    Choose the type of asset you want to upload
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Asset Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    >
                      <option value="logo">Logo</option>
                      <option value="banner">Banner</option>
                      <option value="gallery">Gallery</option>
                      <option value="profile">Profile</option>
                      <option value="event">Event</option>
                      <option value="project">Project</option>
                    </select>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max File Size:</span>
                      <span className="font-medium">
                        {(currentConfig.maxFileSize / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Allowed Types:</span>
                      <span className="font-medium">
                        {currentConfig.allowedTypes.map(type => type.split('/')[1]).join(', ')}
                      </span>
                    </div>
                    {currentConfig.maxWidth && currentConfig.maxHeight && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Dimensions:</span>
                        <span className="font-medium">
                          {currentConfig.maxWidth}×{currentConfig.maxHeight}px
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quality:</span>
                      <span className="font-medium">
                        {Math.round((currentConfig.quality || 1) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Component */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Upload {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Assets</CardTitle>
                  <CardDescription>
                    Drag and drop files or click to select. Files will be automatically validated and optimized.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    config={currentConfig}
                    onUploadComplete={handleUploadComplete}
                    onUploadError={handleUploadError}
                    multiple={true}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-brand-charcoal">Asset Gallery</h2>
                <p className="text-gray-600">
                  Manage and organize all your uploaded assets
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid View
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List View
                </Button>
              </div>
            </div>

            <AssetGallery
              assets={assets}
              onAssetSelect={(asset) => console.log('Selected asset:', asset)}
              onAssetDelete={handleAssetDelete}
              onAssetEdit={handleAssetEdit}
              onAssetDownload={handleAssetDownload}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Management Settings</CardTitle>
                <CardDescription>
                  Configure default settings for asset uploads and management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-brand-charcoal mb-3">Storage Settings</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Assets:</span>
                        <span className="font-medium">{assets.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Size:</span>
                        <span className="font-medium">
                          {assets.reduce((total, asset) => total + asset.size, 0) / (1024 * 1024)} MB
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Storage Used:</span>
                        <span className="font-medium">2.3 GB / 10 GB</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-brand-charcoal mb-3">Upload Defaults</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Default Quality:</span>
                        <span className="font-medium">80%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Auto-optimize:</span>
                        <span className="font-medium text-green-600">Enabled</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Watermark:</span>
                        <span className="font-medium text-gray-600">Disabled</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-brand-charcoal mb-3">Quick Actions</h4>
                  <div className="flex gap-3">
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Storage
                    </Button>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Advanced Settings
                    </Button>
                    <Button variant="outline" className="text-red-600 hover:text-red-700">
                      Clear Cache
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Section>
  );
}
