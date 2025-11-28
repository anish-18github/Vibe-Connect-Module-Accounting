import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate(-1);   // go back safely
    }, []);

    return null;
}
