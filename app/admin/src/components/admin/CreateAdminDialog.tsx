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
	Button,
	Avatar,
	Paper,
	Chip,
} from '@mui/material';
import { 
	AdminPanelSettings as AdminIcon,
	Email as EmailIcon,
	LockReset as LockResetIcon,
} from '@mui/icons-material';
import { DialogWrapper } from '../../common/dialogWrapper';
import { AdminData, AdminRole } from '../../interfaces';

import toast from 'react-hot-toast';
import ImageUpload from '../common/ImageUpload';


interface CreateAdminDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (adminData: Partial<AdminData>) => Promise<unknown>;
	onResetPassword?: (adminId: string) => Promise<unknown>;
	mode?: 'create' | 'update';
	adminData?: AdminData;
	isLoading?: boolean;
}

interface FormData {
	name: string;
	email: string;
	role: AdminRole;
	profilePhoto: string | null;
}

interface FormErrors {
	name?: string;
	email?: string;
	role?: string;
}

const CreateAdminDialog: React.FC<CreateAdminDialogProps> = ({ 
	isOpen, 
	onClose, 
	onSave, 
	onResetPassword,
	mode = 'create', 
	adminData,
	isLoading = false
}) => {

	const [formData, setFormData] = useState<FormData>({
		name: '',
		email: '',
		role: AdminRole.Admin,
		profilePhoto: null,
	});

	const [errors, setErrors] = useState<FormErrors>({});

	// Populate form data when in update mode
	useEffect(() => {
		if (mode === 'update' && adminData) {
			setFormData({
				name: adminData.name,
				email: adminData.email,
				role: adminData.role,
				profilePhoto: adminData.profilePhoto,
			});
		}
	}, [mode, adminData]);

	const handleInputChange = useCallback((field: keyof FormData, value: unknown) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field as keyof FormErrors]) {
			setErrors(prev => ({ ...prev, [field]: undefined }));
		}
	}, [errors]);

	const validateForm = useCallback((): boolean => {
		const newErrors: FormErrors = {};

		if (!formData.name.trim()) {
			newErrors.name = 'Name is required';
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Please enter a valid email address';
		}

		if (!formData.role) {
			newErrors.role = 'Role is required';
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
			const adminData: Partial<AdminData> = {
				...formData,
				profilePhoto: formData.profilePhoto || undefined,
			};
			await onSave(adminData);
			onClose();
		} catch (error) {
			console.error('Error saving admin:', error);
		}
	}, [formData, validateForm, onSave, onClose]);

	const handleClose = useCallback(() => {
		setFormData({
			name: '',
			email: '',
			role: AdminRole.Admin,
			profilePhoto: null,
		});
		setErrors({});
		onClose();
	}, [onClose]);

	const getRoleColor = (role: AdminRole) => {
		switch (role) {
			case AdminRole.Admin:
				return 'primary';
			case AdminRole.SubAdmin:
				return 'secondary';
			default:
				return 'default';
		}
	};

	const getRoleDescription = (role: AdminRole) => {
		switch (role) {
			case AdminRole.Admin:
				return 'Full system access and control';
			case AdminRole.SubAdmin:
				return 'Limited administrative access';
			default:
				return '';
		}
	};

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
						<AdminIcon />
					</Avatar>
					<Box>
						<Typography variant="h6" fontWeight={600}>
							{mode === 'create' ? 'Create New Admin' : 'Update Admin'}
						</Typography>
						<Typography variant="body2" sx={{ opacity: 0.9 }}>
							{mode === 'create' 
								? 'Add a new administrator to the system' 
								: 'Update administrator information and permissions'
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
								name={formData.name}
							/>
							<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
								Recommended: Square image, max 5MB
							</Typography>
						</Paper>
					</Grid>

					{/* Admin Details Section */}
					<Grid item xs={12} md={8}>
						<Paper sx={{ 
							p: 3,
							borderRadius: 3,
							boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
							border: '1px solid rgba(0,0,0,0.06)',
							background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
						}}>
							<Typography variant="h6" fontWeight={600} mb={3} color="text.primary">
								Administrator Information
							</Typography>
							
							<Grid container spacing={3}>
								{/* Name */}
								<Grid item xs={12} sm={6}>
									<TextField
										fullWidth
										label="Full Name"
										value={formData.name}
										onChange={(e) => handleInputChange('name', e.target.value)}
										error={!!errors.name}
										helperText={errors.name}
										required
										InputProps={{
											startAdornment: (
												<AdminIcon sx={{ mr: 1, color: 'text.secondary' }} />
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

								{/* Role */}
								<Grid item xs={12}>
									<FormControl fullWidth>
										<InputLabel>Administrative Role</InputLabel>
										<Select
											value={formData.role}
											label="Administrative Role"
											onChange={(e) => handleInputChange('role', e.target.value)}
											error={!!errors.role}
											sx={{
												borderRadius: 2,
												'& .MuiOutlinedInput-notchedOutline': {
													borderRadius: 2,
												},
											}}
										>
											{Object.values(AdminRole).map((role) => (
												<MenuItem key={role} value={role}>
													<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
																											<Chip 
														label={role} 
														color={getRoleColor(role)}
														size="small"
														variant="filled"
													/>
														<Box sx={{ flex: 1 }}>
															<Typography variant="body2" fontWeight={500}>
																{role}
															</Typography>
															<Typography variant="caption" color="text.secondary">
																{getRoleDescription(role)}
															</Typography>
														</Box>
													</Box>
												</MenuItem>
											))}
										</Select>
										{errors.role && (
											<Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
												{errors.role}
											</Typography>
										)}
									</FormControl>
								</Grid>
							</Grid>

							{/* Current Role Display */}
							{mode === 'update' && (
								<Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
									<Typography variant="body2" color="text.secondary" mb={1}>
										Current Role:
									</Typography>
									<Chip 
										label={formData.role} 
										color={getRoleColor(formData.role)}
										variant="filled"
									/>
									<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
										{getRoleDescription(formData.role)}
									</Typography>
								</Box>
							)}

							{/* Password Reset Section for Update Mode */}
							{mode === 'update' && onResetPassword && (
								<Box sx={{ mt: 3, p: 2, bgcolor: 'warning.50', borderRadius: 2, border: '1px solid', borderColor: 'warning.200' }}>
									<Typography variant="body2" fontWeight={600} color="warning.dark" mb={1}>
										Password Management
									</Typography>
									<Typography variant="caption" color="warning.dark" mb={2} display="block">
										Reset the admin&apos;s password. A new password will be generated and sent to their email.
									</Typography>
									<Button
										variant="outlined"
										color="warning"
										startIcon={<LockResetIcon />}
										onClick={() => onResetPassword(adminData?.id || '')}
										disabled={isLoading}
										sx={{ borderRadius: 2 }}
									>
										Reset Password
									</Button>
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
		onResetPassword,
		adminData?.id,
	]);

	return (
		<DialogWrapper
			isOpen={isOpen}
			onClose={handleClose}
			content={content}
			onSave={handleSave}
			onCancel={handleClose}
			saveButtonText={mode === 'create' ? 'Create Admin' : 'Update Admin'}
			cancelButtonText="Cancel"
			disableSave={isLoading}
			isLoadingActions={isLoading}
			maxWidth="xl"
			hideDividers
			customRadius
		/>
	);
};

export default CreateAdminDialog; 