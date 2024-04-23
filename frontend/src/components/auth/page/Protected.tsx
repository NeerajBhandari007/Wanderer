import { useAppSelector } from '../../../mainStore/common'
import { selectLoggedInUser } from '../authSlice'
import { Navigate } from 'react-router-dom';
export default function Protected({children}:any) {
    const user=useAppSelector(selectLoggedInUser);
    if(!user){
        return <Navigate to="/signIn" replace={true}></Navigate>;
    }
    return children;
}
