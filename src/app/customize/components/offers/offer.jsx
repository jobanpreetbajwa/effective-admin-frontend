import React, { useEffect, useState } from 'react';
import { TextInput, Select, Button, Checkbox, Label } from 'flowbite-react';
import { toast } from 'sonner';
import { getOffersList } from '../../../../api/function';
import ApplyOffers from '../../../products/modal/applyOffers';
import OfferDetails from './components/offerDetails';



export default function Offer({selectedOffer,availableOffersList,handleOfferSelection,themeOptionList,deleteCategory}) {
    const [isOpen, setIsOpen] = useState(false);

  return (
<>
{
    isOpen ?
    <ApplyOffers openModal={isOpen} setOpenModal={setIsOpen} availableOffersList={availableOffersList} handleOfferSelection={handleOfferSelection}/>
    :
    null
}    <div
		className={`p-4 mb-4 text-sm  text-center ${selectedOffer?'':'text-blue-800 rounded-lg bg-blue-100 dark:bg-gray-800 dark:text-blue-400'}`}
		role='alert'
        onClick={()=>setIsOpen(true)}
	>
	    {
            selectedOffer ? 
            <OfferDetails offer={selectedOffer}/>
            :
            <p>Selected Offer: {selectedOffer.type}</p>

        }
    </div>
    <div className='px-6 bg-white border-b-2 '>

        {themeOptionList ? (
						themeOptionList?.map((item, index) => (
                            <div
                            key={item?._id}
                            className='flex items-center  border-b hover:bg-slate-200 cursor-pointer mt-4 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 justify-between '
                        >
                            <div className=' gap-3 p-3'>
                                <div className='flex gap-3 items-center  '>
                                    <img
                                        alt='img'
                                        src={item?.img_ids[0]?.url}
                                        className='rounded-full h-12 w-12'
                                    />
                                    <h2 className='flex flex-wrap max-w-44 '>
                                        {item?.category_name ||
                                            item?.name ||
                                            'default_name'}
                                    </h2>
                                </div>
                            </div>
                            {themeOptionList?.length > 1 && (
                                <Button
                                    color='failure'
                                    className='me-2'
                                    onClick={() => deleteCategory(item?._id)}
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
						))
					) : (
						<div className='h-10'>
							<span className='text-rose-500 p-6'>No Collection Available</span>
						</div>
					)}
    </div>
</>
  );
}