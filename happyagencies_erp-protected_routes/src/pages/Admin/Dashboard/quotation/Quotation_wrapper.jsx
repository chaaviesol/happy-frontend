import React from 'react'
import View_quotation from './View_quotation'
import Sidebar from "../../../../components/admin components/Sidebar";
import Newtopbar_ from '../../../../components/admin components/Newtopbar_';
export default function Quotation_wrapper() {
  return (
    <div>
      <Sidebar type="Quotation worklist">
        <Newtopbar_ />
        <View_quotation />
      </Sidebar>
    </div>
  )
}
