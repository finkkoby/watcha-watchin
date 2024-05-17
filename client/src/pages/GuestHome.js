import { Outlet } from "react-router-dom";

function GuestHome() {
    return (
        <div>
            <h1>Guest Home</h1>
            <Outlet />
        </div>
    )
}

export default GuestHome;