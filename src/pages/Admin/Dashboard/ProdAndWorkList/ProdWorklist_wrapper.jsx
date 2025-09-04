import React from 'react'
import Sidebar from "../../../../components/admin components/Sidebar";
import ProdWorklist from './ProdWorklist';
import { useLocation } from 'react-router-dom';
import Newtopbar_ from '../../../../components/admin components/Newtopbar_';
export default function ProdWorklist_wrapper() {
  const location = useLocation();
  const navigatedWorklist = { navPage: location.state };

  return (
    <div>
        <Sidebar type="worklist" activeWorklistPage={navigatedWorklist.navPage}>
          <Newtopbar_ />
            <ProdWorklist/>
        </Sidebar>
        
    </div>
  )
}
