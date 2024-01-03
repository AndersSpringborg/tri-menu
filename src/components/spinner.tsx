export const Spinner = () => (
  <div className='flex flex-row items-center justify-center'>
    <p className='animate-pulse pr-2 text-gray-600 dark:text-gray-400'>
      Loading...
    </p>
    <div className='h-4 w-4 animate-spin content-center rounded-full border-b-2 border-t-2 border-gray-900 dark:border-gray-100' />
  </div>
);
