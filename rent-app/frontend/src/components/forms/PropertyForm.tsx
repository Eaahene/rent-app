'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { PropertyType, PropertyStatus, Property } from '@/types';
import { PROPERTY_TYPE_LABELS, AMENITY_LABELS, REGIONS } from '@/lib/utils';
import { uploadService } from '@/services/upload';
import toast from 'react-hot-toast';

const MAX_IMAGES = 10;
const MIN_IMAGES = 1;

const propertySchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  price: z.number().positive(),
  region: z.string().min(1),
  city: z.string().min(1),
  area: z.string().min(1),
  address: z.string().min(1),
  propertyType: z.nativeEnum(PropertyType),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  maxTenants: z.number().int().min(1).default(1),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.object({ url: z.string(), publicId: z.string() }))
    .min(MIN_IMAGES, `At least ${MIN_IMAGES} image is required`)
    .max(MAX_IMAGES, `Maximum ${MAX_IMAGES} images allowed`),
  status: z.nativeEnum(PropertyStatus).default(PropertyStatus.AVAILABLE),
  contactPhone: z.string().min(8),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  initialData?: Property;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  isLoading?: boolean;
}

export function PropertyForm({ initialData, onSubmit, isLoading }: PropertyFormProps) {
  const [uploadingImages, setUploadingImages] = useState(false);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      region: initialData?.region || '',
      city: initialData?.city || '',
      area: initialData?.area || '',
      address: initialData?.address || '',
      propertyType: initialData?.propertyType || PropertyType.APARTMENT,
      bedrooms: initialData?.bedrooms || 0,
      bathrooms: initialData?.bathrooms || 1,
      maxTenants: initialData?.maxTenants || 1,
      amenities: initialData?.amenities || [],
      images: initialData?.images || [],
      status: initialData?.status || PropertyStatus.AVAILABLE,
      contactPhone: initialData?.contactPhone || '',
    },
  });

  const images = form.watch('images');
  const amenities = form.watch('amenities');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remaining);
    if (filesToUpload.length < files.length) {
      toast.error(`Only ${remaining} more image(s) can be added`);
    }

    setUploadingImages(true);
    try {
      const response = await uploadService.uploadImages(filesToUpload);
      const newImages = response.data;
      form.setValue('images', [...images, ...newImages]);
      toast.success(`${newImages.length} image(s) uploaded successfully`);
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    form.setValue('images', newImages);
  };

  const toggleAmenity = (amenity: string) => {
    const current = amenities;
    if (current.includes(amenity)) {
      form.setValue('amenities', current.filter((a) => a !== amenity));
    } else {
      form.setValue('amenities', [...current, amenity]);
    }
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Modern 2-Bedroom Apartment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your property in detail..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Rent (GH₵)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {REGIONS.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Accra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area/Neighborhood</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Osu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PropertyStatus.AVAILABLE}>Available</SelectItem>
                        <SelectItem value={PropertyStatus.OCCUPIED}>Occupied</SelectItem>
                        <SelectItem value={PropertyStatus.PENDING}>Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxTenants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Tenants</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(AMENITY_LABELS).map(([value, label]) => (
                <Button
                  key={value}
                  type="button"
                  variant={amenities.includes(value) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleAmenity(value)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <p className="text-sm text-muted-foreground">
              Upload at least 1 image (max {MAX_IMAGES}). First image is the cover.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                  <img
                    src={image.url}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                      Cover
                    </span>
                  )}
                </div>
              ))}

              {images.length < MAX_IMAGES && (
                <label className="aspect-square rounded-lg border-2 border-dashed cursor-pointer flex flex-col items-center justify-center hover:bg-muted transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                  />
                  {uploadingImages ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <ImagePlus className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">Add Image</span>
                    </>
                  )}
                </label>
              )}
            </div>
            {images.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {images.length}/{MAX_IMAGES} images uploaded
              </p>
            )}
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isLoading || uploadingImages}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : initialData ? (
            'Update Property'
          ) : (
            'Create Property'
          )}
        </Button>
      </form>
    </Form>
  );
}
