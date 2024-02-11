import React from 'react';
import {
    Box,
    Image,
    Badge,
} from "@chakra-ui/react";

function Card({ item }) {
    const imageUrl = `https://product-images.tcgplayer.com/fit-in/200x279/${item.productId}.jpg`;

    return (
        <a href={`https://www.tcgplayer.com/product/${item.productId}`} target="_blank" rel="noopener noreferrer">
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden" width="200px">
                <Image src={imageUrl} alt={item.productName} objectFit="cover" />

                <Box p="6">
                    <Box mb={4}>
                        <Badge borderRadius="full" px="2" colorScheme="teal">
                            {item.rarityName?.join(', ')}
                        </Badge>
                        <Box
                            color="gray.500"
                            fontWeight="semibold"
                            letterSpacing="wide"
                            fontSize="xs"
                            textTransform="uppercase"
                            ml="2"
                        >
                            {item.color?.join(', ')} &bull; {item.cardType?.join(', ')}
                        </Box>
                    </Box>

                    <Box
                        mt="1"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        isTruncated
                    >
                        {item.productName}
                    </Box>

                    <Box>
                        {item.setName?.join(', ')}
                        <Box as="span" color="gray.600" fontSize="sm">
                            / {item.number}
                        </Box>
                    </Box>

                    <Box>
                        <Box as="span" fontWeight="semibold" fontSize="lg">
                            ${item.marketPrice?.toFixed(2)}
                        </Box>
                        <Box as="span" color="gray.600" fontSize="sm">
                            {` as low as $${item.lowestPriceWithShipping?.toFixed(2)}`}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </a>

    );
}

export default Card;