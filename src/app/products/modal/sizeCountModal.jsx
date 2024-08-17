import React,{useState} from 'react'
import { Button, Modal, TextInput } from 'flowbite-react'
export default function SizeCountModal({isOpen, setIsOpen,onClickHandler,selectedSize}) {
    const [count, setCount] = useState(0)
  return (
    <Modal show={isOpen} size='xl' onClose={()=>setIsOpen(false)} dismissible popup>
    <Modal.Header className='p-6'>Add count for: {selectedSize}</Modal.Header>
    <Modal.Body>
      <div className='space-y-6'>
        <TextInput 
            id='Count'
            type='number'
			      name='Count' 
            placeholder='Enter count for this product' 
            onChange={(e)=>setCount(e.target.value)}/>
        <div className='flex gap-3 justify-start'>
          <Button
            color='failure'
            onClick={(e) => {
                e.preventDefault()
                if(count === 0){
                    setIsOpen(false)
                    return
                }
                onClickHandler(selectedSize, count)
                
            }}
          >
            Ok
          </Button>
          <Button onClick={(e)=>{
                e.preventDefault()
                setIsOpen(false)
          }} outline>
            Cancel
          </Button>
        </div>
      </div>
    </Modal.Body>
  </Modal>
  )
}
