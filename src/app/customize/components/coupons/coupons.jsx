import React, { useState } from 'react';
import { MdDiscount } from "react-icons/md";
import { Button, FloatingLabel } from "flowbite-react";
import { toast } from "sonner";
import {createCouponCode} from "../../../../api/function";
export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [createCoupon, setCreateCoupon] = useState(false);
  const [form, setForm] = useState({ coupon_code: '', discount_value: '', discount_upto: '', count: ''});

  const isNumber = (value) => {
    return /^\d*$/.test(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (['discount_value', 'discount_upto', 'count'].includes(name) && !isNumber(value)) {
      toast.error(`${name.replace('_', ' ')} must be a number`);
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const create_Coupon = async() => {
    // Create coupon
    const response = await createCouponCode(form);
    setForm({ coupon_code: '', discount_value: '', discount_upto: '', count: ''});
    setCreateCoupon(false);
}

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // Validation: Ensure none of the fields are empty
    if (!form.coupon_code || !form.discount_value || !form.discount_upto || !form.count) {
      toast.error("All fields are required");
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
              <FloatingLabel
                variant="standard"
                label="Discount Value"
                className="pr-6"
                name="discount_value"
                type="number"
                value={form.discount_value}
                onChange={handleInputChange}
                required
              />
            </div>
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
            {coupon.coupon_code} - {coupon.discount_value}% - {coupon.discount_upto} - {coupon.count}
            <button onClick={() => handleEdit(coupon)}>Edit</button>
            <button onClick={() => handleDelete(coupon.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}