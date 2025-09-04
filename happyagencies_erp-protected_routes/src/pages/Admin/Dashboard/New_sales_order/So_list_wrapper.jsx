import React from 'react'
import So_list from './So_list'
import Sidebar from '../../../../components/admin components/Sidebar'
import Newtopbar_ from '../../../../components/admin components/Newtopbar_'
export default function So_list_wrapper() {
  return (
    <div>
      <Sidebar type="so_list">
        <Newtopbar_ />
        <So_list />
      </Sidebar>
    </div>
  )
}
