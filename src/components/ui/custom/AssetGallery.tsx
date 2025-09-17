'use client';

import React, { useState } from 'react';
import { Search, Filter, Grid, List, Download, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Asset, AssetFilters } from '@/types/assets';
import { formatFileSize } from '@/lib/asset-utils';

interface AssetGalleryProps {
  assets: Asset[];
  onAssetSelect?: (asset: Asset) => void;
  onAssetDelete?: (assetId: string) => void;
  onAssetEdit?: (asset: Asset) => void;
  onAssetDownload?: (asset: Asset) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  className?: string;
}

export function AssetGallery({
  assets,
  onAssetSelect,
  onAssetDelete,
  onAssetEdit,
  onAssetDownload,
  viewMode = 'grid',
  onViewModeChange,
  className = ''
}: AssetGalleryProps) {
  const [filters, setFilters] = useState<AssetFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Filter assets based on search and filters
  const filteredAssets = assets.filter(asset => {
    // Search filter
    if (searchTerm && !asset.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !asset.description?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !asset.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }

    // Category filter
    if (filters.category && asset.category !== filters.category) {
      return false;
    }

    // Type filter
    if (filters.type && asset.type !== filters.type) {
      return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        asset.tags?.includes(tag)
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  });

  const handleCategoryFilter = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: category === 'all' ? undefined : category as Asset['category']
    }));
  };

  const handleTypeFilter = (type: string) => {
    setFilters(prev => ({
      ...prev,
      type: type === 'all' ? undefined : type as Asset['type']
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const getCategoryColor = (category: Asset['category']) => {
    const colors = {
      logo: 'bg-blue-100 text-blue-800',
      banner: 'bg-purple-100 text-purple-800',
      gallery: 'bg-green-100 text-green-800',
      document: 'bg-yellow-100 text-yellow-800',
      profile: 'bg-pink-100 text-pink-800',
      event: 'bg-orange-100 text-orange-800',
      project: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange?.('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange?.('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <Select value={filters.category || 'all'} onValueChange={handleCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="logo">Logo</SelectItem>
              <SelectItem value="banner">Banner</SelectItem>
              <SelectItem value="gallery">Gallery</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="profile">Profile</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="project">Project</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.type || 'all'} onValueChange={handleTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>

          {(filters.category || filters.type || searchTerm) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {filteredAssets.length} of {assets.length} assets
      </div>

      {/* Assets Display */}
      {filteredAssets.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No assets found</h3>
                <p className="text-gray-600">
                  {assets.length === 0 
                    ? 'No assets have been uploaded yet.' 
                    : 'Try adjusting your search or filters.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              viewMode={viewMode}
              onSelect={() => onAssetSelect?.(asset)}
              onDelete={() => onAssetDelete?.(asset.id)}
              onEdit={() => onAssetEdit?.(asset)}
              onDownload={() => onAssetDownload?.(asset)}
              getCategoryColor={getCategoryColor}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface AssetCardProps {
  asset: Asset;
  viewMode: 'grid' | 'list';
  onSelect: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onDownload: () => void;
  getCategoryColor: (category: Asset['category']) => string;
  formatDate: (date: Date) => string;
}

function AssetCard({
  asset,
  viewMode,
  onSelect,
  onDelete,
  onEdit,
  onDownload,
  getCategoryColor,
  formatDate
}: AssetCardProps) {
  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Thumbnail */}
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {asset.type === 'image' ? (
                <img 
                  src={asset.url} 
                  alt={asset.alt || asset.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={onSelect}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-2xl">
                    {asset.type === 'document' ? '📄' : asset.type === 'video' ? '🎥' : '📁'}
                  </div>
                </div>
              )}
            </div>

            {/* Asset Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-brand-charcoal truncate">
                  {asset.name}
                </h4>
                <Badge className={`text-xs ${getCategoryColor(asset.category)}`}>
                  {asset.category}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {formatFileSize(asset.size)} • {formatDate(asset.uploadedAt)}
              </p>
              {asset.description && (
                <p className="text-sm text-gray-500 truncate">
                  {asset.description}
                </p>
              )}
              {asset.tags && asset.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {asset.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {asset.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{asset.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onDownload}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="hover:shadow-lg transition-shadow group">
      <CardContent className="p-0">
        {/* Image */}
        <div className="aspect-square bg-gray-100 overflow-hidden">
          {asset.type === 'image' ? (
            <img 
              src={asset.url} 
              alt={asset.alt || asset.name}
              className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform"
              onClick={onSelect}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl">
                {asset.type === 'document' ? '📄' : asset.type === 'video' ? '🎥' : '📁'}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-brand-charcoal truncate flex-1">
              {asset.name}
            </h4>
            <Badge className={`text-xs ml-2 ${getCategoryColor(asset.category)}`}>
              {asset.category}
            </Badge>
          </div>

          <p className="text-sm text-gray-600 mb-2">
            {formatFileSize(asset.size)} • {formatDate(asset.uploadedAt)}
          </p>

          {asset.description && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
              {asset.description}
            </p>
          )}

          {asset.tags && asset.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {asset.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {asset.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{asset.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={onDownload}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}







