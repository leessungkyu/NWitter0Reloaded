import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { Button, Logo } from "./auth-components";


export default function GithubButton(){
    const navigate = useNavigate();
    const onClick = async () => {
        try{
            const provider = new GithubAuthProvider();
            await signInWithPopup(auth, provider);
            navigate("/");
        } catch(e) {
            console.error(e);
        }
    }
    return (<Button onClick={onClick}>
        <Logo src="/github-icon.svg" />
        Continue with Github
    </Button>)
}