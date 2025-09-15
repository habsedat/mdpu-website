import { AssetManagementDemo } from './asset-demo';
import { PageHero } from '@/components/ui/custom/PageHero';

export const metadata = {
  title: 'Asset Management - MDPU',
  description: 'Upload and manage images, logos, and other assets for the MDPU website.',
};

export default function AssetsPage() {
  return (
    <>
      <PageHero
        title="Asset Management"
        subtitle="Upload and Manage Your Assets"
        description="Upload logos, images, and other assets for the MDPU website. Manage your digital content with ease."
      />
      <AssetManagementDemo />
    </>
  );
}

