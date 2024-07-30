import { toast } from 'sonner'
import { useState } from 'react'
import { Spinner } from 'flowbite-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { adminLogIn } from '../../../api/function'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    submitHandler(data)
  }

  //If username & password exist then only its make api call to user authentication.
  const submitHandler = ({ username, password }) => {
    try {
      if (username && password) {
        setIsLoading(true)
        let headers = {
          'Content-Type': 'application/json',
        }
        let promise = adminLogIn(
          JSON.stringify({ username, password }),
          headers
        )
        toast.promise(promise, {
          loading: 'Loading...',
          success: (userInfo) => {
            if (userInfo?.data?.token) {
              localStorage.setItem(
                'token',
                JSON.stringify(userInfo?.data?.token)
              )
              navigate('/', { replace: true })
            } else {
              throw new Error('Error while login')
            }
            return `Login successful. Welcome !`
          },

          error: (err) => err || 'Error',
        })
      }
    } catch (error) {
      console.error('Error while login ', error)
      toast.error('Error while login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className='flex flex-col md:flex-row h-screen w-screen items-center'>
      <div className='bg-white border  w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-fit px-6 lg:px-16 xl:px-12 flex items-center justify-center pb-6 rounded'>
        <div className='w-full h-100'>
          <h1 className='text-xl md:text-2xl font-bold leading-tight mt-12 text-gray-900'>
            Log in to your account
          </h1>
          <form className='mt-6' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor='username' className='block text-gray-700'>
                Username
              </label>

              <input
                type='text'
                id='username'
                placeholder='username'
                className='w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none text-gray-900'
                {...register('username', {
                  required: true,
                  maxLength: 90,
                  autofocus: true,
                  autoComplete: true,
                })}
              />
            </div>
            <div className='mt-4'>
              <label
                htmlFor='password'
                className={`block ${
                  errors?.password?.type !== 'pattern'
                    ? 'text-gray-700'
                    : 'text-red-900'
                }`}
              >
                Password
              </label>

              <input
                type='password'
                id='password'
                placeholder='password'
                data-popover-target='popover-password'
                data-popover-placement='bottom'
                className={`w-full px-4 py-3 rounded-lg mt-2 ${
                  errors?.password?.type !== 'pattern'
                    ? 'bg-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none text-gray-900'
                    : 'border bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500'
                }`}
                {...register('password', {
                  required: true,
                  maxLength: 90,
                  pattern: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/i,
                })}
              />

              {/* POPOVER */}
              <div
                data-popover='popover-password'
                id='popover-password'
                role='tooltip'
                className='absolute z-10 invisible inline-block text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400'
              >
                <div className='p-3 space-y-2'>
                  <h3 className='font-semibold text-gray-900 dark:text-white'>
                    Must have at least 8 characters
                  </h3>
                  <div className='grid grid-cols-4 gap-2'>
                    <div className='h-1 bg-orange-300 dark:bg-orange-400' />
                    <div className='h-1 bg-orange-300 dark:bg-orange-400' />
                    <div className='h-1 bg-gray-200 dark:bg-gray-600' />
                    <div className='h-1 bg-gray-200 dark:bg-gray-600' />
                  </div>
                  <p>{'It’s better to have:'}</p>
                  <ul>
                    <li className='flex items-center mb-1'>
                      <svg
                        className='w-3.5 h-3.5 me-2 text-green-400 dark:text-green-500'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 16 12'
                      >
                        <path
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M1 5.917 5.724 10.5 15 1.5'
                        />
                      </svg>
                      Upper &amp; lower case letters
                    </li>
                    <li className='flex items-center mb-1'>
                      <svg
                        className='w-3 h-3 me-2.5 text-gray-300 dark:text-gray-400'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 14 14'
                      >
                        <path
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                        />
                      </svg>
                      A symbol (#$&amp;)
                    </li>
                    <li className='flex items-center'>
                      <svg
                        className='w-3 h-3 me-2.5 text-gray-300 dark:text-gray-400'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 14 14'
                      >
                        <path
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                        />
                      </svg>
                      A longer password (min. 8 chars.)
                    </li>
                  </ul>
                </div>
                <div data-popper-arrow='' />
              </div>
            </div>
            <button
              type='submit'
              disabled={isLoading || errors.username || errors.password}
              className={`w-full flex gap-2 justify-center bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6 ${
                isLoading ? 'cursor-wait bg-indigo-400' : 'cursor-pointer'
              }`}
            >
              {isLoading ? <Spinner /> : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
