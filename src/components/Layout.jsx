import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <main className="main-content-fix">
           <Outlet />
        </main>
    );
};

export default Layout;
