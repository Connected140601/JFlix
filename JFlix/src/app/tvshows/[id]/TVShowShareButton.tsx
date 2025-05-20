'use client';

import ShareButton from '@/components/ui/ShareButton';

interface TVShowShareButtonProps {
  title: string;
  id: string | number;
}

export default function TVShowShareButton({ title, id }: TVShowShareButtonProps) {
  return (
    <ShareButton 
      title={title} 
      mediaType="tv" 
      id={id} 
    />
  );
}
