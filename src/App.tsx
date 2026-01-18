import Register from "./component/auth/Register";
import Header from "./component/layout/Header";
import ListUser from "./component/pages/ListUsers";
import { Routes,Route } from "react-router-dom";
function App(){

 return(
  <div>
  <Header/>
  <Routes>
    <Route path="/register" element={<Register/>}/>
    <Route path="/list" element={<ListUser/>}/>
  </Routes>
 </div>
 )
}

export default App;
