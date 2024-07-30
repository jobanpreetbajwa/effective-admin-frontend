// 0->pending 1->delivered 2->cancelled 3->shipped 4->returned 5->in progress

export const ORDER_STATUS_INDICATOR = {
	0: 'Pending',
	1: 'Delivered',
	2: 'Cancelled',
	3: 'Shipped',
	4: 'Returned',
	5: 'In Progress',
}

export const STATUS_COLOR = {
	0: 'blue',
	1: 'success',
	2: 'failure',
	3: 'info',
	4: 'purple',
	5: 'warning',
}

//0->cod 1->online 2->credit payments
export const PAYMENT_MODE = {
	0: 'COD',
	1: 'Online',
	2: 'Credit Payments',
}
