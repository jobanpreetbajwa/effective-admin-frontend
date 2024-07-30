import { useState } from 'react'
import { Button, Label, Modal, TextInput } from 'flowbite-react'
import { useEffect } from 'react'

export default function ChangeTagNameModal({
  tags,
  index,
  setTags,
  openModal,
  editedTags,
  setOpenModal,
  setEditedTags,
  setSubcategories,
}) {
  function onCloseModal() {
    setOpenModal(false)
  }
  const [newName, setNewName] = useState(null)

  // useEffect(() => {
  // 	if (newName === null) {
  // 		setNewName(tags[index]?.name)
  // 	}
  // })

  const handleTagNameChange = () => {
    // handle tag name change in editedTags
    const name = newName.trim()
    // If the tag is already added in the collection edit based on _id
    if (tags[index]?._id) {
      const tagToUpdate = tags[index]
      const existingTagIndex = editedTags?.findIndex(
        (tag) => tag._id === tagToUpdate._id
      )

      let updatedTags
      if (existingTagIndex !== -1 && existingTagIndex !== undefined) {
        // Update the existing tag
        updatedTags = editedTags.map((tag) =>
          tag._id === tagToUpdate._id ? { ...tag, name: name } : tag
        )
      } else {
        // Add the new tag
        updatedTags = editedTags
          ? [...editedTags, { ...tagToUpdate, name: name }]
          : [{ ...tagToUpdate, name: name }]
      }

      console.log('Updated Tags:', updatedTags)
      setEditedTags(updatedTags)
    } else {
      //Check if new added tag is modified
      setSubcategories((prev) => {
        const updatedSubcategories = prev?.map((name) => {
          if (name === tags[index]?.name) {
            return name
          } else {
            return name
          }
        })
        // console.log('Updated Subcategories:', updatedSubcategories)
        return updatedSubcategories
      })
    }

    //change the current tag name
    const newTagData = tags?.map((tag, i) => {
      if (i === index) {
        return { ...tag, name: newName }
      }
      return tag
    })

    setTags(newTagData)

    setOpenModal(false)
  }

  return (
    <>
      <Modal
        show={openModal}
        size='md'
        onClose={onCloseModal}
        popup
        onClick={(e) => e.stopPropagation()}
        className='p-4'
      >
        <Modal.Header>Change tag name of {tags[index]?.name}</Modal.Header>

        <Modal.Body>
          <div>
            <Label htmlFor='newName' value='Change Tag Name :' />

            <TextInput
              id='newName'
              // value={newName}
              placeholder='Enter new tag name'
              onChange={(e) => {
                if (newName?.length > 0) {
                  setNewName(e.target.value)
                } else {
                  setNewName(e.target.value.trim())
                }
              }}
            />

            <Button
              disabled={newName ? false : true}
              onClick={handleTagNameChange}
              className='mt-2'
            >
              Save
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
