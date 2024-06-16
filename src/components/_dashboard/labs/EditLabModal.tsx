import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    Avatar,
    Box,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import supabase from '@/components/authentication/SupabaseClient'; // Import Supabase client
import BatteryImage from '@/assets/images/battery.png';
import BlackCableImage from '@/assets/images/black-cable.png';
import CapacitorImage from '@/assets/images/capacitor.png';
import PotentiometerImage from '@/assets/images/potentiometer.png';
import RedCableImage from '@/assets/images/red-cable.png';
import RedLedImage from '@/assets/images/red-led.png';
import ResistanceImage from '@/assets/images/resistance.png';

const components = [
    { name: 'Battery', imageUrl: BatteryImage },
    { name: 'Black Cable', imageUrl: BlackCableImage },
    { name: 'Capacitor', imageUrl: CapacitorImage },
    { name: 'Potentiometer', imageUrl: PotentiometerImage },
    { name: 'Red Cable', imageUrl: RedCableImage },
    { name: 'Red Led', imageUrl: RedLedImage },
    { name: 'Resistance', imageUrl: ResistanceImage },
]; // Add your components here

interface SelectedComponent {
    name: string;
    quantity: number;
    imageUrl: string;
}

interface EditLabModalProps {
    open: boolean;
    onClose: () => void;
    initialData: {
        labId: string;
        filename: string;
        isAvailable: boolean;
        components: SelectedComponent[];
    };
    onSave: () => void; // Add onSave prop
}

const EditLabModal: React.FC<EditLabModalProps> = ({ open, onClose, initialData, onSave }) => {
    const [filename, setFilename] = useState<string>(initialData.filename);
    const [isAvailable, setIsAvailable] = useState<boolean>(initialData.isAvailable);
    const [selectedComponent, setSelectedComponent] = useState<{ name: string; imageUrl: string } | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedComponents, setSelectedComponents] = useState<SelectedComponent[]>([]);

    useEffect(() => {
        setFilename(initialData.filename);
        setIsAvailable(initialData.isAvailable);
        const mappedComponents = initialData.components.map(component => ({
            name: component.name,
            quantity: component.quantity,
            imageUrl: getComponentImage(component.name)
        }));
        setSelectedComponents(mappedComponents);
    }, [initialData]);

    const handleAddComponent = () => {
        if (selectedComponent && quantity > 0) {
            setSelectedComponents((prevComponents) => {
                const existingComponent = prevComponents.find(
                    (component) => component.name === selectedComponent.name
                );

                if (existingComponent) {
                    return prevComponents.map((component) =>
                        component.name === selectedComponent.name
                            ? { ...component, quantity: component.quantity + quantity }
                            : component
                    );
                } else {
                    return [...prevComponents, { ...selectedComponent, quantity }];
                }
            });
        }
    };

    const handleRemoveComponent = (name: string) => {
        setSelectedComponents(selectedComponents.filter((component) => component.name !== name));
    };

    const handleSave = async () => {
        try {
            const slots = selectedComponents.map(component => ({
                itemName: component.name,
                quantity: component.quantity
            }));

            // Log only the slots array
            console.log(JSON.stringify({ slots }, null, 2));

            // Send the complete data to the server
            const { error } = await supabase
                .from('save_files')
                .update({
                    filename,
                    is_available: isAvailable,
                    file: { slots },
                    modified_at: new Date()
                })
                .eq('id', initialData.labId);

            if (error) {
                console.error('Error updating data:', error);
            } else {
                console.log('Data updated successfully');
                onSave(); // Call onSave to refresh the labs list
                onClose(); // Close the modal after successful update
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Edit Lab</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={8}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Filename"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isAvailable}
                                    onChange={(e) => setIsAvailable(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Available"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Available Components</Typography>
                        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                            <List>
                                {components.map((component) => (
                                    <ListItem
                                        key={component.name}
                                        button
                                        selected={selectedComponent?.name === component.name}
                                        onClick={() => setSelectedComponent(component)}
                                    >
                                        <Avatar src={component.imageUrl} alt={component.name} />
                                        <ListItemText primary={component.name} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Selected Components</Typography>
                        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                            <List>
                                {selectedComponents.map((component, index) => (
                                    <ListItem key={index}>
                                        <Avatar src={component.imageUrl} alt={component.name} />
                                        <ListItemText
                                            primary={`${component.name} (Quantity: ${component.quantity})`}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                aria-label="remove"
                                                onClick={() => handleRemoveComponent(component.name)}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                            inputProps={{ min: 1 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            startIcon={<AddIcon />}
                            onClick={handleAddComponent}
                            disabled={!selectedComponent}
                        >
                            Add
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary" disabled={!filename}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const getComponentImage = (itemName: string): string => {
    const component = components.find(c => c.name === itemName);
    return component ? component.imageUrl : '';
};

export default EditLabModal;
