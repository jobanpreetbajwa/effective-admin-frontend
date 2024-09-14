import React, { useState, useEffect } from 'react';
import { TextInput, Select, Button, Checkbox, Label } from 'flowbite-react';
import { toast } from 'sonner';
import { createOffer } from '../../api/function';

const options = ['percentage', 'fixed', 'free_shipping', 'buyX_getY', 'seasonal', 'loyalty', 'flash'];

export default function CreateOffer({setOpenModal}) {
  const [formData, setFormData] = useState({
    type: options[0],
    description: '',
    discountPercent: '',
    discountUpto: '',
    minOrderValue: '',
    startDate: '',
    endDate: '',
    isActive: true,
    requiredQuantity: '',
    freeQuantity: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Clear the error for the field being changed
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (formData.type === 'buyX_getY') {
      if (!formData.requiredQuantity) newErrors.requiredQuantity = 'Required quantity is required';
      if (!formData.freeQuantity) newErrors.freeQuantity = 'Free quantity is required';
    } else if (!['seasonal', 'loyalty', 'free_shipping'].includes(formData.type)) {
      if (!formData.discountPercent) newErrors.discountPercent = 'Discount Percent is required';
      if (!formData.discountUpto) newErrors.discountUpto = 'Discount upto is required';
    }
    if (formData.type !== 'buyX_getY' && !formData.minOrderValue) {
      newErrors.minOrderValue = 'Minimum order value is required';
    }
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.date = 'Start date cannot be later than end date';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Remove discount fields if type is not matching
      if (['seasonal', 'loyalty', 'free_shipping', 'buyX_getY'].includes(formData.type)) {
        delete formData.discountPercent;
        delete formData.discountUpto;
      }
      // Remove minOrderValue if type is buyX_getY
      if (formData.type === 'buyX_getY') {
        delete formData.minOrderValue;
      }
      // Add form submission logic here
      try {
        const response = await createOffer(formData);
        console.log(response);
      } catch (error) {
        console.log(error);
        toast.error('Failed to create offer');
      }
      finally{
        setOpenModal(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 w-full">
      <div className='flex flex-col gap-2 md:flex-row md:gap-4 w-full'>
        <div className='w-full'>
          <Label htmlFor="type" value="Type" />
          <Select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            defaultValue={formData.type}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          {errors.type && <p className="text-red-500 text-sm font-semibold">{errors.type}</p>}
        </div>
        <div className='w-full'>
          <Label htmlFor="description" value="Description" />
          <TextInput
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            required
          />
          {errors.description && <p className="text-red-500 text-sm font-semibold">{errors.description}</p>}
        </div>
      </div>
      {formData.type === 'buyX_getY' && (
        <div className='flex flex-col gap-2 md:flex-row md:gap-4 w-full'>
          <div className='w-full'>
            <Label htmlFor="requiredQuantity" value="Required Quantity" />
            <TextInput
              id="requiredQuantity"
              name="requiredQuantity"
              type="number"
              value={formData.requiredQuantity}
              onChange={handleChange}
              placeholder="Enter required quantity"
              required
            />
            {errors.requiredQuantity && <p className="text-red-500 text-sm font-semibold">{errors.requiredQuantity}</p>}
          </div>
          <div className='w-full'>
            <Label htmlFor="freeQuantity" value="Free Quantity" />
            <TextInput
              id="freeQuantity"
              name="freeQuantity"
              type="number"
              value={formData.freeQuantity}
              onChange={handleChange}
              placeholder="Enter free quantity"
              required
            />
            {errors.freeQuantity && <p className="text-red-500 text-sm font-semibold">{errors.freeQuantity}</p>}
          </div>
        </div>
      )}
      <div className='flex flex-col gap-2 md:flex-row md:gap-4 w-full'>
        <div className='w-full'>
          <Label htmlFor="discountPercent" value="Discount Percent" />
          <TextInput
            id="discountPercent"
            name="discountPercent"
            type="number"
            value={formData.discountPercent}
            onChange={handleChange}
            placeholder="Enter discount value"
            required={!['seasonal', 'loyalty', 'free_shipping', 'buyX_getY'].includes(formData.type)}
            disabled={['seasonal', 'loyalty', 'free_shipping', 'buyX_getY'].includes(formData.type)}
          />
          {errors.discountPercent && <p className="text-red-500 text-sm font-semibold">{errors.discountPercent}</p>}
        </div>
        <div className='w-full'>
          <Label htmlFor="discountUpto" value="Discount Upto" />
          <TextInput
            id="discountUpto"
            name="discountUpto"
            type="number"
            value={formData.discountUpto}
            onChange={handleChange}
            placeholder="Enter discount value"
            required={!['seasonal', 'loyalty', 'free_shipping', 'buyX_getY'].includes(formData.type)}
            disabled={['seasonal', 'loyalty', 'free_shipping', 'buyX_getY'].includes(formData.type)}
          />
          {errors.discountUpto && <p className="text-red-500 text-sm font-semibold">{errors.discountUpto}</p>}
        </div>
      </div>
      <div className='w-full flex flex-col gap-2 md:flex-row md:gap-4 md:w-1/2'>
        <div className='w-full'>
          <Label htmlFor="minOrderValue" value="Minimum Order Value" />
          <TextInput
            id="minOrderValue"
            name="minOrderValue"
            type="number"
            value={formData.minOrderValue}
            onChange={handleChange}
            placeholder="Enter minimum order value"
            required={formData.type !== 'buyX_getY'}
            disabled={formData.type === 'buyX_getY'}
          />
          {errors.minOrderValue && <p className="text-red-500 text-sm font-semibold">{errors.minOrderValue}</p>}
        </div>
      </div>
      <div className='flex flex-col gap-2 md:flex-row md:gap-4 w-full'>
        <div className='w-full'>
          <Label htmlFor="startDate" value="Start Date" />
          <TextInput
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
          {errors.startDate && <p className="text-red-500 text-sm font-semibold">{errors.startDate}</p>}
        </div>
        <div className='w-full'>
          <Label htmlFor="endDate" value="End Date" />
          <TextInput
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
          {errors.endDate && <p className="text-red-500 text-sm font-semibold">{errors.endDate}</p>}
          {errors.date && <p className="text-red-500 text-sm font-semibold">{errors.date}</p>}
        </div>
      </div>
      <div className="flex items-center">
        <Checkbox
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
        />
        <Label htmlFor="isActive" className="ml-2">
          Is Active
        </Label>
      </div>
      <Button type="submit" size={'sm'}>
        Submit
      </Button>
    </form>
  );
}