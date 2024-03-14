import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
    // Style for the buffer bar
    [`& .${linearProgressClasses.dashed}`]: {
        height: '100%',
        borderRadius: 5,
        backgroundSize: '1rem 1rem',
        transform: 'translateY(3px)',
        // backgroundImage: `radial-gradient(${theme.palette.grey[theme.palette.mode === 'light' ? 400 : 600]} 3px)`,
        
        // animation: 'none', // Disable animation if you don't need the dashed animation
    },
    // Style for the additional layer for the buffer (if any)
    [`& .${linearProgressClasses.bar2Buffer}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#9DC7FF' : '#A0C7F3',
    },
}));

export default BorderLinearProgress;