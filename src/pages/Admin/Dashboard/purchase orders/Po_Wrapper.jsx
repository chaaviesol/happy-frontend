import React from 'react'
import Sidebar from "../../../../components/admin components/Sidebar";
import PurchaseOrders from './PurchaseOrders';
import { useContext } from 'react';
import { MyContext } from '../../../../Contexts/Contexts';
import H_Side from '../../../hidden/components/H_Side';
export default function PoSo_Wrapper() {
    const {isHidden}=useContext(MyContext)
    const SidebarToRender = isHidden ? H_Side : Sidebar;
    return (
        <div>
            <SidebarToRender type="polist">
                <PurchaseOrders />
            </SidebarToRender>


        </div>
    )
}
