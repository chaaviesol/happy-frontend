import React from 'react'
import Sidebar from '../../../../components/admin components/Sidebar'
import New_sales_order from './New_sales_order';
export default function New_sales_wrapper() {
    return (
        <div>

            <Sidebar type="new_sales_order">
                <New_sales_order />
            </Sidebar>

        </div>
    )
}
