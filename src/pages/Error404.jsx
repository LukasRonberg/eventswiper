import { useLocation } from "react-router-dom";

function Error404() {
const location = useLocation();


    return (  
        <>
        
        <h1>Not found</h1>
        <p>No content found for {location.pathname}</p>
        </>
    );
}

export default Error404;