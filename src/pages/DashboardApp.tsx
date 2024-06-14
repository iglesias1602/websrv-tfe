import React, { useState } from 'react';
import { Box, Grid, Container, Typography } from '@mui/material';
import Page from '@/components/Page';
import {
    LabsList,
    SubmitLab,
} from '@/components/_dashboard/app';

const DashboardApp = (): JSX.Element => {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const handlePrintFileName = () => {
        if (selectedFile) {
            console.log(`Selected file is: ${selectedFile}`);
        } else {
            console.log('No file selected');
        }
    };

    return (
        <Page title="Electrical Simulation">
            <Container maxWidth="xl">
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Hi, Welcome back</Typography>
                </Box>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={6} lg={6}>
                        <LabsList setSelectedFile={setSelectedFile} />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <SubmitLab
                            selectedFile={selectedFile}
                            handlePrintFileName={handlePrintFileName}
                        />
                    </Grid>

                </Grid>
            </Container>
        </Page>
    );
};

export default DashboardApp;
