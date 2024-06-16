import { Icon } from '@iconify/react';
import React, { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { ILab } from '@/models'; // Import the ILab interface

interface LabMoreMenuProps {
    labId: number;
    filename: string;
    isAvailable: boolean;
    components: { name: string; quantity: number; imageUrl: string; }[];
    onDelete: (id: number) => void;
    onEdit: (lab: ILab) => void;
}

const LabMoreMenu = ({ labId, filename, isAvailable, components, onDelete, onEdit }: LabMoreMenuProps): JSX.Element => {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDeleteClick = () => {
        setIsOpen(false);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        onDelete(labId);
        setIsDialogOpen(false);
    };

    return (
        <>
            <IconButton ref={ref} onClick={() => setIsOpen(true)}>
                <Icon icon={moreVerticalFill} width={20} height={20} />
            </IconButton>

            <Menu
                open={isOpen}
                anchorEl={ref.current}
                onClose={() => setIsOpen(false)}
                PaperProps={{
                    sx: { width: 200, maxWidth: '100%' }
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem
                    sx={{ color: 'text.secondary' }}
                    onClick={handleDeleteClick}
                >
                    <ListItemIcon>
                        <Icon icon={trash2Outline} width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>

                <MenuItem
                    component={RouterLink}
                    to="#"
                    sx={{ color: 'text.secondary' }}
                    onClick={() => {
                        setIsOpen(false);
                        onEdit({
                            id: labId.toString(),
                            filename,
                            isAvailable: isAvailable ? 'Yes' : 'No', // Convert boolean to string
                            components,
                            created_at: ''
                        }); // Adjust as needed
                    }}
                >
                    <ListItemIcon>
                        <Icon icon={editFill} width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>
            </Menu>

            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this file?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default LabMoreMenu;
