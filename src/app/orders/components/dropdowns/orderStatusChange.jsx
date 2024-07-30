import { Dropdown } from 'flowbite-react/components/Dropdown'

import { ORDER_STATUS_INDICATOR, STATUS_COLOR } from '../../utils/constants'

import { MdCancel } from 'react-icons/md'
import { FcShipped } from 'react-icons/fc'
import { GrInProgress } from 'react-icons/gr'
import { RiProgress3Line } from 'react-icons/ri'
import { MdAssignmentReturned } from 'react-icons/md'
import { AiOutlineDeliveredProcedure } from 'react-icons/ai'
import { useState } from 'react'
import ReasonForCancel from '../../../products/modal/reasonForCancel'

export default function OrderStatusChangeDropdown({
  orderId,
  orderStatus,
  changeStatusOfOrder,
}) {
  const [showModal, setShowModal] = useState(false)

  const reasonHandler = () => {
    setShowModal(false)
    changeStatusOfOrder(2)
  }
  return (
    <>
      {showModal ? (
        <ReasonForCancel
          id={orderId}
          openModal={showModal}
          setOpenModal={setShowModal}
          reasonHandler={reasonHandler}
        />
      ) : null}

      <Dropdown
        label={
          <span className='w-20'>{ORDER_STATUS_INDICATOR[orderStatus]}</span>
        }
        size='sm'
        color={STATUS_COLOR[orderStatus]}
      >
        {orderStatus !== 0 && (
          <Dropdown.Item
            icon={GrInProgress}
            onClick={(event) => {
              changeStatusOfOrder(0)
            }}
          >
            Pending
          </Dropdown.Item>
        )}

        {orderStatus !== 5 && (
          <Dropdown.Item
            icon={RiProgress3Line}
            onClick={(event) => {
              changeStatusOfOrder(5)
            }}
          >
            In Progress
          </Dropdown.Item>
        )}

        {orderStatus !== 3 && (
          <Dropdown.Item
            icon={FcShipped}
            onClick={(event) => {
              changeStatusOfOrder(3)
            }}
          >
            Shipped
          </Dropdown.Item>
        )}

        {orderStatus !== 1 && (
          <Dropdown.Item
            icon={AiOutlineDeliveredProcedure}
            onClick={(event) => {
              changeStatusOfOrder(1)
            }}
          >
            Delivered
          </Dropdown.Item>
        )}

        {orderStatus !== 2 && (
          <Dropdown.Item
            icon={MdCancel}
            onClick={(event) => {
              setShowModal(true)
            }}
          >
            Cancelled
          </Dropdown.Item>
        )}

        {orderStatus !== 4 && (
          <Dropdown.Item
            icon={MdAssignmentReturned}
            onClick={(event) => {
              changeStatusOfOrder(4)
            }}
          >
            Returned
          </Dropdown.Item>
        )}
      </Dropdown>
    </>
  )
}
