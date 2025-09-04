import React from 'react'
import Leave_lists from './Leave_lists'
import Sidebar from "../../../../components/admin components/Sidebar";
export default function Leave_list_wraper() {
    return (
        <Sidebar type="Leave list">
            <Leave_lists />
        </Sidebar>
        )
}
