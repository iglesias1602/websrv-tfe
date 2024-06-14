import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Typography, Button } from '@mui/material';

interface SubmitLabProps {
    selectedFile: string | null;
    handlePrintFileName: () => void;
}

const SubmitLab: React.FC<SubmitLabProps> = ({ selectedFile, handlePrintFileName }) => {
    const theme = useTheme();
    return (
        <Card>
            <CardHeader title="Submit laboratory" />
            <CardContent>
                <Typography fontSize="17px">
                    Selected File: {selectedFile || 'None'}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePrintFileName}
                    sx={{ mt: 2 }}
                >
                    Print File Name
                </Button>
            </CardContent>
        </Card>
    );
};

export default SubmitLab;
