'use client';

import React, { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Box,
	TextField,
	Alert,
	Paper,
} from '@mui/material';
import { ContentCopy as CopyIcon, Check as CheckIcon } from '@mui/icons-material';

interface CreateUserSuccessDialogProps {
	isOpen: boolean;
	onClose: () => void;
	userEmail: string;
}

const CreateUserSuccessDialog: React.FC<CreateUserSuccessDialogProps> = ({
	isOpen,
	onClose,
	userEmail,
}) => {
	const [copied, setCopied] = useState(false);

	const handleCopyEmail = async () => {
		try {
			await navigator.clipboard.writeText(userEmail);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error('Failed to copy email:', error);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				style: { borderRadius: 16 },
			}}
		>
			<DialogTitle sx={{ m: 0, p: 2 }}>
				<Typography variant="h6" component="div">
					User Created Successfully! 🎉
				</Typography>
			</DialogTitle>
			<DialogContent dividers>
				<Box sx={{ py: 2 }}>
					<Alert severity="success" sx={{ mb: 3 }}>
						The user has been created successfully. Please share the email address below with the user.
					</Alert>

					<Paper sx={{ p: 3, mb: 3 }}>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
							<Typography variant="h6" color="primary">
								User Email
							</Typography>
							<Button
								variant="outlined"
								startIcon={copied ? <CheckIcon /> : <CopyIcon />}
								onClick={handleCopyEmail}
								size="small"
							>
								{copied ? 'Copied!' : 'Copy Email'}
							</Button>
						</Box>
						
						<Box>
							<Typography variant="subtitle2" gutterBottom>
								Email Address
							</Typography>
							<TextField
								fullWidth
								value={userEmail}
								variant="outlined"
								size="small"
								InputProps={{
									readOnly: true,
								}}
							/>
						</Box>
					</Paper>

					<Alert severity="info">
						<strong>Note:</strong> The user will receive login instructions via email.
					</Alert>
				</Box>
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<Button onClick={onClose} variant="contained" color="primary">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateUserSuccessDialog; 