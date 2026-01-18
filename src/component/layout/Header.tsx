import { Link } from "react-router-dom";
function Header(){
    return(
        <nav className=" flex text-[20px] p-4 font-bold justify-center gap-6  bg-orange-100">
            <Link to="/register" className="hover:text-blue-600">Register</Link>
            <Link to="/list" className="hover:text-blue-600">List_User</Link>
        </nav>
    )
}

export default Header;