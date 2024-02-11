import React from 'react';
import {  Button, Flex, Text } from '@chakra-ui/react';

function Pagination({ currentPage, totalResults, size, onPageChange }) {
    const totalPages = Math.ceil(totalResults / size);
    const pageNumbers = [];
    const visiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages) {
        if (currentPage < totalPages / 2) {
            endPage = Math.min(totalPages, endPage + (visiblePages - (endPage - startPage)));
        } else {
            startPage = Math.max(1, startPage - (visiblePages - (endPage - startPage)));
        }
    }

    for (let number = startPage; number <= endPage; number++) {
        pageNumbers.push(number);
    }

    const handlePageChange = (newPage) => {
        onPageChange(newPage);
        window.scrollTo(0, 0); // Scroll to the top of the page
    };

    return (
        <Flex align="center" justify="center" mt={4}>
            <Button
                onClick={() => handlePageChange(1)}
                isDisabled={currentPage === 1}
                mr={1}
                colorScheme="blue"
                variant="ghost"
            >
                {'<<'}
            </Button>
            <Button
                onClick={() => handlePageChange(currentPage - 1)}
                isDisabled={currentPage === 1}
                mr={1}
                colorScheme="blue"
                variant="ghost"
            >
                {'<'}
            </Button>
            {pageNumbers.map(number => (
                <Button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    isActive={number === currentPage}
                    mr={1}
                    colorScheme="blue"
                    variant={number === currentPage ? 'solid' : 'ghost'}
                >
                    {number}
                </Button>
            ))}
            {endPage < totalPages && (
                <>
                    <Text mx={2}>...</Text>
                    <Button
                        onClick={() => handlePageChange(totalPages)}
                        colorScheme="blue"
                        variant="ghost"
                    >
                        {totalPages}
                    </Button>
                </>
            )}
            <Button
                onClick={() => handlePageChange(currentPage + 1)}
                isDisabled={currentPage === totalPages}
                ml={1}
                colorScheme="blue"
                variant="ghost"
            >
                {'>'}
            </Button>
            <Button
                onClick={() => handlePageChange(totalPages)}
                isDisabled={currentPage === totalPages}
                ml={1}
                colorScheme="blue"
                variant="ghost"
            >
                {'>>'}
            </Button>
        </Flex>
    );
}

export default Pagination;