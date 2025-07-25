import Link from 'next/link';
import { useState } from 'react';
import { 
  Star, 
  Users,
  Music,
  Globe,
  CheckCircle,
  Play,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ArtistMember {
  name: string;
  instrument: string;
}

interface ArtistSocialLinks {
  website?: string;
  spotify?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
  youtube?: string;
  patreon?: string;
}

interface ArtistPaymentLinks {
  venmo?: string;
  paypal?: string;
}

interface ArtistProfile {
  id: string;
  userId: string;
  name: string;
  bio: string;
  yearsActive: number;
  members: ArtistMember[];
  tourMonthsPerYear: number;
  tourVehicle: string;
  requireHomeStay: boolean;
  petAllergies?: string;
  dietaryRestrictions?: string;
  travelWithAnimals: boolean;
  ownSoundSystem: boolean;
  socialLinks: ArtistSocialLinks;
  paymentLinks: ArtistPaymentLinks;
  livePerformanceVideo?: string;
  cancellationPolicy: 'strict' | 'flexible';
  cancellationGuarantee?: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  photos?: Array<{
    id: string;
    url: string;
    alt: string;
    category: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

interface ArtistCardProps {
  artist: ArtistProfile;
  showBookingButton?: boolean;
}

export function ArtistCard({ artist, showBookingButton = false }: ArtistCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  const getGenreFromBio = () => {
    // Simple genre extraction - in real app, you'd have a proper genre field
    const genres = ['folk', 'rock', 'indie', 'country', 'blues', 'jazz', 'experimental'];
    const bio = artist.bio.toLowerCase();
    const foundGenre = genres.find(genre => bio.includes(genre));
    return foundGenre || 'music';
  };

  const allPhotos = artist.photos || [];
  const hasVideo = !!artist.livePerformanceVideo;
  
  const nextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % allPhotos.length);
  };
  
  const prevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  return (
    <Card hover clickable className="overflow-hidden group">
      <div className="relative">
        <div className="aspect-video relative bg-gray-200 overflow-hidden">
          {allPhotos.length > 0 ? (
            <div className="relative w-full h-full">
              {/* Photo carousel container */}
              <div 
                className="flex w-full h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentPhotoIndex * 100}%)` }}
              >
                {allPhotos.map((photo, index) => (
                  <div key={photo.id} className="w-full h-full flex-shrink-0">
                    <img
                      src={photo.url}
                      alt={`${artist.name} - ${photo.alt}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary-500 to-secondary-600 transition-all duration-500 group-hover:from-primary-600 group-hover:to-secondary-700">
              <Music className="w-12 h-12 text-white transition-transform duration-500 group-hover:scale-110" />
            </div>
          )}
        </div>
        
        {/* Photo navigation arrows */}
        {allPhotos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
        
        {/* Photo indicators */}
        {allPhotos.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {allPhotos.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentPhotoIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentPhotoIndex
                    ? 'bg-white shadow-lg'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to photo ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Approval status */}
        {artist.verified && (
          <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-600">
            <CheckCircle className="w-4 h-4" />
          </div>
        )}

        {/* Video play overlay */}
        {hasVideo && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 transition-all duration-300 transform scale-75 group-hover:scale-100">
              <Play className="w-6 h-6" />
            </div>
          </div>
        )}

        {/* Photo count badge */}
        {allPhotos.length > 1 && (
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {currentPhotoIndex + 1} / {allPhotos.length}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors duration-300">
              {artist.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <Badge 
                variant="default" 
                className="transition-all duration-300 group-hover:scale-105 group-hover:bg-primary-100 group-hover:text-primary-800"
              >
                {getGenreFromBio()}
              </Badge>
              <span className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                {artist.yearsActive} years active
              </span>
            </div>
          </div>

          {/* Band info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center transition-all duration-300 group-hover:text-primary-600">
              <Users className="w-4 h-4 mr-1" />
              {artist.members.length} {artist.members.length === 1 ? 'member' : 'members'}
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 transition-colors duration-300 group-hover:text-yellow-500" />
              {artist.rating.toFixed(1)} ({artist.reviewCount})
            </div>
          </div>

          {/* Tour info */}
          <div className="flex items-center space-x-2">
            <Badge 
              variant="default" 
              className="transition-all duration-300 group-hover:scale-105"
            >
              {artist.tourMonthsPerYear} months/year touring
            </Badge>
            {artist.requireHomeStay && (
              <Badge 
                variant="warning" 
                className="transition-all duration-300 group-hover:scale-105"
              >
                Needs lodging
              </Badge>
            )}
          </div>

          {/* Bio preview */}
          <p className="text-sm text-gray-600 line-clamp-2 transition-colors duration-300 group-hover:text-gray-700">
            {artist.bio}
          </p>

          {/* Social links preview */}
          {(artist.socialLinks.website || artist.socialLinks.spotify) && (
            <div className="flex items-center space-x-2">
              {artist.socialLinks.website && (
                <div className="transition-all duration-300 group-hover:scale-110 group-hover:text-primary-600">
                  <Globe className="w-4 h-4 text-gray-400" />
                </div>
              )}
              {artist.socialLinks.spotify && (
                <span className="text-xs text-green-600 font-medium transition-all duration-300 group-hover:text-green-700 group-hover:scale-105">
                  Spotify
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 transform transition-all duration-300 group-hover:translate-y-0 translate-y-1">
            <Link href={`/artists/${artist.id}`}>
              <Button variant="outline" size="sm" className="transition-all duration-300 hover:shadow-md">
                View Profile
              </Button>
            </Link>
            {showBookingButton && artist.verified && (
              <Link href={`/bookings/new?artistId=${artist.id}`}>
                <Button size="sm" className="transition-all duration-300 hover:shadow-lg">
                  Book Artist
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}