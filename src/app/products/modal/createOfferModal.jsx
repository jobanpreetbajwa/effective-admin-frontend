import React from 'react'
import { Modal } from 'flowbite-react'
import { RiDiscountPercentFill } from "react-icons/ri";
import CreateOffer from '../../offer';
export default function CreateOfferModal({openModal,setOpenModal}) {
  return (
    <Modal
    show={openModal}
    size='xl'
    onClose={()=>setOpenModal(false)}
    dismissible
    popup
    onClick={(e) => {
        e.stopPropagation()
    }}
>
    <Modal.Header className='p-6 text-center'>
        Create Offer
    </Modal.Header>
    <Modal.Body>
        <div className='space-y-6'>
            <CreateOffer setOpenModal={setOpenModal}/>
        </div>
    </Modal.Body>
</Modal>
  )
}
