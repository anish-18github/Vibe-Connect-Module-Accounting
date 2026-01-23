import React from 'react';
import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';

interface LoadingOverlayProps {
    open: boolean;
    message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    open,
    message = 'Loading...',
}) => (
    <Backdrop
        sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            flexDirection: 'column',
            gap: 2,
        }}
        open={open}
    >
        <CircularProgress color="inherit" size={40} />
        <Typography variant="h6" color="inherit">
            {message}
        </Typography>
    </Backdrop>
);
