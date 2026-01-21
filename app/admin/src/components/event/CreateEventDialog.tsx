'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
	TextField,
	Typography,
	Box,
	Grid,
	FormControlLabel,
	Switch,
	Paper,
} from '@mui/material';
import { 
	Event as EventIcon,
	LocationOn as LocationIcon,
	Description as DescriptionIcon,
} from '@mui/icons-material';
import { DialogWrapper } from '../../common/dialogWrapper';
import { EventData, EventFormValues } from '../../interfaces';
import toast from 'react-hot-toast';
import moment from 'moment';

interface CreateEventDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (eventData: Partial<EventFormValues>) => Promise<unknown>;
	mode?: 'create' | 'update';
	eventData?: EventData | null;
	isLoading?: boolean;
}

/**
 * Initial form state
 */
const getInitialFormState = (): EventFormValues => ({
	title: '',
	description: '',
	location: '',
	startTime: '',
	endTime: '',
	startDate: '',
	endDate: '',
	isSingleDate: true,
});

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({
	isOpen,
	onClose,
	onSave,
	mode = 'create',
	eventData,
	isLoading = false,
}) => {
	// Form state
	const [formData, setFormData] = useState<EventFormValues>(getInitialFormState());
	const [errors, setErrors] = useState<Partial<EventFormValues>>({});

	/**
	 * Initializes form data when eventData changes
	 */
	useEffect(() => {
		if (eventData && mode === 'update') {
			setFormData({
				id: eventData.id,
				title: eventData.title,
				description: eventData.description || '',
				location: eventData.location,
				startTime: moment.utc(eventData.startTime).format('HH:mm'),
				endTime: moment.utc(eventData.endTime).format('HH:mm'),
				startDate: eventData.startDate,
				endDate: eventData.endDate || '',
				isSingleDate: eventData.isSingleDate,
			});
		} else {
			// Reset form for create mode
			setFormData(getInitialFormState());
		}
		setErrors({});
	}, [eventData, mode, isOpen]);

	/**
	 * Validates form data
	 */
	const validateForm = useCallback((): boolean => {
		const newErrors: Partial<EventFormValues> = {};

		if (!formData.title.trim()) {
			newErrors.title = 'Event title is required';
		}

		if (!formData.location.trim()) {
			newErrors.location = 'Location is required';
		}

		if (!formData.startTime) {
			newErrors.startTime = 'Start time is required';
		}

		if (!formData.endTime) {
			newErrors.endTime = 'End time is required';
		}

		if (!formData.startDate) {
			newErrors.startDate = 'Start date is required';
		}

		if (!formData.isSingleDate && !formData.endDate) {
			newErrors.endDate = 'End date is required for multi-day events';
		}

		// Time validation
		if (formData.startTime && formData.endTime) {
			const startTime = moment.utc(`2000-01-01 ${formData.startTime}`);
			const endTime =moment.utc(`2000-01-01 ${formData.endTime}`);
			if (startTime.isSameOrAfter(endTime)) {
				newErrors.endTime = 'End time must be after start time';
			}
		}

		// Date validation
		if (formData.startDate && formData.endDate && !formData.isSingleDate) {
			const startDate = moment.utc(formData.startDate);
			const endDate = moment.utc(formData.endDate);
			if (startDate.isAfter(endDate)) {
				newErrors.endDate = 'End date must be after or equal to start date';
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData]);

	/**
	 * Handles form input changes
	 */
	const handleInputChange = useCallback((field: keyof EventFormValues, value: string | boolean) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: undefined }));
		}
	}, [errors]);

	/**
	 * Handles form submission
	 */
	const handleSubmit = useCallback(async () => {
		if (!validateForm()) {
			toast.error('Please fix the errors in the form');
			return;
		}

		try {
			await onSave(formData);
			onClose();
		} catch {
			toast.error('Failed to save event. Please try again.');
		}
	}, [validateForm, onSave, formData, onClose]);

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
					<EventIcon sx={{ 
						bgcolor: 'rgba(255,255,255,0.2)', 
						width: 48, 
						height: 48,
						p: 1,
						borderRadius: 2
					}} />
					<Box>
						<Typography variant="h6" fontWeight={600}>
							{mode === 'create' ? 'Create New Event' : 'Update Event'}
						</Typography>
						<Typography variant="body2" sx={{ opacity: 0.9 }}>
							{mode === 'create' 
								? 'Add a new event to the system' 
								: 'Update event information and details'
							}
						</Typography>
					</Box>
				</Box>
			</Box>

			{/* Form Content */}
			<Box sx={{ px: 3, pb: 3 }}>
				<Grid container spacing={3}>
					{/* Event Details Section */}
					<Grid item xs={12}>
						<Paper sx={{ 
							p: 3,
							borderRadius: 3,
							boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
							border: '1px solid rgba(0,0,0,0.06)',
							background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
						}}>
							<Typography variant="h6" fontWeight={600} mb={3} color="text.primary">
								Event Information
							</Typography>
							
							<Grid container spacing={3}>
								{/* Event Title */}
								<Grid item xs={12}>
									<TextField
										fullWidth
										label="Event Title"
										value={formData.title}
										onChange={(e) => handleInputChange('title', e.target.value)}
										error={!!errors.title}
										helperText={errors.title}
										placeholder="Enter event title"
										required
										InputProps={{
											startAdornment: (
												<EventIcon sx={{ mr: 1, color: 'text.secondary' }} />
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

								{/* Description */}
								<Grid item xs={12}>
									<TextField
										fullWidth
										label="Description (Optional)"
										value={formData.description}
										onChange={(e) => handleInputChange('description', e.target.value)}
										multiline
										rows={3}
										placeholder="Enter event description"
										InputProps={{
											startAdornment: (
												<DescriptionIcon sx={{ mr: 1, color: 'text.secondary', mt: 1 }} />
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

								{/* Location */}
								<Grid item xs={12}>
									<TextField
										fullWidth
										label="Location"
										value={formData.location}
										onChange={(e) => handleInputChange('location', e.target.value)}
										error={!!errors.location}
										helperText={errors.location}
										placeholder="Enter event location"
										required
										InputProps={{
											startAdornment: (
												<LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
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
							</Grid>
						</Paper>
					</Grid>

					{/* Date and Time Section */}
					<Grid item xs={12}>
						<Paper sx={{ 
							p: 3,
							borderRadius: 3,
							boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
							border: '1px solid rgba(0,0,0,0.06)',
							background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
						}}>
							<Typography variant="h6" fontWeight={600} mb={3} color="text.primary">
								Date & Time
							</Typography>

							{/* Single Date Toggle */}
							<Box sx={{ mb: 3 }}>
								<FormControlLabel
									control={
										<Switch
											checked={formData.isSingleDate}
											onChange={(e) => handleInputChange('isSingleDate', e.target.checked)}
										/>
									}
									label="Single Day Event"
								/>
							</Box>
							
							<Grid container spacing={3}>
								{/* Start Date */}
								<Grid item xs={12} md={6}>
									<TextField
										fullWidth
										label="Start Date"
										type="date"
										value={formData.startDate}
										onChange={(e) => handleInputChange('startDate', e.target.value)}
										error={!!errors.startDate}
										helperText={errors.startDate}
										required
										InputLabelProps={{ shrink: true }}
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

								{/* End Date */}
								<Grid item xs={12} md={6}>
									<TextField
										fullWidth
										label="End Date"
										type="date"
										value={formData.endDate}
										onChange={(e) => handleInputChange('endDate', e.target.value)}
										error={!!errors.endDate}
										helperText={errors.endDate}
										InputLabelProps={{ shrink: true }}
										disabled={formData.isSingleDate}
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

								{/* Start Time */}
								<Grid item xs={12} md={6}>
									<TextField
										fullWidth
										label="Start Time"
										type="time"
										value={formData.startTime}
										onChange={(e) => handleInputChange('startTime', e.target.value)}
										error={!!errors.startTime}
										helperText={errors.startTime}
										required
										InputLabelProps={{ shrink: true }}
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

								{/* End Time */}
								<Grid item xs={12} md={6}>
									<TextField
										fullWidth
										label="End Time"
										type="time"
										value={formData.endTime}
										onChange={(e) => handleInputChange('endTime', e.target.value)}
										error={!!errors.endTime}
										helperText={errors.endTime}
										required
										InputLabelProps={{ shrink: true }}
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
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</Box>
		</Box>
	), [formData, errors, mode, handleInputChange]);

	return (
		<DialogWrapper
			isOpen={isOpen}
			onClose={onClose}
			content={content}
			onSave={handleSubmit}
			onCancel={onClose}
			saveButtonText={mode === 'create' ? 'Create Event' : 'Update Event'}
			cancelButtonText="Cancel"
			disableSave={isLoading}
			isLoadingActions={isLoading}
			maxWidth="xl"
			hideDividers
			customRadius
		/>
	);
};

export default CreateEventDialog; 