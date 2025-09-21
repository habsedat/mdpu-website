# Asset Management System

This document provides a comprehensive guide to the MDPU website's asset management system.

## Overview

The asset management system allows you to upload, organize, and manage images, logos, and other digital assets for the MDPU website. It includes features for validation, optimization, and organization of assets.

## Features

- **Drag & Drop Upload**: Easy file uploading with drag and drop support
- **File Validation**: Automatic validation of file types, sizes, and dimensions
- **Image Optimization**: Automatic compression and resizing of images
- **Category Organization**: Organize assets by categories (logo, banner, gallery, etc.)
- **Search & Filter**: Find assets quickly with search and filtering
- **Preview Gallery**: View assets in grid or list format
- **Asset Management**: Edit, delete, and download assets

## File Structure

```
src/
├── types/
│   └── assets.ts                 # TypeScript type definitions
├── lib/
│   └── asset-utils.ts           # Utility functions for asset handling
├── components/ui/custom/
│   ├── ImageUpload.tsx          # Main upload component
│   ├── AssetGallery.tsx         # Gallery display component
│   ├── AssetImage.tsx           # Optimized image component
│   └── Tabs.tsx                 # Tab navigation component
├── hooks/
│   └── useAssetManager.ts       # Custom hook for asset state management
└── app/assets/
    ├── page.tsx                 # Asset management page
    └── asset-demo.tsx           # Demo implementation

public/assets/                   # Asset storage directory
├── logos/                       # Logo files
├── banners/                     # Banner images
├── gallery/                     # Gallery images
├── profiles/                    # Profile photos
├── events/                      # Event photos
└── projects/                    # Project images
```

## Usage Examples

### Basic Image Upload

```tsx
import { ImageUpload } from '@/components/ui/custom/ImageUpload';
import { DEFAULT_UPLOAD_CONFIGS } from '@/lib/asset-utils';

function MyComponent() {
  const handleUploadComplete = (assets) => {
    console.log('Uploaded assets:', assets);
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
  };

  return (
    <ImageUpload
      config={DEFAULT_UPLOAD_CONFIGS.logo}
      onUploadComplete={handleUploadComplete}
      onUploadError={handleUploadError}
      multiple={false}
    />
  );
}
```

### Asset Gallery

```tsx
import { AssetGallery } from '@/components/ui/custom/AssetGallery';
import { useAssetManager } from '@/hooks/useAssetManager';

function MyGallery() {
  const { assets, removeAsset, updateAsset } = useAssetManager();

  return (
    <AssetGallery
      assets={assets}
      onAssetDelete={removeAsset}
      onAssetEdit={updateAsset}
      onAssetDownload={(asset) => {
        // Handle download
      }}
      viewMode="grid"
    />
  );
}
```

### Optimized Image Display

```tsx
import { AssetImage } from '@/components/ui/custom/AssetImage';

function MyImageComponent() {
  return (
    <AssetImage
      src="/assets/logos/mdpu-logo.svg"
      alt="MDPU Logo"
      className="w-32 h-32"
      width={128}
      height={128}
    />
  );
}
```

## Upload Configurations

The system provides predefined configurations for different asset types:

### Logo Configuration
- Max file size: 5MB
- Allowed types: JPEG, PNG, SVG, WebP
- Max dimensions: 800×800px
- Quality: 90%

### Banner Configuration
- Max file size: 10MB
- Allowed types: JPEG, PNG, WebP
- Max dimensions: 1920×1080px
- Quality: 80%

### Gallery Configuration
- Max file size: 10MB
- Allowed types: JPEG, PNG, WebP, GIF
- Max dimensions: 2048×2048px
- Quality: 80%

### Profile Configuration
- Max file size: 5MB
- Allowed types: JPEG, PNG, WebP
- Max dimensions: 1000×1000px
- Quality: 90%

## Asset Types

### Image Assets
- **Logo**: Organization logos and brand assets
- **Banner**: Header and section banner images
- **Gallery**: General gallery images
- **Profile**: Member profile photos
- **Event**: Event photos and promotional materials
- **Project**: Project-related images

### Supported File Types
- **Images**: JPEG, PNG, SVG, WebP, GIF
- **Documents**: PDF, DOC, DOCX (future support)
- **Videos**: MP4, WebM (future support)

## API Reference

### ImageUpload Component

#### Props
- `config: AssetUploadConfig` - Upload configuration
- `onUploadComplete?: (assets: Asset[]) => void` - Success callback
- `onUploadError?: (error: string) => void` - Error callback
- `multiple?: boolean` - Allow multiple file selection
- `className?: string` - Additional CSS classes
- `disabled?: boolean` - Disable the component

### AssetGallery Component

#### Props
- `assets: Asset[]` - Array of assets to display
- `onAssetSelect?: (asset: Asset) => void` - Asset selection callback
- `onAssetDelete?: (assetId: string) => void` - Delete callback
- `onAssetEdit?: (asset: Asset) => void` - Edit callback
- `onAssetDownload?: (asset: Asset) => void` - Download callback
- `viewMode?: 'grid' | 'list'` - Display mode
- `onViewModeChange?: (mode: 'grid' | 'list') => void` - View mode change callback

### useAssetManager Hook

#### Returns
- `assets: Asset[]` - Array of managed assets
- `loading: boolean` - Loading state
- `error: string | null` - Error state
- `addAsset: (asset: Asset) => void` - Add new asset
- `removeAsset: (assetId: string) => void` - Remove asset
- `updateAsset: (assetId: string, updates: Partial<Asset>) => void` - Update asset
- `uploadAsset: (file: File, config: AssetUploadConfig) => Promise<AssetUploadResult>` - Upload asset
- `getAssetsByCategory: (category: Asset['category']) => Asset[]` - Filter by category
- `getAssetsByType: (type: Asset['type']) => Asset[]` - Filter by type
- `searchAssets: (query: string) => Asset[]` - Search assets
- `getTotalSize: () => number` - Get total storage used

## Best Practices

### File Naming
- Use descriptive, lowercase names
- Separate words with hyphens
- Include version numbers for iterations
- Examples: `mdpu-logo-main.svg`, `community-banner-2024.jpg`

### Image Optimization
- Use appropriate formats (SVG for logos, JPEG for photos, PNG for transparency)
- Compress images before upload when possible
- Use appropriate dimensions for the intended use
- Provide alt text for accessibility

### Organization
- Use appropriate categories for assets
- Add descriptive tags for better searchability
- Include meaningful descriptions
- Keep file sizes reasonable

### Accessibility
- Always provide alt text for images
- Ensure good contrast for text overlays
- Consider colorblind users
- Use descriptive filenames

## Future Enhancements

- **Cloud Storage Integration**: Support for AWS S3, Google Cloud Storage
- **CDN Integration**: Automatic CDN distribution
- **Advanced Image Processing**: Filters, effects, and transformations
- **Batch Operations**: Bulk upload, edit, and delete
- **Version Control**: Track asset versions and changes
- **Usage Analytics**: Track asset usage across the site
- **Automatic Backup**: Regular backup of assets
- **Watermarking**: Automatic watermark application
- **Format Conversion**: Automatic format conversion (e.g., WebP generation)

## Troubleshooting

### Common Issues

1. **Upload Fails**
   - Check file size limits
   - Verify file type is allowed
   - Ensure image dimensions are within limits

2. **Images Not Displaying**
   - Check file paths are correct
   - Verify files exist in public directory
   - Check browser console for errors

3. **Poor Image Quality**
   - Adjust quality settings in upload config
   - Use higher resolution source images
   - Choose appropriate file format

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` to see detailed upload information.

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.















