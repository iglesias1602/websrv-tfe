import React from 'react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
import { MotionContainer, varBounceIn } from '@/components/animate';
import Page from '@/components/Page';

const RootStyle = styled(Page)(({ theme }) => ({
    display: 'flex',
    minHeight: '100%',
    alignItems: 'center',
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(10)
}));

const UnauthorizedPage = (): JSX.Element => {
    return (
        <RootStyle>
            <Container>
                <MotionContainer initial="initial" open>
                    <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
                        <motion.div variants={varBounceIn}>
                            <Typography variant="h3" paragraph>
                                Unauthorized Access
                            </Typography>
                        </motion.div>
                        <Typography sx={{ color: 'text.secondary' }}>
                            Sorry, you do not have permission to view this page. Please contact your administrator if you believe this is an error.
                        </Typography>

                        <Button to="/login" size="large" variant="contained" component={RouterLink}>
                            Go to Login
                        </Button>
                    </Box>
                </MotionContainer>
            </Container>
        </RootStyle>
    );
};

export default UnauthorizedPage;
