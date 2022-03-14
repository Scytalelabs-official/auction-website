// import { ExclamationIcon } from '@heroicons/react/outline'
import styled from '@emotion/styled';
import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Router from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import xw from 'xwind/macro';
import * as Yup from 'yup';
import DatePicker from '../components/DatePicker';
import ImageUpload from '../components/ImageUpload';
import LabReportsUpload from './labReportsUpload';
import SOPUpload from './sopUpload';


const StyledErrorMessage = styled.div(xw`
    text-sm
    text-red-600
    my-0.5
`);

const validationSchema = Yup.object({
  title: Yup.string()
    .max(15, 'Must be 15 characters or less')
    .required('Required'),
  description: Yup.string()
    .max(5000, 'Must be 5000 characters or less')
    .required('Required'),
  price: Yup.string()
    .matches(
      /^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/,
      'The start price must be a number with at most 2 decimals'
    )
    .required('Required'),
  quantity: Yup.string()
    .matches(
      /^\s*-?(\d)*$/,
      'The quantity must be a Whole number'
    )
    .required('Required'),
  massOfItem: Yup.string()
    .matches(
      /^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/,
      'The mass of Item should not be Zero or less and it must be a number with at most 2 decimals.'
    )
    .required('Required'),
});

export default function InventoryModal(properties) {

  console.log("properties", properties);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (body) => {
    setIsSubmitting(true);

    try {
      body.price *= 100;
      // const formData = new FormData();
      console.log('body', body);
      // Object.keys(body).forEach((key) => formData.append(key, body[key]));
      // for (var value of formData.values()) {
      //   console.log(value);
      // }
      const { data } = await axios.post(`/api/inventory/${properties.listing.id}`, body);
      toast.success('Sucessfully updated items in Inventory!');
      Router.push(`/listings/${data.slug}`);
    } catch (err) {
      console.log('err', err);
      console.log('err', err.response);

      err.response.data?.errors.forEach((err) => toast.error(err.message));
    }

    setIsSubmitting(false);
  };

  if (properties.open) {

    return (
      <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div style={{ padding: '30px', maxWidth: '50rem' }} className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            Update Inventory
            <Formik
              initialValues={{
                title: properties.listing.title,
                description: properties.listing.description,
                price: properties.listing.currentPrice / 100,
                massOfItem: properties.listing.massOfItem,
                quantity: properties.listing.quantity,
              }}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {(props) => (
                <Form className="space-y-8 py-5 divide-y divide-gray-200">
                  <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div className="space-y-6 sm:space-y-5">
                      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                          Title
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                          <Field
                            type="text"
                            name="title"
                            className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-4xl sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage
                            component={StyledErrorMessage}
                            name="title"
                          />
                        </div>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                          Description
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                          <Field
                            as="textarea"
                            name="description"
                            rows={6}
                            className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-4xl sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage
                            component={StyledErrorMessage}
                            name="description"
                          />
                        </div>
                      </div>

                      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                          Start Price
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                          <Field
                            type="text"
                            name="price"
                            className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500  sm:max-w-4xl sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage
                            component={StyledErrorMessage}
                            name="price"
                          />
                        </div>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                          Quantity
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                          <Field
                            type="text"
                            name="quantity"
                            className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500  sm:max-w-4xl sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage
                            component={StyledErrorMessage}
                            name="quantity"
                          />
                        </div>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="massOfItem"
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                          Mass of Item
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                          <div className="relative flex items-stretch flex-grow focus-within:z-10">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">g</span>
                            </div>
                            <Field
                              type="number"
                              name="massOfItem"
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-7 sm:text-sm border-gray-300"
                            />
                          </div>
                          <ErrorMessage
                            component={StyledErrorMessage}
                            name="massOfItem"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="pt-5"> */}

                  {/* </div> */}
                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => properties.setOpen(false)}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {isSubmitting ? 'Updating Inventory Item...' : 'Update Inventory Item'}
                      </button>
                    </div>

                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}