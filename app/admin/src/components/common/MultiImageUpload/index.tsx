'use client';

import React, { useCallback, useState } from 'react';
import {
	Button,
	Typography,
	Box,
	CircularProgress,
	Grid,
	Card,
	CardMedia,
	IconButton,
} from '@mui/material';
import { 
	PhotoCamera as PhotoCameraIcon,
	Delete as DeleteIcon,
} from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/helpers/apiRequest';
import toast from 'react-hot-toast';

interface MultiImageUploadProps {
	onImagesUploaded: (imageUrls: string[]) => void;
	maxImages?: number;
	acceptedFileTypes?: string[];
	maxFileSize?: number; // in bytes
	disabled?: boolean;
	buttonText?: string;
}

const uploadImageMutation = async (file: File): Promise<string> => {
	const formData = new FormData();
  formData.append("fileToUpload", file);
  formData.append("path", "spot-images/");

	const response: {data: string} = await apiRequest({
		method: 'POST',
		url: '/common/upload-file',
		data: formData,
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

	return response?.data || '';
};

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
	onImagesUploaded,
	maxImages = 5,
	acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
	maxFileSize = 5 * 1024 * 1024, // 5MB default
	disabled = false,
	buttonText = 'Upload Images',
}) => {
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState(false);

	const uploadMutation = useMutation({
		mutationFn: uploadImageMutation,
		onSuccess: (imageUrl) => {
			const newImages = [...uploadedImages, imageUrl];
			setUploadedImages(newImages);
			onImagesUploaded(newImages);
			toast.success('Image uploaded successfully!');
		},
		onError: (error) => {
			console.error('Error uploading image:', error);
			toast.error('Failed to upload image. Please try again.');
		},
	});

	const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		// Check if we're at max capacity
		if (uploadedImages.length >= maxImages) {
			toast.error(`Maximum ${maxImages} images allowed.`);
			return;
		}

		const file = files[0];

		// Validate file type
		if (!acceptedFileTypes.includes(file.type)) {
			toast.error('Please select a valid image file (JPEG, PNG, or WebP).');
			return;
		}

		// Validate file size
		if (file.size > maxFileSize) {
			const maxSizeMB = maxFileSize / (1024 * 1024);
			toast.error(`Image size should be less than ${maxSizeMB}MB.`);
			return;
		}

		setIsUploading(true);
		try {
			await uploadMutation.mutateAsync(file);
		} finally {
			setIsUploading(false);
		}
	}, [uploadedImages, maxImages, acceptedFileTypes, maxFileSize, uploadMutation]);

	const handleRemoveImage = (index: number) => {
		const newImages = uploadedImages.filter((_, i) => i !== index);
		setUploadedImages(newImages);
		onImagesUploaded(newImages);
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			{/* Upload Button */}
			<Button
				variant="outlined"
				component="label"
				startIcon={<PhotoCameraIcon />}
				disabled={disabled || isUploading || uploadedImages.length >= maxImages}
				sx={{ alignSelf: 'flex-start' }}
			>
				{isUploading ? 'Uploading...' : buttonText}
				<input
					type="file"
					hidden
					accept={acceptedFileTypes.join(',')}
					onChange={handleImageUpload}
					disabled={disabled || isUploading || uploadedImages.length >= maxImages}
				/>
			</Button>

			{/* Upload Progress */}
			{isUploading && (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<CircularProgress size={20} />
					<Typography variant="body2" color="text.secondary">
						Uploading image...
					</Typography>
				</Box>
			)}

			{/* Uploaded Images Grid */}
			{uploadedImages.length > 0 && (
				<Grid container spacing={2}>
					{uploadedImages.map((imageUrl, index) => (
						<Grid item xs={12} sm={6} md={4} key={index}>
							<Card sx={{ position: 'relative' }}>
								<CardMedia
									component="img"
									height="150"
									image={imageUrl}
									alt={`Uploaded image ${index + 1}`}
									sx={{ objectFit: 'cover' }}
								/>
								<IconButton
									sx={{
										position: 'absolute',
										top: 8,
										right: 8,
										backgroundColor: 'rgba(0, 0, 0, 0.5)',
										color: 'white',
										'&:hover': {
											backgroundColor: 'rgba(0, 0, 0, 0.7)',
										},
									}}
									onClick={() => handleRemoveImage(index)}
									size="small"
								>
									<DeleteIcon fontSize="small" />
								</IconButton>
							</Card>
						</Grid>
					))}
				</Grid>
			)}

			{/* Info Text */}
			<Typography variant="caption" color="text.secondary">
				{uploadedImages.length}/{maxImages} images uploaded
			</Typography>
		</Box>
	);
};

export default MultiImageUpload; 