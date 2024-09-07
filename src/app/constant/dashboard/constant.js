import { IoIosKeypad } from 'react-icons/io'
import { FaQuoteRight } from 'react-icons/fa'
import { BiSolidOffer } from "react-icons/bi";
import { MdOutlineSlideshow, MdReviews, MdCollections } from 'react-icons/md'

export const ThemeType = {
	CATALOG: 1,
	PRODUCTS: 2,
	SLIDESHOW: 3,
	TAGLINE: 4,
	REVIEWS: 5,
	OFFERS: 6,
}

export const theme = [
	{ type: 1, nav: 'catalog' },
	{ type: 2, nav: 'products' },
	{ type: 3, nav: 'slideshow' },
	{ type: 4, nav: 'tagline' },
	{ type: 5, nav: 'reviews' },
	{ type: 6, nav: 'offers' },
]

export const themeOptions = [
	{
		Icon: MdCollections,
		title: 'Catalog collection',
		nav: 'catalog',
	},
	{
		Icon: IoIosKeypad,
		title: 'Product collection',
		nav: 'products',
	},
	{
		Icon: MdOutlineSlideshow,
		title: 'Slideshow',
		nav: 'slideshow',
	},
	{
		Icon: FaQuoteRight,
		title: 'Taglines',
		nav: 'tagline',
	},
	{
		Icon: MdReviews,
		title: 'Reviews',
		nav: 'reviews',
	},
	{
		Icon: BiSolidOffer,
		title: 'Offers',
		nav: 'offers',
	}
]
