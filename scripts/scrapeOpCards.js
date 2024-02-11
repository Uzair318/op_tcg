const axios = require('axios');
const fs = require('fs').promises;

const main = async () => {
    let allCards = [];
    let from = 0;
    const size =50; // Number of results per request
    let totalResults = 0;
    let hasMore = true;

    while (hasMore) {
        console.log(`Fetching cards from index ${from}...`);
        const response = await axios.post(
            'https://mp-search-api.tcgplayer.com/v1/search/request',
            {
                'algorithm': 'sales_exp_fields_experiment',
                'from': from,
                'size': size,
                'filters': {
                    'term': {
                        'productLineName': [
                            'one-piece-card-game'
                        ]
                    },
                    'range': {},
                    'match': {}
                },
                'listingSearch': {
                    'context': {
                        'cart': {}
                    },
                    'filters': {
                        'term': {
                            'sellerStatus': 'Live',
                            'channelId': 0
                        },
                        'range': {
                            'quantity': {
                                'gte': 1
                            }
                        },
                        'exclude': {
                            'channelExclusion': 0
                        }
                    }
                },
                'context': {
                    'cart': {},
                    'shippingCountry': 'US',
                    'userProfile': {
                        'productLineAffinity': null
                    }
                },
                'settings': {
                    'useFuzzySearch': true,
                    'didYouMean': {}
                },
                'sort': {
                    'field': 'product-sorting-name',
                    'order': 'asc'
                }
            },
            {
                params: {
                    'q': '',
                    'isList': 'false',
                    'mpfev': '2078'
                },
                headers: {
                    'authority': 'mp-search-api.tcgplayer.com',
                    'accept-language': 'en-US,en;q=0.9',
                    'cookie': 'optimizelyEndUserId=oeu1702228195945r0.3913542728603192; setting=CD%3DUS%26M%3D1; TCG_VisitorKey=7622fe57-52f2-4bdf-a9ce-e6d18e454384; tcg-uuid=ae006487-c5d3-490e-a0a1-1b0c4da091dd; tracking-preferences={%22version%22:1%2C%22destinations%22:{%22Actions%20Amplitude%22:true%2C%22AdWords%22:true%2C%22Drip%22:true%2C%22Facebook%20Pixel%22:true%2C%22Google%20AdWords%20New%22:true%2C%22Google%20Enhanced%20Conversions%22:true%2C%22Google%20Tag%20Manager%22:true%2C%22Hotjar%22:true%2C%22Impact%20Partnership%20Cloud%22:true%2C%22Optimizely%22:true}%2C%22custom%22:{%22advertising%22:true%2C%22functional%22:true%2C%22marketingAndAnalytics%22:true}}; ajs_anonymous_id=9656c9c3-b581-420d-8561-22a9b36c8022; _gcl_au=1.1.1732205032.1702228197; _ga=GA1.1.885480449.1702228197; __ssid=cdc75a2686d88dd28831c2715bd1b5e; SellerProximity=ZipCode=&MaxSellerDistance=1000&IsActive=false; _hjSessionUser_1176217=eyJpZCI6IjE4NzdmYjBmLTU3N2QtNTdmMi1iMjRiLWUyZmZjZTBjMTA2OCIsImNyZWF0ZWQiOjE3MDIyMjgxOTY2OTQsImV4aXN0aW5nIjp0cnVlfQ==; analytics_session_id=1703653235493; _hjIncludedInSessionSample_1176217=0; _hjSession_1176217=eyJpZCI6ImQ0N2YzMjIzLWYyYTctNDJlMy1hMmIzLTI5ODJjNTA3YzMzNyIsImMiOjE3MDM2NTMyMzU2NzYsInMiOjAsInIiOjAsInNiIjowfQ==; _hjAbsoluteSessionInProgress=1; _drip_client_4160913=vid%253D63a7fc5f49fd4526a565c9d280ec4fbc%2526pageViews%253D6%2526sessionPageCount%253D4%2526lastVisitedAt%253D1703654730653%2526weeklySessionCount%253D1%2526lastSessionAt%253D1703653235683; product-display-settings=sort=price+shipping&size=10; SearchSortSettings=M=1&ProductSortOption=ProductName&ProductSortDesc=False&PriceSortOption=Shipping&ProductResultDisplay=grid; _ga_XTQ57721TQ=GS1.1.1703653235.2.1.1703655328.0.0.0; _ga_VS9BE2Z3GY=GS1.1.1703653235.2.1.1703655328.60.0.0; tcg-segment-session=1703653235104%257C1703655338310; analytics_session_id.last_access=1703655338328',
                    'origin': 'https://www.tcgplayer.com',
                    'referer': 'https://www.tcgplayer.com/',
                    'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        );

        const results = response?.data?.results[0]?.results;
        totalResults = response?.data?.results[0]?.totalResults;

        if (results) {
            allCards = allCards.concat(results.map(result => ({
                productName: result.productName,
                setName: [result.setUrlName],
                rarityName: [result.rarityName],
                marketPrice: result.marketPrice,
                lowestPriceWithShipping: result.lowestPriceWithShipping,
                color: result.customAttributes.color,
                cardType: result.customAttributes.cardType,
                attribute: result.customAttributes.attribute,
                subtypes: result.customAttributes.subtypes,
                number: result.customAttributes.number,
                productId: result.productId,
            })));

            console.log(`Fetched ${results.length} cards. Total fetched: ${allCards.length} of ${totalResults}.`);
            await fs.writeFile('cards.json', JSON.stringify(allCards, null, 2));
            console.log('Saved current results to file.');

            from += size;
            if (from >= totalResults) {
                hasMore = false;
            }
        } else {
            console.log('No data found in current batch, stopping.');
            hasMore = false;
        }

        if (hasMore) {
            console.log('Waiting 1 second before the next request...');
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    console.log('All cards have been fetched and saved to file.');
}

main();
