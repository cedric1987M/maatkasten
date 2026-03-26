import React from 'react';

interface ConfiguratorPreviewProps {
  productType: string;
  material: string;
}

export function ConfiguratorPreview({ productType, material }: ConfiguratorPreviewProps) {
  // Map product type and material to preview image URLs
  const getPreviewImage = () => {
    // Wardrobe cabinet previews
    if (productType === 'wardrobe') {
      if (material === 'oak' || material === 'eik') {
        return 'https://d2xsxph8kpxj0f.cloudfront.net/310519663341579414/kFL76K46PLdrgau5QNCuma/preview-wardrobe-oak-JRM4Zd3KofshkBmcA79wPX.webp';
      } else if (material === 'walnut' || material === 'notelaar') {
        return 'https://d2xsxph8kpxj0f.cloudfront.net/310519663341579414/kFL76K46PLdrgau5QNCuma/preview-wardrobe-walnut-VmPMH58F5aL6gqSExKmwdX.webp';
      } else {
        // Default to white melamine
        return 'https://d2xsxph8kpxj0f.cloudfront.net/310519663341579414/kFL76K46PLdrgau5QNCuma/preview-wardrobe-white-Zh4WKJiDWqdDbQEYzDuaCt.webp';
      }
    }
    // TV unit previews
    else if (productType === 'tv-unit') {
      return 'https://d2xsxph8kpxj0f.cloudfront.net/310519663341579414/kFL76K46PLdrgau5QNCuma/preview-tv-unit-white-UVpCvVp6PyfkBMaT6CWJs2.webp';
    }
    // Staircase previews
    else if (productType === 'staircase') {
      return 'https://d2xsxph8kpxj0f.cloudfront.net/310519663341579414/kFL76K46PLdrgau5QNCuma/preview-staircase-wood-ASfHeoEMjGdm3MWVWeGuqZ.webp';
    }
    // Default fallback
    return 'https://d2xsxph8kpxj0f.cloudfront.net/310519663341579414/kFL76K46PLdrgau5QNCuma/preview-wardrobe-white-Zh4WKJiDWqdDbQEYzDuaCt.webp';
  };

  const previewImage = getPreviewImage();

  return (
    <div className="configurator-preview bg-white rounded-lg border border-border shadow-sm overflow-hidden">
      {/* Preview Header */}
      <div className="px-6 py-4 border-b border-border bg-gray-50">
        <h3 className="text-lg font-semibold text-foreground">Uw project preview</h3>
        <p className="text-sm text-muted-foreground mt-1">Zie hoe uw ontwerp eruit ziet</p>
      </div>

      {/* Preview Image Container */}
      <div className="relative w-full bg-gray-100 flex items-center justify-center" style={{ aspectRatio: '4/3' }}>
        <img
          src={previewImage}
          alt="Project preview"
          className="w-full h-full object-cover transition-all duration-300 ease-in-out"
          loading="lazy"
        />
      </div>

      {/* Preview Info */}
      <div className="px-6 py-4 bg-gray-50 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground font-medium">Type</p>
            <p className="text-foreground capitalize">{productType === 'tv-unit' ? 'TV Meubel' : productType === 'staircase' ? 'Trap' : 'Kledingkast'}</p>
          </div>
          <div>
            <p className="text-muted-foreground font-medium">Materiaal</p>
            <p className="text-foreground capitalize">{material === 'eik' ? 'Eik' : material === 'notelaar' ? 'Notelaar' : 'Wit Melamine'}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          ✓ Dit is een voorbeeldafbeelding. Uw uiteindelijke ontwerp kan variëren op basis van uw keuzes.
        </p>
      </div>
    </div>
  );
}
