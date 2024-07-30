import { Dropdown } from 'flowbite-react/components/Dropdown'

import { ORDER_STATUS_INDICATOR, STATUS_COLOR } from '../../utils/constants'

import { MdCancel } from 'react-icons/md'
import { FcShipped } from 'react-icons/fc'
import { GrInProgress } from 'react-icons/gr'
import { RiProgress2Fill } from 'react-icons/ri'
import { MdAssignmentReturned } from 'react-icons/md'
import { AiOutlineDeliveredProcedure } from 'react-icons/ai'
import { useState } from 'react'
import ReasonForCancel from '../../../products/modal/reasonForCancel'

export default function StatusTopBar({ orderStatus, handleStatusChange }) {
  return (
    <>
      <Dropdown
        label={
          <span className={`w-24`}>
            {orderStatus === ''
              ? 'Select Status'
              : ORDER_STATUS_INDICATOR[orderStatus]}
          </span>
        }
        color={STATUS_COLOR[orderStatus]}
        outline
      >
        {orderStatus !== '' && (
          <Dropdown.Item
            icon={GrInProgress}
            onClick={() => handleStatusChange('')}
          >
            All
          </Dropdown.Item>
        )}

        {orderStatus !== `0` && (
          <Dropdown.Item
            icon={GrInProgress}
            onClick={() => handleStatusChange(0)}
          >
            Pending
          </Dropdown.Item>
        )}

        {orderStatus !== `5` && (
          <Dropdown.Item
            icon={RiProgress2Fill}
            onClick={() => handleStatusChange(5)}
          >
            In Progress
          </Dropdown.Item>
        )}

        {orderStatus !== `3` && (
          <Dropdown.Item
            icon={MdAssignmentReturned}
            onClick={() => handleStatusChange(3)}
          >
            Shipped
          </Dropdown.Item>
        )}

        {orderStatus !== `1` && (
          <Dropdown.Item
            icon={AiOutlineDeliveredProcedure}
            onClick={() => handleStatusChange(1)}
          >
            Delivered
          </Dropdown.Item>
        )}

        {orderStatus !== `2` && (
          <Dropdown.Item icon={FcShipped} onClick={() => handleStatusChange(2)}>
            Cancelled
          </Dropdown.Item>
        )}

        {orderStatus !== `4` && (
          <Dropdown.Item icon={MdCancel} onClick={() => handleStatusChange(4)}>
            Returned
          </Dropdown.Item>
        )}
      </Dropdown>
    </>
  )
}
