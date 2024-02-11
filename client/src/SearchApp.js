import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    useBreakpointValue,
    GridItem,
    Button,
    Text,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure
} from "@chakra-ui/react";
import Card from './Card';
import FilterPanel from './FilterPanel';
import Pagination from './Pagination';
import AsyncSelect from 'react-select/async';
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";

function SearchApp() {
    const [data, setData] = useState({ results: [], aggregations: {} });
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [checkedBoxes, setCheckedBoxes] = useState({});

    const size = 24;

    const { isOpen, onOpen, onClose } = useDisclosure();

    // Fetch data on mount and when query changes
    useEffect(() => {
        const fetchData = async () => {
            const from = (currentPage - 1) * size;

            let queryString = Object.entries(filters).reduce((acc, [category, values]) => {
                if (values.length > 0) {
                    acc.push(`${encodeURIComponent(category)}=${values.map(encodeURIComponent).join(',')}`);
                }
                return acc;
            }, []).join('&');

            if (query) {
                queryString += `&q=${encodeURIComponent(query)}`;
            }

            // Add size and from to query string
            queryString += `&size=${size}&from=${from}`;

            const baseUrl = 'https://b9t6o6h8h2.execute-api.us-east-1.amazonaws.com/';
            const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

            const response = await fetch(url);
            const data = await response.json();
            setData(data);
        };

        fetchData();
    }, [query, currentPage, filters]);


    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleFilterChange = (category, value, isChecked) => {
        // Update the filters state based on user interaction
        setFilters(prevFilters => {
            const updatedFilters = { ...prevFilters };
            if (isChecked) {
                if (!updatedFilters[category]) {
                    updatedFilters[category] = [];
                }
                updatedFilters[category].push(value);
            } else {
                updatedFilters[category] = updatedFilters[category].filter(v => v !== value);
            }
            return updatedFilters;
        });

        // Update the checkedBoxes state
        setCheckedBoxes(prevCheckedBoxes => {
            const updatedCheckedBoxes = { ...prevCheckedBoxes };
            if (!updatedCheckedBoxes[category]) {
                updatedCheckedBoxes[category] = [];
            }
            if (isChecked) {
                updatedCheckedBoxes[category].push(value);
            } else {
                updatedCheckedBoxes[category] = updatedCheckedBoxes[category].filter(v => v !== value);
            }
            return updatedCheckedBoxes;
        });
    };

    // Responsive grid columns
    const gridTemplateColumns = useBreakpointValue({
        base: "repeat(1, 1fr)",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
        xl: "repeat(5, 1fr)",
    });

    const loadOptions = async (inputValue) => {
        if (!inputValue) {
            return [];
        }

        const url = `https://b9t6o6h8h2.execute-api.us-east-1.amazonaws.com/suggestions?q=${encodeURIComponent(inputValue)}`;
        const response = await fetch(url);
        const data = await response.json();
        const productNames = data.map(item => item.productName);
        const uniqueProductNames = [...new Set(productNames)];

        return uniqueProductNames.map(name => ({ value: name, label: name }));
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: '100%', // Ensure the width is 100%
            backgroundColor: '#1A202C', // Example background color
            color: 'white', // Example text color
        }),
        input: (provided) => ({
            ...provided,
            color: 'white', // This ensures the text you type is white
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'white', // This ensures the selected value text is white
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? 'lightblue' : '#1A202C',
            color: 'white',
            '&:hover': {
                backgroundColor: 'lightblue',
            },
        }),
        // You can add more custom styles for other parts of the select component
    };

    return (
        <Box>
            <Box m={4}>
                <Box display="flex" alignItems="center" width="100%">
                    <Box flex="1">
                        <AsyncSelect
                            loadOptions={loadOptions}
                            onChange={({ value }) => {
                                setFilters({});
                                setCurrentPage(1);
                                setQuery(value);
                            }}
                            styles={customStyles}
                            value={query}
                        />
                    </Box>
                    {query && (
                        <Button onClick={() => setQuery('')} marginLeft="2">
                            <CloseIcon />
                        </Button>
                    )}
                </Box>
            </Box>
            <Box display="flex">
                <Button onClick={onOpen} display={{ base: "block", md: "none" }} m={4}>
                    <HamburgerIcon />
                </Button>
                <Drawer isOpen={isOpen} placement="left" onClose={onClose} destroyOnClose={false}>
                    <DrawerOverlay>
                        <DrawerContent>
                            <DrawerCloseButton />
                            <DrawerHeader>Filters</DrawerHeader>
                            <DrawerBody>
                                <FilterPanel
                                    aggregations={data.aggregations}
                                    onFilterChange={handleFilterChange}
                                    clearFilters={() => window.location.reload()}
                                    checkedBoxes={checkedBoxes}
                                />
                            </DrawerBody>
                        </DrawerContent>
                    </DrawerOverlay>
                </Drawer>
                <Box width="20%" p={4} display={{ base: "none", md: "block" }}>
                    <FilterPanel
                        aggregations={data.aggregations}
                        onFilterChange={handleFilterChange}
                        clearFilters={() => window.location.reload()}
                        checkedBoxes={checkedBoxes}
                    />
                </Box>
                <Box width="80%" p={4}>
                    {data.results.length === 0 ? (
                        <>
                            <Text>No search results found. Please try again.</Text>
                            <Button onClick={() => window.location.reload()}>Try Again</Button>
                        </>
                    ) : (
                        <Grid templateColumns={gridTemplateColumns} gap={6}>
                            {/* Map over your data to create a card for each item */}
                            {data.results.map((item, index) => (
                                <Box as={GridItem} key={index} colSpan={{ base: 1, md: 1 }}>
                                    <Card item={item} />
                                </Box>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Box>
            <Pagination
                currentPage={currentPage}
                totalResults={data.totalResults}
                size={size}
                onPageChange={handlePageChange}
            />
        </Box>

    );
}

export default SearchApp;