import { IoIosKeypad } from 'react-icons/io'
import { ThemeType } from '../../../app/constant/dashboard/constant'
import {
	MdCollections,
	MdOutlineSlideshow,
	MdOutlineReviews,
} from 'react-icons/md'
import { FaQuoteRight, FaIdCard } from 'react-icons/fa'

export const generateThemeList = (listData) => {
	const listArrToDisplay = listData.map((theme) => {
		const { type, category_ids, product_ids, slideshow, reviews, tagline } =
			theme
		const imgsArr = []
		let themeTypeText = ''
		let Icon = null
		let themes = []

		const extractAndPushImageUrls = (ids) => {
			return ids?.map((category) => {
				const imgIds = category?.img_ids.map((img) => img?.url)
				imgsArr.push(...imgIds)
				return category
			})
		}

		switch (type) {
			case ThemeType.CATALOG:
				themes = extractAndPushImageUrls(category_ids)
				themeTypeText = 'catalogs'
				Icon = MdCollections
				break
			case ThemeType.PRODUCTS:
				themes = extractAndPushImageUrls(product_ids)
				themeTypeText = 'products'
				Icon = IoIosKeypad
				break
			case ThemeType.SLIDESHOW:
				themeTypeText = 'banners'
				Icon = MdOutlineSlideshow
				themes = slideshow?.map((slide) => {
					imgsArr.push(slide?.img_id?.url)
					return slide
				})
				break
			case ThemeType.TAGLINE:
				themeTypeText = 'tagline'
				Icon = FaQuoteRight
				themes = [tagline]
				break

			case ThemeType.REVIEWS:
				themeTypeText = 'reviews'
				Icon = MdOutlineReviews
				themes = reviews
				break

			case ThemeType.ABOUT_US:
				themeTypeText = 'about-us'
				Icon = FaIdCard
				themes = []
				break

			default:
				break
		}

		return { ...theme, themes, imgsArr, themeTypeText, Icon }
	})

	return listArrToDisplay
}

export const mapProductIds = (data) => {
	return data?.map((obj) => obj?._id)
}

export const filterByProductIds = (data, ids) => {
	return data?.filter((item) => ids?.includes(item._id))
}

export const moveItem = (sourceList, result) => {
	if (!result || !result.destination) return

	const { source, destination } = result
	const items = Array.from(sourceList)
	const [movedItem] = items.splice(source.index, 1)

	items.splice(destination.index, 0, movedItem)
	return items
}

export const getListForEdit = (data) => {
	const { type, category_ids, product_ids, slideshow, tagline, reviews } = data
	let themes = []
	switch (type) {
		case ThemeType.CATALOG:
			themes = category_ids
			break
		case ThemeType.PRODUCTS:
			themes = product_ids
			break
		case ThemeType.SLIDESHOW:
			themes = slideshow
			break
		case ThemeType.TAGLINE:
			// themes = [tagline];
			break
		case ThemeType.REVIEWS:
			themes = reviews
			break
		default:
			break
	}
	return { ...data, themes }
}
