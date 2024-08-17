import { EDIT_PRODUCT_ACTION_TYPE } from '../../../../staticData/constantActions'
import { sendMultipleImages } from '../../../../utilis/sendMultipleImages'

export const generateAddProductPayload = async (
	event,
	action,
	maxRange,
	tagsName,
	isPricing,
	sendImages,
	categoryID,
	deletedImages,
	variablePricing,
	sizes,
	deletedSizesIds,
) => {
	const raw = {
		size: sizes,
		color: null,
		name: event.target.name.value || '',
		unique_id: event.target.unique_id.value || '',

		description: event.target.description.value || '',

		inventory_available: event?.target?.inventory_available?.value,

		prod_quantity: +event?.target?.prod_quantity?.value || '',

		weight: event?.target?.weight?.value || '',

		// variants: variantData || null,

		subcategories: tagsName || [],

		min_order_quantity: event.target.min_order_quantity.value || '',
		max_order_quantity: event.target.max_order_quantity.value || '',

		// cod: event.target.cod.value || '',
		// refund: event.target.refund.value || '',
		// shipping_cost: +event.target.shipping_cost.value || '',
		prod_status: event?.target?.prod_status?.value || true,
		category_id: categoryID,
	}
	if(action === EDIT_PRODUCT_ACTION_TYPE){
		raw['deletedSizesIds'] = deletedSizesIds
	}
	const img_ids = await sendMultipleImages(sendImages)

	raw['img_ids'] = img_ids

	if (
		event?.target?.discounted_price?.value !== undefined ||
		+event?.target?.discounted_price?.value === 0
	) {
		if (
			+event?.target?.discounted_price.value > +event?.target?.mrp_price?.value
		) {
			toast.error('Discounted price cannot be greater than MRP price')
			setIsLoading(false)
			return
		}
	}

	if (
		+event?.target?.discounted_price?.value > +event?.target?.mrp_price?.value
	) {
		toast.error('Discounted price cannot be greater than MRP price')
		setIsLoading(false)
		return
	}

	raw.discounted_price = +event.target.discounted_price.value || 0

	raw.is_pricing = isPricing
	raw.mrp_price = +event.target.mrp_price.value || 0

	if (variablePricing?.length) {
		if (maxRange?.length) {
			raw.prices = [...variablePricing, ...maxRange] || []
		} else {
			if (maxRange?.length === 0) {
				raw.prices = [...variablePricing] || []
			} else {
				raw.prices = [...variablePricing, maxRange] || []
			}
		}
	} else {
		raw.prices = []
	}

	if (action === EDIT_PRODUCT_ACTION_TYPE) {
		//filter deleted images only that has isDeleted key
		const data = deletedImages
			.filter((item) => item.isDeleted)
			.map((item) => {
				return item._id
			})

		const nonDeletedImages = deletedImages
			.filter((item) => !item.isDeleted)
			.map((item) => {
				return item._id
			})

		raw.img_ids = [...nonDeletedImages, ...img_ids]

		raw['deleted'] = data
	}
	return [raw]
}
