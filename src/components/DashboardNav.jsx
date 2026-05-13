import React from 'react'

const DashboardNav = () => {
    return (
        <div >
            <ul className='flex flex-col h-screen gap-4  overflow-none '>
                <li>Dashboard</li>
                <li>Orders</li>
                <li>Inventory</li>
                <li>Customers</li>
                <li>Reports and Analytics</li>
                <p>other</p>
                <li>Settings</li>
                <li>Logout</li>
            </ul>
        </div>
    )
}

export default DashboardNav
