import { Pagination } from 'flowbite-react/components/Pagination'

export default function PaginationButtons({
	LIMIT,
	className,
	totalPages,
	currentPage,
	setCurrentPage,
}) {
	const onPageChange = (page) => {
		setCurrentPage(page)
	}

	return (
		<Pagination
			showIcons
			layout='pagination'
			currentPage={currentPage}
			onPageChange={onPageChange}
			className={className || '-mt-2'}
			totalPages={Math.ceil(totalPages / LIMIT) || 1}
		/>
	)
}
