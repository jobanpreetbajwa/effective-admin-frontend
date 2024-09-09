import React, { useState } from 'react';
import { MdDiscount } from "react-icons/md";
import { Button, Dropdown, DropdownItem, FloatingLabel } from "flowbite-react";
import { toast } from "sonner";
import { createCouponCode } from "../../../../api/function";

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [createCoupon, setCreateCoupon] = useState(false);
  const [form, setForm] = useState({
    coupon_code: '',
    discount_value: '',
    discount_upto: '',
    count: '',
    minimum_order_value: '',
    discount_percentage: '',
    discount_type: 'value' // New field to track discount type
  });

  const isNumber = (value) => {
    return /^\d*$/.test(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (['discount_value', 'discount_upto', 'count', 'minimum_order_value', 'discount_percentage'].includes(name) && !isNumber(value)) {
      toast.error(`${name.replace('_', ' ')} must be a number`);
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleDiscountTypeChange = (value) => {
    if (value === 'value') {
      setForm({ ...form, discount_type: value, discount_percentage: '' });
    } else if (value === 'percentage') {
      setForm({ ...form, discount_type: value, discount_value: '' });
    }
  };

  const create_Coupon = async () => {
    // Create coupon
    const response = await createCouponCode(form);
    setForm({
      coupon_code: '',
      discount_value: '',
      discount_upto: '',
      count: '',
      minimum_order_value: '',
      discount_percentage: '',
      discount_type: 'value'
    });
    setCreateCoupon(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Ensure none of the fields are empty except discount_value and discount_percentage
    if (!form.coupon_code || !form.discount_upto || !form.count || !form.minimum_order_value) {
      toast.error("All fields except discount value and discount percentage are required");
      return;
    }

    // Ensure at least one of discount_value or discount_percentage is provided
    if (form.discount_type === 'value' && !form.discount_value) {
      toast.error("Discount value is required");
      return;
    }

    if (form.discount_type === 'percentage' && !form.discount_percentage) {
      toast.error("Discount percentage is required");
      return;
    }

    toast.promise(create_Coupon(), {
      loading: 'Creating Coupon...',
      success: 'Coupon created successfully',
      error: 'Fail to create coupon',
    });
  };

  const handleEdit = (coupon) => {
    setForm(coupon);
    setCreateCoupon(true);
  };

  const handleDelete = (id) => {
    setCoupons(coupons.filter(coupon => coupon.id !== id));
  };

  return (
    <div>
      <div
        className={`p-4 mb-4 text-sm cursor-pointer flex justify-center text-center ${createCoupon ? '' : 'text-blue-800 rounded-lg bg-blue-100 dark:bg-gray-800 dark:text-blue-400'}`}
        role='alert'
        onClick={() => setCreateCoupon(!createCoupon)}
      >
        <div className='flex items-center gap-2'>
          <p>Create Coupon </p>
          <span>
            <MdDiscount />
          </span>
        </div>
      </div>
      {
        createCoupon ? (
          <form className="flex flex-col gap-4 md:flex-row" onSubmit={handleSubmit}>
            <div>
              <FloatingLabel
                variant="standard"
                label="Enter Coupon Code"
                className="pr-6"
                name="coupon_code"
                value={form.coupon_code}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Dropdown
                label="Discount Type"
              >
                <DropdownItem onClick={() => handleDiscountTypeChange('value')}>
                  Discount Value
                </DropdownItem>
                <DropdownItem onClick={() => handleDiscountTypeChange('percentage')}>
                  Discount Percentage
                </DropdownItem>
              </Dropdown>
            </div>
            {form.discount_type === 'value' && (
              <div>
                <FloatingLabel
                  variant="standard"
                  label="Discount Value"
                  className="pr-6"
                  name="discount_value"
                  type="number"
                  value={form.discount_value}
                  onChange={handleInputChange}
                />
              </div>
            )}
            {form.discount_type === 'percentage' && (
              <div>
                <FloatingLabel
                  variant="standard"
                  label="Discount Percentage"
                  className="pr-6"
                  name="discount_percentage"
                  type="number"
                  value={form.discount_percentage}
                  onChange={handleInputChange}
                />
              </div>
            )}
            <div>
              <FloatingLabel
                variant="standard"
                label="Discount Upto"
                className="pr-6"
                name="discount_upto"
                type="number"
                value={form.discount_upto}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <FloatingLabel
                variant="standard"
                label="Minimum Order Value"
                className="pr-6"
                name="minimum_order_value"
                type="number"
                value={form.minimum_order_value}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <FloatingLabel
                variant="standard"
                label="Count"
                className="pr-6"
                name="count"
                type="number"
                value={form.count}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" color={'gray'} outline className='flex items-center'>
              {form.id === null ? 'Create' : 'Update'} Coupon
            </Button>
          </form>
        ) : null
      }
      <ul>
        {coupons.map(coupon => (
          <li key={coupon.id}>
            {coupon.coupon_code} - {coupon.discount_value ? `${coupon.discount_value}%` : `${coupon.discount_percentage}%`} - {coupon.discount_upto} - {coupon.minimum_order_value} - {coupon.count}
            <button onClick={() => handleEdit(coupon)}>Edit</button>
            <button onClick={() => handleDelete(coupon.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}