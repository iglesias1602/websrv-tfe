import React, { useEffect, useState } from 'react';
import supabase from '@/components/authentication/SupabaseClient';
import Scrollbar from '@/components/Scrollbar';
import { Card, CardHeader, CardContent, Button, List, ListItem, ListItemText, Typography, ListItemButton } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledList = styled(List)(({ theme }) => ({
    width: '100%',
    maxHeight: '400px', // Adjust the height as needed
    overflowY: 'auto',
    fontSize: '17px',
}));


interface LabsListProps {
    setSelectedFile: (filename: string) => void;
}

const LabsList: React.FC<LabsListProps> = ({ setSelectedFile }) => {
    const [files, setFiles] = useState<any[]>([]);
    const [selectedFile, setSelectedFileState] = useState<string | null>(null);

    useEffect(() => {
        const fetchFiles = async () => {
            const { data, error } = await supabase
                .from('save_files') // Replace with your actual table name
                .select('filename'); // Assuming the column name is 'filename'

            if (error) {
                console.error('Error fetching files:', error);
            } else {
                setFiles(data || []);
            }
        };

        fetchFiles();
    }, []);

    const handleListItemClick = (filename: string) => {
        setSelectedFileState(filename);
        setSelectedFile(filename);
    };

    return (
        <Card>
            <CardHeader title="List of available laboratories" />
            <CardContent>
                <Scrollbar>
                    <StyledList>
                        {files.map((file, index) => (
                            <ListItemButton
                                key={index}
                                selected={selectedFile === file.filename}
                                onClick={() => handleListItemClick(file.filename)}
                            >
                                <ListItemText primary={file.filename} />
                            </ListItemButton>
                        ))}
                    </StyledList>
                </Scrollbar>
            </CardContent>
        </Card>
    );
};

export default LabsList;
