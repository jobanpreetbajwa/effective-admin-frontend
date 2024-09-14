import { Table } from 'flowbite-react';

export default function OfferDetails({ offer }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <Table.Head>
          <Table.HeadCell>Type</Table.HeadCell>
          {offer.type === 'buyX_getY' ? (
            <>
              <Table.HeadCell>Required Quantity</Table.HeadCell>
              <Table.HeadCell>Free Quantity</Table.HeadCell>
            </>
          ) : (
            <>
              <Table.HeadCell>Discounted Percentage</Table.HeadCell>
              <Table.HeadCell>Discount Upto</Table.HeadCell>
              <Table.HeadCell>Minimum Value</Table.HeadCell>
            </>
          )}
          <Table.HeadCell>Start Date</Table.HeadCell>
          <Table.HeadCell>End Date</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {offer.type}
            </Table.Cell>
            {offer.type === 'buyX_getY' ? (
              <>
                <Table.Cell>{offer.requiredQuantity}</Table.Cell>
                <Table.Cell>{offer.freeQuantity}</Table.Cell>
              </>
            ) : (
              <>
                <Table.Cell>{offer.discountPercent}</Table.Cell>
                <Table.Cell>{offer.discountUpto}</Table.Cell>
                <Table.Cell>{offer.minOrderValue}</Table.Cell>
              </>
            )}
            <Table.Cell>{new Date(offer.startDate).toLocaleDateString()}</Table.Cell>
            <Table.Cell>{new Date(offer.endDate).toLocaleDateString()}</Table.Cell>
            <Table.Cell>{offer.isActive ? 'True' : 'False'}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}