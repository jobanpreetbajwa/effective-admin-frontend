import React,{useEffect, useState} from 'react'
import SizeCountModal from '../../../modal/sizeCountModal'
import { Button } from 'flowbite-react'
import { DETAILS_PRODUCT_ACTION_TYPE, EDIT_PRODUCT_ACTION_TYPE } from '../../../../staticData/constantActions'

export default function Sizing({action,productData,setSizes,setDeletedSizesIds}) {
    const [isOpen, setIsOpen] = useState(false)
    const [sizesFor, setSizesFor] = useState({
        clothes:true,
        shoes:false
    })
    const [selectedSize, setSelectedSize] = useState(null)
    const availableClothesSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    const availableShoesSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
    const [selectedSizes,setSelectedSizes] = useState([])

    const AvailableSizesOption = sizesFor.clothes ? availableClothesSizes : availableShoesSizes
    useEffect(() => {
        if(productData?.size){
            setSelectedSizes(productData.size?.sizes || [])
            setSizes(productData.size?.sizes || [])
        }
    },[productData])

    useEffect(() => {
        setSizes(selectedSizes)
    },[selectedSizes])

    const onClickHandler=(size, count) => {
        setSelectedSize(null)
        const sizeObj ={
            size,
            count: Number(count)
        }
        // Find the index of the existing sizeObj in selectedSizes
        const index = selectedSizes.findIndex(item => item.size === size);

        let updatedSizes;
        if (index !== -1) {
            // If found, replace the existing value
            updatedSizes = selectedSizes.map((item, i) => 
                i === index ? { ...sizeObj, _id: item._id } : item
            );
        } else {
            // If not found, add the new sizeObj
            updatedSizes = [...selectedSizes, sizeObj];
        }

        // Update the state with the new array
        setSelectedSizes(updatedSizes);
        
    }
  return (
  <>
    {isOpen && selectedSize ? <SizeCountModal isOpen={isOpen} setIsOpen={setIsOpen} onClickHandler={onClickHandler} selectedSize={selectedSize}/>
    :
    null}
    <div className='col-span-6 border-b pb-6'>
        <h2 className='text-base font-semibold leading-7 text-gray-900'>
        Sizing
        </h2>
        <div className='flex gap-2'>
        <Button 
        disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
        size={'sm'} 
        outline={sizesFor.clothes ? false:true} 
        onClick={()=>setSizesFor({
            clothes:true,
            shoes:false
        })}>Clothes</Button>
        <Button 
        disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
        size={'sm'} 
        outline={sizesFor.shoes ? false:true}
        onClick={()=>setSizesFor({
            clothes:false,
            shoes:true
        })} >Shoes</Button>
        </div>
        <div className='my-4 flex flex-wrap gap-x-2 gap-y-1 items-center'>
            Available Sizes:
            <div>
            <div className='flex gap-x-2 '>
                {AvailableSizesOption.map((size, index) => {
                    return (
                        <Button
                            outline
                            color={'gray'}
                            key={size || index}
                            size={'sm'}
                            disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
                           
                            onClick={(e) =>{
                                e.preventDefault()
                                setSelectedSize(size)
                                setIsOpen(true)
                            }}
                        >
                            {size}
                        </Button>
                    )
                })
            }</div>
            <p className='font-extralight text-xs text-rose-600 pt-1'>Trying to add same size will replace existing one!</p>
            </div>

        </div>
        <div className='my-4 flex flex-wrap gap-x-2 gap-y-1 items-center'>
            Selected Sizes:
            {
                selectedSizes.map((item, index) => {
                    return (
                        <Button
                            key={index}
                            disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
                            size={'sm'}
                            onClick={(e) => {
                                e.preventDefault()
                                if(action === EDIT_PRODUCT_ACTION_TYPE){
                                    if(item._id){
                                        setDeletedSizesIds((prev)=>[...prev,item._id])
                                    }
                                }
                                setSelectedSizes(selectedSizes.filter(size => size.size !== item.size))
                            }}
                        >
                            {item.size}
                        </Button>
                    )
                })
            }
        </div>
    </div>
  </>
  )
}
