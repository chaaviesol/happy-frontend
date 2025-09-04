import React from 'react'
import Sidebar from "../../../../components/admin components/Sidebar";
import Staff_claim from './Staff_claim';

export default function Staff_claim_wraper() {
    return (
        <>
            <Sidebar type="Staff claim list">
                <Staff_claim />
            </Sidebar>
        </>
    )
}
