import InternalUserComponent from '@/components/internalUser'
import InternalUsersLayout from '@/layouts/InternalUsersLayout'
import React from 'react'

const page = () => {
  return (
    <InternalUsersLayout>
      <InternalUserComponent />
    </InternalUsersLayout>
  )
}

export default page