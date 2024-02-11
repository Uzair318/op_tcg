import React from 'react';
import { Button, Checkbox, Stack, Text } from "@chakra-ui/react";

function FilterPanel({ aggregations, onFilterChange, clearFilters, checkedBoxes }) {
    const handleCheckboxChange = (event, filterCategory, filterValue) => {
        onFilterChange(filterCategory, filterValue, event.target.checked);
    };

    const renderFilters = (category, filters) => {
        return (
            <Stack spacing={2}>
                <Text fontWeight="bold">{category}</Text>
                <Stack spacing={2} maxHeight="150px" overflowY="auto">
                    {Object.entries(filters).map(([value, count]) => (
                        <Checkbox
                            key={value}
                            onChange={(event) => handleCheckboxChange(event, category, value)}
                            isChecked={checkedBoxes[category] && checkedBoxes[category].includes(value)}
                        >
                            {value} ({count})
                        </Checkbox>
                    ))}
                </Stack>
            </Stack>
        );
    };

    return (
        <Stack spacing={4}>
            {Object.entries(aggregations).map(([category, filters]) => (
                <div key={category}>
                    {renderFilters(category, filters)}
                </div>
            ))}
            <Button onClick={clearFilters}>Clear Filters</Button>

        </Stack>
    );
}

export default FilterPanel;