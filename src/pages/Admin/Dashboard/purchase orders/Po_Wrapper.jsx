import React from 'react'
import Sidebar from "../../../../components/admin components/Sidebar";
import PurchaseOrders from './PurchaseOrders';
import { useContext } from 'react';
import { MyContext } from '../../../../Contexts/Contexts';
import H_Side from '../../../hidden/components/H_Side';
import Newtopbar_ from '../../../../components/admin components/Newtopbar_';
import Headline from '../../../../components/admin components/Headline';
export default function PoSo_Wrapper() {
    const {isHidden}=useContext(MyContext)
    const SidebarToRender = isHidden ? H_Side : Sidebar;
    return (
        <>
            <SidebarToRender type="polist">
                <div
                    style={{
                        height: "calc(100vh - 60px)",
                        overflowY: "auto",
                    }}
                >
                    <div
                        style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "white",
                        }}
                    >
                        <Newtopbar_ />
                        <Headline title="Purchase Orders" />
                    </div>
                    <PurchaseOrders />
                </div>
            </SidebarToRender>
        </>
    )
}
