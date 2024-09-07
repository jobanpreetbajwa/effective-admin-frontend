import React from 'react'
import { Modal } from 'flowbite-react'
export default function ApplyOffers({openModal,
  setOpenModal,availableOffersList,handleOfferSelection}) {
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
			<Modal.Header className='p-6'>
        Select Offers
			</Modal.Header>
			<Modal.Body>
				<div className='space-y-6'>
					{
						availableOffersList.map((offer,index)=>{
							return(
								<div key={index} className='flex justify-between items-center px-6 py-3 bg-white border-b-2'>
									<div>
										<p className='font-semibold'>{offer.type}</p>
										<p>{offer.description}</p>
									</div>
									<div>
										<button className='btn btn-primary' onClick={()=>{
											handleOfferSelection(offer)
											setOpenModal(false)
											}}>Apply</button>
									</div>
								</div>
							)
					})
				}
				</div>
			</Modal.Body>
		</Modal>
  )
}
