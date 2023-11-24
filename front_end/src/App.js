import React, {lazy,Suspense} from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
// import CityList from "./pages/CityList";
// import Map from './pages/Map'
// import Detail from './pages/Detail'
// import Login from './pages/Login'
import AuthRoute from './components/AuthRoute'
// import Favorate from './pages/Favorate'
// import Rent from './pages/Rent'
// import RentAdd from './pages/Rent/Add'
// import Search from './pages/Rent/Search'
const CityList = lazy(()=>import("./pages/CityList"))
const Detail = lazy(()=>import("./pages/Detail"))
const Map = lazy(()=>import("./pages/Map"))
const Login = lazy(()=>import("./pages/Login"))
const Favorate = lazy(()=>import("./pages/Favorate"))
const Rent = lazy(()=>import("./pages/Rent"))
const RentAdd = lazy(()=>import("./pages/Rent/Add"))
const Search = lazy(()=>import("./pages/Rent/Search"))
// const Registe = lazy(()=>import('./pages/Registe'))


function App() {
  return (
    <Router>
    <Suspense fallback={<div className="route-loading">loading</div>}>
      <div className="App">
        {/*配置路由*/}
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <Route path="/home" component={Home} />
        <Route path="/citylist" component={CityList} />
        <AuthRoute path="/map" component={Map}></AuthRoute>
        <Route path="/detail/:id" component={Detail}></Route>
        <Route path="/login" component={Login}></Route>
        {/* <Route path="/registe" component={Registe}></Route> */}
        <Route path="/favorate" component={Favorate}></Route>
        <AuthRoute exact path="/rent" component={Rent}></AuthRoute>
        <AuthRoute  path="/rent/add" component={RentAdd}></AuthRoute>
        <AuthRoute  path="/rent/search" component={Search}></AuthRoute>
      </div>
      </Suspense>
    </Router>
  );
}

export default App;
