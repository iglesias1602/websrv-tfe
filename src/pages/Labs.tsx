import React, { useState, useEffect } from 'react';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { HeaderLabel, ILab } from '@/models';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import {
    Card,
    Table,
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination
} from '@mui/material';
import Page from '@/components/Page';
import Scrollbar from '@/components/Scrollbar';
import { LabListHead, LabListToolbar, LabMoreMenu } from '@/components/_dashboard/labs';
import supabase from '@/components/authentication/SupabaseClient'; // Import Supabase client
import NewLabModal from '@/components/_dashboard/labs/NewLabModal'; // Import the modal component
import EditLabModal from '@/components/_dashboard/labs/EditLabModal'; // Import the EditLabModal component
import BatteryImage from '@/assets/images/battery.png';
import BlackCableImage from '@/assets/images/black-cable.png';
import CapacitorImage from '@/assets/images/capacitor.png';
import PotentiometerImage from '@/assets/images/potentiometer.png';
import RedCableImage from '@/assets/images/red-cable.png';
import RedLedImage from '@/assets/images/red-led.png';
import ResistanceImage from '@/assets/images/resistance.png';

const TABLE_HEAD: HeaderLabel[] = [
    { id: 'filename', label: 'Filename', alignRight: false },
    { id: 'isAvailable', label: 'Availability', alignRight: false },
    { id: 'created_at', label: 'Created At', alignRight: false }, // New column for created_at
];

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

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(
            array,
            (_lab) => _lab.filename.toLowerCase().indexOf(query.toLowerCase()) !== -1
        );
    }
    return stabilizedThis.map((el) => el[0]);
}

const Labs = (): JSX.Element => {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState<ILab[]>([]);
    const [orderBy, setOrderBy] = useState('filename');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [labs, setLabs] = useState<ILab[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    const fetchLabs = async () => {
        const { data, error } = await supabase
            .from('save_files') // Replace with your actual table name
            .select('id, filename, is_available, created_at, file');

        if (error) {
            console.error('Error fetching labs:', error);
        } else {
            setLabs(data.map((lab: any) => ({
                id: lab.id,
                filename: lab.filename,
                isAvailable: lab.is_available ? 'Yes' : 'No',
                created_at: lab.created_at,
                components: lab.file?.slots || [] // Ensure components is always an array
            })));
        }
    };

    useEffect(() => {
        fetchLabs();
    }, []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(labs);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.findIndex(lab => lab.filename === name);
        let newSelected: ILab[] = [];
        if (selectedIndex === -1) {
            const foundLab = labs.find(lab => lab.filename === name);
            if (foundLab) {
                newSelected = newSelected.concat(selected, foundLab);
            }
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const handleNewLabClick = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleModalSave = async (selectedComponents: SelectedComponent[], filename: string, isAvailable: boolean) => {
        try {
            const formattedData = {
                filename,
                slots: selectedComponents.map(component => ({
                    itemName: component.name,
                    quantity: component.quantity
                })),
                isAvailable
            };

            const { error } = await supabase
                .from('save_files')
                .insert([{ filename, file: formattedData, is_available: isAvailable }]);

            if (error) {
                console.error('Error inserting data:', error);
            } else {
                console.log('Data inserted successfully:', formattedData);
                fetchLabs(); // Refresh the lab list after insertion
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    const handleEditLab = (lab) => {
        setEditData(lab);
        setEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setEditModalOpen(false);
        setEditData(null);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - labs.length) : 0;

    const filteredLabs = applySortFilter(labs, getComparator(order, orderBy), filterName);

    const isLabNotFound = filteredLabs.length === 0;

    return (
        <Page title="Labs | Minimal-UI">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Laboratories List
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleNewLabClick}
                        startIcon={<Icon icon={plusFill} />}
                    >
                        New Lab
                    </Button>
                </Stack>

                <Card>
                    <LabListToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                    />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <LabListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={labs.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredLabs
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            const {
                                                id,
                                                filename,
                                                isAvailable,
                                                created_at,
                                                components, // Add this line if you're fetching components data
                                            } = row;
                                            const isItemSelected = selected.findIndex(lab => lab.filename === filename) !== -1;

                                            return (
                                                <TableRow
                                                    hover
                                                    key={id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            onChange={(event) =>
                                                                handleClick(event, filename)
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Avatar>{filename.charAt(0)}</Avatar>
                                                            <Typography variant="subtitle2" noWrap>{filename}</Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">{isAvailable}</TableCell>
                                                    <TableCell align="left">{new Date(created_at).toLocaleString()}</TableCell>
                                                    <TableCell align="right">
                                                        <LabMoreMenu
                                                            labId={id}
                                                            filename={filename}
                                                            isAvailable={isAvailable === 'Yes'}
                                                            components={components} // Pass components data here
                                                            onDelete={async (id: number) => {
                                                                try {
                                                                    const { error } = await supabase
                                                                        .from('save_files')
                                                                        .delete()
                                                                        .eq('id', id);

                                                                    if (error) {
                                                                        console.error('Error deleting lab:', error);
                                                                    } else {
                                                                        fetchLabs(); // Refresh the lab list after deletion
                                                                    }
                                                                } catch (error) {
                                                                    console.error('Unexpected error:', error);
                                                                }
                                                            }}
                                                            onEdit={(lab: any) => handleEditLab(lab)}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                {isLabNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                No laboratories found
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={labs.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
            <NewLabModal
                open={modalOpen}
                onClose={handleModalClose}
                onSave={handleModalSave}
            />
            {editData && (
                <EditLabModal
                    open={editModalOpen}
                    onClose={handleEditModalClose}
                    initialData={{
                        labId: editData.id,
                        filename: editData.filename,
                        isAvailable: editData.isAvailable === 'Yes',
                        components: editData.components.map((component: any) => ({
                            name: component.itemName,
                            quantity: component.quantity,
                            imageUrl: getComponentImage(component.itemName)
                        }))
                    }}
                    onSave={fetchLabs} // Pass fetchLabs to EditLabModal to refresh the labs list after update
                />
            )}
        </Page>
    );
};

const getComponentImage = (itemName: string): string => {
    const component = components.find(c => c.name === itemName);
    return component ? component.imageUrl : '';
};

export default Labs;
