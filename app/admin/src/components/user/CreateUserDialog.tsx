'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Typography,
	Box,
	Grid,
	Avatar,
	Paper,
} from '@mui/material';
import { 
	Person as PersonIcon,
	Email as EmailIcon,
	Phone as PhoneIcon,
} from '@mui/icons-material';
import { DialogWrapper } from '../../common/dialogWrapper';
import { UserData, UserStatus } from '../../interfaces';
import toast from 'react-hot-toast';
import ImageUpload from '../common/ImageUpload';
import StatusChip from '../common/StatusChip';

interface CreateUserDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (userData: Partial<UserData>) => Promise<unknown>;
	mode?: 'create' | 'update';
	userData?: UserData;
	isLoading?: boolean;
}

interface FormData {
	fullName: string;
	email: string;
	phoneNumber: string;
	status: UserStatus;
	profilePhoto: string | null;
}

interface FormErrors {
	name?: string;
	email?: string;
	phoneNo?: string;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ 
	isOpen, 
	onClose, 
	onSave, 
	mode = 'create', 
	userData,
	isLoading = false
}) => {
	// const { user: currentUser } = useContext(UserContext);
	const [formData, setFormData] = useState<FormData>({
		fullName: '',
		email: '',
		phoneNumber: '',
		status: UserStatus.Active,
		profilePhoto: null,
	});

	const [errors, setErrors] = useState<FormErrors>({});

	// Populate form data when in update mode
	useEffect(() => {
		if (mode === 'update' && userData) {
			setFormData({
				fullName: userData.fullName,
				email: userData.email,
				phoneNumber: userData.phoneNumber || '',
				status: userData.status,
				profilePhoto: userData.profilePhoto,
			});
		}
	}, [mode, userData]);

	const handleInputChange = useCallback((field: keyof FormData, value: string | boolean) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field as keyof FormErrors]) {
			setErrors(prev => ({ ...prev, [field]: undefined }));
		}
	}, [errors]);

	const validateForm = useCallback((): boolean => {
		const newErrors: FormErrors = {};

		if (!formData.fullName.trim()) {
			newErrors.name = 'Full name is required';
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Please enter a valid email address';
		}

		if (formData.phoneNumber && !/^[+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
			newErrors.phoneNo = 'Please enter a valid phone number';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData]);

	const handleSave = useCallback(async () => {
		if (!validateForm()) {
			toast.error('Please fix the errors before saving');
			return;
		}

		try {
			const userData: Partial<UserData> = {
				...formData,
				profilePhoto: formData.profilePhoto || undefined,
			};
			await onSave(userData);
			onClose();
		} catch (error) {
			console.error('Error saving user:', error);
		}
	}, [formData, validateForm, onSave, onClose]);

	const handleClose = useCallback(() => {
		setFormData({
			fullName: '',
			email: '',
			phoneNumber: '',
			status: UserStatus.Active,
			profilePhoto: null,
		});
		setErrors({});
		onClose();
	}, [onClose]);

	const content = useMemo(() => (
		<Box sx={{ p: 0 }}>
			{/* Header Section */}
			<Box sx={{ 
				background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
				color: 'white',
				p: 3,
				borderRadius: '12px 12px 0 0',
				mb: 3
			}}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
					<Avatar sx={{ 
						bgcolor: 'rgba(255,255,255,0.2)', 
						width: 48, 
						height: 48 
					}}>
						<PersonIcon />
					</Avatar>
					<Box>
						<Typography variant="h6" fontWeight={600}>
							{mode === 'create' ? 'Create New User' : 'Update User'}
						</Typography>
						<Typography variant="body2" sx={{ opacity: 0.9 }}>
							{mode === 'create' 
								? 'Add a new user to the system' 
								: 'Update user information and settings'
							}
						</Typography>
					</Box>
				</Box>
			</Box>

			{/* Form Content */}
			<Box sx={{ px: 3, pb: 3 }}>
				<Grid container spacing={3}>
					{/* Profile Photo Section */}
					<Grid item xs={12} md={4}>
						<Paper sx={{ 
							p: 3, 
							textAlign: 'center',
							borderRadius: 3,
							boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
							border: '1px solid rgba(0,0,0,0.06)',
							background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
						}}>
							<Typography variant="h6" fontWeight={600} mb={2} color="text.primary">
								Profile Photo
							</Typography>
							<ImageUpload
								value={formData.profilePhoto || undefined}
								onChange={(imageUrl) => {
									setFormData(prev => ({
										...prev,
										profilePhoto: imageUrl
									}));
								}}
								accept="image/jpeg,image/png,image/webp"
								maxSize={5 * 1024 * 1024} // 5MB
								disabled={isLoading}
								buttonText="Upload Photo"
								avatarSize={120}
								name={formData.fullName}
							/>
							<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
								Recommended: Square image, max 5MB
							</Typography>
						</Paper>
					</Grid>

					{/* User Details Section */}
					<Grid item xs={12} md={8}>
						<Paper sx={{ 
							p: 3,
							borderRadius: 3,
							boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
							border: '1px solid rgba(0,0,0,0.06)',
							background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
						}}>
							<Typography variant="h6" fontWeight={600} mb={3} color="text.primary">
								User Information
							</Typography>
							
							<Grid container spacing={3}>
								{/* Full Name */}
								<Grid item xs={12} sm={6}>
									<TextField
										fullWidth
										label="Full Name"
										value={formData.fullName}
										onChange={(e) => handleInputChange('fullName', e.target.value)}
										error={!!errors.name}
										helperText={errors.name}
										required
										InputProps={{
											startAdornment: (
												<PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
											),
										}}
										sx={{
											'& .MuiOutlinedInput-root': {
												borderRadius: 2,
												'&:hover .MuiOutlinedInput-notchedOutline': {
													borderColor: 'primary.main',
												},
											},
										}}
									/>
								</Grid>

								{/* Email */}
								<Grid item xs={12} sm={6}>
									<TextField
										fullWidth
										label="Email Address"
										type="email"
										value={formData.email}
										onChange={(e) => handleInputChange('email', e.target.value)}
										error={!!errors.email}
										helperText={errors.email}
										required
										InputProps={{
											startAdornment: (
												<EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
											),
										}}
										sx={{
											'& .MuiOutlinedInput-root': {
												borderRadius: 2,
												'&:hover .MuiOutlinedInput-notchedOutline': {
													borderColor: 'primary.main',
												},
											},
										}}
									/>
								</Grid>

								{/* Phone Number */}
								<Grid item xs={12} sm={6}>
									<TextField
										fullWidth
										label="Phone Number"
										value={formData.phoneNumber}
										onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
										error={!!errors.phoneNo}
										helperText={errors.phoneNo}
										placeholder="+1 (555) 123-4567"
										InputProps={{
											startAdornment: (
												<PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
											),
										}}
										sx={{
											'& .MuiOutlinedInput-root': {
												borderRadius: 2,
												'&:hover .MuiOutlinedInput-notchedOutline': {
													borderColor: 'primary.main',
												},
											},
										}}
									/>
								</Grid>

								{/* Status */}
								<Grid item xs={12} sm={6}>
									<FormControl fullWidth>
										<InputLabel>Account Status</InputLabel>
										<Select
											value={formData.status}
											label="Account Status"
											onChange={(e) => handleInputChange('status', e.target.value)}
											sx={{
												borderRadius: 2,
												'& .MuiOutlinedInput-notchedOutline': {
													borderRadius: 2,
												},
											}}
										>
											{Object.values(UserStatus).map((status) => (
												<MenuItem key={status} value={status}>
													<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
														<StatusChip status={status} />
														{status}
													</Box>
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
							</Grid>

							{/* Current Status Display */}
							{mode === 'update' && (
								<Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
									<Typography variant="body2" color="text.secondary" mb={1}>
										Current Status:
									</Typography>
									<StatusChip status={formData.status} />
								</Box>
							)}
						</Paper>
					</Grid>
				</Grid>
			</Box>
		</Box>
	), [
		formData,
		errors,
		mode,
		handleInputChange,
		isLoading,
	]);

	return (
		<DialogWrapper
			isOpen={isOpen}
			onClose={handleClose}
			content={content}
			onSave={handleSave}
			onCancel={handleClose}
			saveButtonText={mode === 'create' ? 'Create User' : 'Update User'}
			cancelButtonText="Cancel"
			disableSave={isLoading}
			isLoadingActions={isLoading}
			maxWidth="xl"
			hideDividers
			customRadius
		/>
	);
};

export default CreateUserDialog; 