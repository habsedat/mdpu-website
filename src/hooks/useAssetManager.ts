import { useState, useCallback } from 'react';
import { Asset, AssetUploadResult, AssetUploadConfig } from '@/types/assets';
import { simulateUpload } from '@/lib/asset-utils';

export function useAssetManager(initialAssets: Asset[] = []) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addAsset = useCallback((asset: Asset) => {
    setAssets(prev => [...prev, asset]);
  }, []);

  const removeAsset = useCallback((assetId: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== assetId));
  }, []);

  const updateAsset = useCallback((assetId: string, updates: Partial<Asset>) => {
    setAssets(prev => 
      prev.map(asset => 
        asset.id === assetId ? { ...asset, ...updates } : asset
      )
    );
  }, []);

  const uploadAsset = useCallback(async (
    file: File, 
    config: AssetUploadConfig
  ): Promise<AssetUploadResult> => {
    setLoading(true);
    setError(null);

    try {
      const result = await simulateUpload(file, config);
      
      if (result.success && result.asset) {
        addAsset(result.asset);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [addAsset]);

  const getAssetsByCategory = useCallback((category: Asset['category']) => {
    return assets.filter(asset => asset.category === category);
  }, [assets]);

  const getAssetsByType = useCallback((type: Asset['type']) => {
    return assets.filter(asset => asset.type === type);
  }, [assets]);

  const searchAssets = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return assets.filter(asset => 
      asset.name.toLowerCase().includes(lowercaseQuery) ||
      asset.description?.toLowerCase().includes(lowercaseQuery) ||
      asset.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [assets]);

  const getTotalSize = useCallback(() => {
    return assets.reduce((total, asset) => total + asset.size, 0);
  }, [assets]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    assets,
    loading,
    error,
    addAsset,
    removeAsset,
    updateAsset,
    uploadAsset,
    getAssetsByCategory,
    getAssetsByType,
    searchAssets,
    getTotalSize,
    clearError
  };
}
