import React, { useState } from 'react';
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

const components = [
    { name: 'Battery', imageUrl: '../src/assets/images/battery.png' },
    { name: 'Black Cable', imageUrl: '../src/assets/images/black-cable.png' },
    { name: 'Capacitor', imageUrl: '../src/assets/images/capacitor.png' },
    { name: 'Potentiometer', imageUrl: '../src/assets/images/potentiometer.png' },
    { name: 'Red Cable', imageUrl: '../src/assets/images/red-cable.png' },
    { name: 'Red Led', imageUrl: '../src/assets/images/red-led.png' },
    { name: 'Resistance', imageUrl: '../src/assets/images/resistance.png' },
]; // Add your components here

interface SelectedComponent {
    name: string;
    quantity: number;
    imageUrl: string;
}

interface NewLabModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (selectedComponents: SelectedComponent[], filename: string, isAvailable: boolean) => void;
}

const NewLabModal: React.FC<NewLabModalProps> = ({ open, onClose, onSave }) => {
    const [filename, setFilename] = useState<string>('');
    const [isAvailable, setIsAvailable] = useState<boolean>(false);
    const [selectedComponent, setSelectedComponent] = useState<{ name: string; imageUrl: string } | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedComponents, setSelectedComponents] = useState<SelectedComponent[]>([]);

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

    const handleSave = () => {
        const formattedData = {
            filename,
            slots: selectedComponents.map(component => ({
                itemName: component.name,
                quantity: component.quantity
            })),
            isAvailable
        };
        console.log(JSON.stringify(formattedData, null, 2));
        onSave(selectedComponents, filename, isAvailable);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>New Lab</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={10}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Filename"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={2}>
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

export default NewLabModal;
