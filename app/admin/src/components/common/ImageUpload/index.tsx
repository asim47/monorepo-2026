'use client';

import React, { useCallback, useState } from 'react';
import {
	Avatar,
	Button,
	Typography,
	Box,
	CircularProgress,
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/helpers/apiRequest';
import toast from 'react-hot-toast';


interface ImageUploadProps {
	value?: string;
	onChange: (imageUrl: string) => void;
	avatarSize?: number;
	buttonText?: string;
	accept?: string;
	maxSize?: number; // in bytes
	disabled?: boolean;
	name?: string; // Add name prop for initials
}

const uploadImageMutation = async (file: File): Promise<string> => {
	const formData = new FormData();
  formData.append("fileToUpload", file);
  formData.append("path", "profile-pictures/");


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

const ImageUpload: React.FC<ImageUploadProps> = ({
	value,
	onChange,
	avatarSize = 100,
	buttonText = 'Upload Photo',
	accept = 'image/*',
	maxSize = 5 * 1024 * 1024, // 5MB default
	disabled = false,
	name,
}) => {
	const [isUploading, setIsUploading] = useState(false);

	const uploadMutation = useMutation({
		mutationFn: uploadImageMutation,
		onSuccess: (imageUrl) => {
			onChange(imageUrl);
      console.log(">>>>>>>>>>>>>>>>", imageUrl)
			toast.success('Image uploaded successfully!');
		},
		onError: (error) => {
			console.error('Error uploading image:', error);
			toast.error('Failed to upload image. Please try again.');
		},
	});

	const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			toast.error('Please select a valid image file.');
			return;
		}

		// Validate file size
		if (file.size > maxSize) {
			const maxSizeMB = maxSize / (1024 * 1024);
			toast.error(`Image size should be less than ${maxSizeMB}MB.`);
			return;
		}

		setIsUploading(true);
		try {
			await uploadMutation.mutateAsync(file);
		} finally {
			setIsUploading(false);
		}
	}, [maxSize, uploadMutation]);

	const getInitials = (name?: string) => {
		if (!name) return 'U';
		return name.charAt(0).toUpperCase();
	};

	console.log('ImageUpload render - value:', value, 'name:', name); // Debug log
	console.log('Avatar src will be:', value); // Debug log

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
			<Box sx={{ position: 'relative' }}>
				<Avatar
					src={value}
					sx={{ 
						width: avatarSize, 
						height: avatarSize,
						border: '2px solid #e0e0e0',
					}}
					imgProps={{
						onError: (e) => {
							console.error('Avatar image failed to load:', e);
						},
						onLoad: () => {
							console.log('Avatar image loaded successfully');
						}
					}}
				>
					{getInitials(name)}
				</Avatar>
				{isUploading && (
					<Box
						sx={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							backgroundColor: 'rgba(0, 0, 0, 0.5)',
							borderRadius: '50%',
						}}
					>
						<CircularProgress size={24} color="primary" />
					</Box>
				)}
			</Box>
			
			<Button
				variant="outlined"
				component="label"
				startIcon={<PhotoCameraIcon />}
				disabled={disabled || isUploading}
				sx={{ mt: 1 }}
			>
				{isUploading ? 'Uploading...' : buttonText}
				<input
					type="file"
					hidden
					accept={accept}
					onChange={handleImageUpload}
					disabled={disabled || isUploading}
				/>
			</Button>
			
			{value && !isUploading && (
				<Typography variant="caption" color="text.secondary">
					Image uploaded successfully
				</Typography>
			)}
		</Box>
	);
};

export default ImageUpload; 