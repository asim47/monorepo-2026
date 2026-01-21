'use client';

import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Box,
	Paper,
	IconButton,
	Tooltip,
} from '@mui/material';
import { 
	ContentCopy as CopyIcon,
	Visibility as VisibilityIcon,
	VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

interface PasswordDisplayDialogProps {
	isOpen: boolean;
	onClose: () => void;
	password: string;
	title: string;
	message: string;
	adminEmail?: string;
}

const PasswordDisplayDialog: React.FC<PasswordDisplayDialogProps> = ({
	isOpen,
	onClose,
	password,
	title,
	message,
	adminEmail,
}) => {
	const [showPassword, setShowPassword] = React.useState(false);

	const handleCopyPassword = async () => {
		try {
			await navigator.clipboard.writeText(password);
			toast.success('Password copied to clipboard!');
		} catch (error) {
			console.error('Failed to copy password:', error);
			toast.error('Failed to copy password to clipboard');
		}
	};

	const handleTogglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 2,
					boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
				},
			}}
		>
			<DialogTitle sx={{ 
				pb: 1, 
				borderBottom: '1px solid #e0e0e0',
				backgroundColor: '#f8f9fa',
				borderRadius: '8px 8px 0 0'
			}}>
				<Typography variant="h6" fontWeight="bold" color="primary">
					{title}
				</Typography>
			</DialogTitle>
			
			<DialogContent sx={{ pt: 3, pb: 2 }}>
				<Box sx={{ mb: 3 }}>
					<Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
						{message}
					</Typography>
					
					{adminEmail && (
						<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
							Email: <strong>{adminEmail}</strong>
						</Typography>
					)}
				</Box>

				<Paper
					elevation={0}
					sx={{
						p: 2,
						border: '2px solid #e3f2fd',
						borderRadius: 2,
						backgroundColor: '#f3f8ff',
						position: 'relative',
					}}
				>
					<Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
						Generated Password:
					</Typography>
					
					<Box sx={{ 
						display: 'flex', 
						alignItems: 'center', 
						gap: 1,
						backgroundColor: '#ffffff',
						border: '1px solid #e0e0e0',
						borderRadius: 1,
						p: 1.5,
						pr: 0.5,
					}}>
						<Typography
							variant="h6"
							fontFamily="monospace"
							sx={{
								flex: 1,
								letterSpacing: 2,
								fontWeight: 'bold',
								color: '#1976d2',
								userSelect: 'text',
								cursor: 'text',
							}}
						>
							{showPassword ? password : '•'.repeat(password.length)}
						</Typography>
						
						<Tooltip title={showPassword ? 'Hide password' : 'Show password'}>
							<IconButton
								size="small"
								onClick={handleTogglePasswordVisibility}
								sx={{ color: '#666' }}
							>
								{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
							</IconButton>
						</Tooltip>
						
						<Tooltip title="Copy password">
							<IconButton
								size="small"
								onClick={handleCopyPassword}
								sx={{ color: '#666' }}
							>
								<CopyIcon />
							</IconButton>
						</Tooltip>
					</Box>
				</Paper>

				<Box sx={{ mt: 2 }}>
					<Typography variant="caption" color="warning.main" sx={{ fontStyle: 'italic' }}>
						⚠️ Please save this password securely. It won&apos;t be shown again.
					</Typography>
				</Box>
			</DialogContent>

			<DialogActions sx={{ 
				p: 2, 
				borderTop: '1px solid #e0e0e0',
				backgroundColor: '#f8f9fa',
				borderRadius: '0 0 8px 8px'
			}}>
				<Button
					onClick={onClose}
					variant="contained"
					color="primary"
					sx={{ minWidth: 100 }}
				>
					Got it
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default PasswordDisplayDialog; 