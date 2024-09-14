import React from 'react'
import { Modal,Button } from 'flowbite-react'
import { RiDiscountPercentFill } from "react-icons/ri";
import { BiSolidShoppingBags } from "react-icons/bi";
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
								<div key={index} className='flex justify-between items-center pr-4 py-3 bg-white border-b-2'>
									<div className='flex gap-2 items-center'>
										{
											offer.type === 'percentage' ?
											<RiDiscountPercentFill color='green' size={30}/>
											:
											null
										}	
										{
											offer.type === 'buyX_getY' ?
											<BiSolidShoppingBags color='green' size={30}/>
											:
											null
										}
										<div>
											<p className='font-semibold'>{offer.type}</p>
											<p>{offer.description}</p>
										</div>
									</div>
									
									<div>
										<Button size={'sm'} onClick={()=>{
											handleOfferSelection(offer)
											setOpenModal(false)
											}}>Apply</Button>
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
